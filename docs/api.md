# API Reference

All API endpoints for Florece. Next.js BFF routes are public-facing. Cloud Run endpoints are internal only.

---

## Next.js BFF Endpoints

Base URL: `https://your-domain.com` (or `http://localhost:3000` for dev)

### Authentication

All endpoints require Firebase Auth token in header:

```http
Authorization: Bearer <firebase-id-token>
```

Get token from Firebase Auth client SDK:
```typescript
const token = await auth.currentUser.getIdToken();
```

---

## POST `/api/run-agent`

Trigger agent orchestration with user message.

### Request

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**:
```typescript
{
  message: string;           // User's message or voice transcript
  caseId: string;            // Current case/session ID
  sessionId?: string;        // Optional session for multi-turn conversation
}
```

**Example**:
```json
{
  "message": "Quiero vender tacos en mi colonia",
  "caseId": "case_abc123",
  "sessionId": "sess_001"
}
```

### Response

**Success (200)**:
```typescript
{
  success: true;
  response: string;          // Agent's text response (for TTS)
  toolCallsExecuted: number; // Number of tools called
  agentRunId: string;        // ID of agent_run document
}
```

**Example**:
```json
{
  "success": true,
  "response": "¡Excelente idea! Los tacos son muy populares. Vamos a calcular si el negocio es rentable. ¿Cuánto te costaría hacer un taco?",
  "toolCallsExecuted": 0,
  "agentRunId": "run_xyz789"
}
```

**Error (400, 401, 500)**:
```typescript
{
  success: false;
  error: string;
}
```

### Tool Execution Flow

When agent needs to call a tool:
1. Agent decides to call `computeUnitEconomics`
2. Tool executes on Cloud Run
3. Result returned to agent
4. Agent continues with result
5. Final response sent to client

---

## POST `/api/upload-evidence`

Get signed URL for direct upload to Firebase Storage.

### Request

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**:
```typescript
{
  actionId: string;          // Action being completed
  caseId: string;            // Case ID
  fileType: 'image' | 'audio' | 'document';
  fileName: string;          // Original file name
  fileSize: number;          // File size in bytes
}
```

**Validation**:
- `fileSize` max: 10MB (10485760 bytes)
- `fileType` must be one of: image, audio, document
- `fileName` sanitized for storage path

**Example**:
```json
{
  "actionId": "act_001",
  "caseId": "case_abc123",
  "fileType": "audio",
  "fileName": "neighbor_conversation.m4a",
  "fileSize": 524288
}
```

### Response

**Success (200)**:
```typescript
{
  success: true;
  uploadUrl: string;         // Signed URL for PUT request
  evidenceId: string;        // Created evidence document ID
  fileUrl: string;           // Final gs:// URL
  expiresIn: number;         // Seconds until URL expires (300)
}
```

**Example**:
```json
{
  "success": true,
  "uploadUrl": "https://storage.googleapis.com/...",
  "evidenceId": "evd_voice_001",
  "fileUrl": "gs://florece-dev/evidence/user_sofia_001/evd_voice_001/file.m4a",
  "expiresIn": 300
}
```

**Client Upload Flow**:
```typescript
// 1. Get signed URL
const { uploadUrl, evidenceId } = await fetch('/api/upload-evidence', {...});

// 2. Upload file directly to Storage
await fetch(uploadUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: { 'Content-Type': fileBlob.type }
});

// 3. Verify evidence
await fetch('/api/verify-evidence', {
  body: JSON.stringify({ evidenceId, actionId })
});
```

**Error (400, 413)**:
```typescript
{
  success: false;
  error: string;
}
```

Common errors:
- `"File size exceeds 10MB limit"` (413)
- `"Invalid file type"` (400)
- `"Missing required fields"` (400)

---

## POST `/api/verify-evidence`

Verify uploaded evidence using Gemini Vision/Audio.

### Request

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**:
```typescript
{
  evidenceId: string;        // Evidence document ID
  actionId: string;          // Associated action ID
}
```

**Example**:
```json
{
  "evidenceId": "evd_voice_001",
  "actionId": "act_001"
}
```

### Response

**Success (200)**:
```typescript
{
  success: true;
  verified: boolean;         // Whether evidence is accepted
  confidence: number;        // 0-1 confidence score
  reasoning: string;         // Explanation of decision
  suggestions?: string[];    // If rejected, what to improve
}
```

**Approved Example**:
```json
{
  "success": true,
  "verified": true,
  "confidence": 0.92,
  "reasoning": "Clear audio recording of conversation with neighbor Maria. She confirms interest in buying prepared meals at $5. Action requirement met."
}
```

**Rejected Example**:
```json
{
  "success": true,
  "verified": false,
  "confidence": 0.35,
  "reasoning": "Audio is unclear and doesn't mention prepared meals or pricing. Cannot verify action completion.",
  "suggestions": [
    "Record in a quieter location",
    "Speak clearly about the specific product (prepared meals)",
    "Ask about willingness to pay $5"
  ]
}
```

**Error (404, 403)**:
```typescript
{
  success: false;
  error: string;
}
```

### Side Effects

If verified:
- Evidence document updated: `verificationStatus = 'approved'`
- Action document updated: `status = 'verified'`

If rejected:
- Evidence document updated: `verificationStatus = 'rejected'`
- Action status unchanged

---

## POST `/api/receipts`

Generate completion receipt/certificate.

### Request

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**:
```typescript
{
  caseId: string;            // Case ID
  planId: string;            // Plan ID
}
```

**Example**:
```json
{
  "caseId": "case_abc123",
  "planId": "plan_xyz"
}
```

### Response

**Success (200)**:
```typescript
{
  success: true;
  receiptId: string;         // Created receipt document ID
  completedActions: number;  // Number of verified actions
  totalActions: number;      // Total actions in plan
  completionRate: number;    // 0-1 completion percentage
  certificateUrl?: string;   // Optional certificate PDF/image
  message: string;           // Congratulatory message
}
```

**Example**:
```json
{
  "success": true,
  "receiptId": "rct_001",
  "completedActions": 3,
  "totalActions": 5,
  "completionRate": 0.6,
  "message": "🌟 Great job! You completed most of your plan!"
}
```

**Messages by completion rate**:
- 100%: "🎉 Amazing! You completed all actions in your 7-day plan!"
- 80-99%: "🌟 Great job! You completed most of your plan!"
- 50-79%: "👏 Good progress! You're halfway there!"
- <50%: "💪 Every step counts! Keep going!"

---

## GET `/api/receipts?caseId={caseId}`

Retrieve all receipts for a case.

### Request

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Params**:
- `caseId`: string (required)

**Example**:
```
GET /api/receipts?caseId=case_abc123
```

### Response

**Success (200)**:
```typescript
{
  success: true;
  receipts: Array<{
    id: string;
    caseId: string;
    planId: string;
    completedActions: number;
    totalActions: number;
    completionRate: number;
    generatedAt: string;      // ISO 8601 timestamp
    message: string;
  }>;
}
```

**Example**:
```json
{
  "success": true,
  "receipts": [
    {
      "id": "rct_002",
      "caseId": "case_abc123",
      "planId": "plan_xyz",
      "completedActions": 5,
      "totalActions": 5,
      "completionRate": 1.0,
      "generatedAt": "2026-02-11T15:00:00Z",
      "message": "🎉 Amazing! You completed all actions!"
    },
    {
      "id": "rct_001",
      "caseId": "case_abc123",
      "planId": "plan_xyz",
      "completedActions": 1,
      "totalActions": 5,
      "completionRate": 0.2,
      "generatedAt": "2026-02-04T15:40:00Z",
      "message": "💪 Every step counts! Keep going!"
    }
  ]
}
```

---

## Cloud Run Endpoints (Internal Only)

Base URL: `https://agent-service-xyz.run.app` (from `AGENT_SERVICE_URL` env var)

**Authentication**: Service-to-service (no user auth required)

---

## POST `/runAgent` (Cloud Run)

**Internal Only** - Called by Next.js BFF `/api/run-agent`

Execute agent with Gemini function calling.

### Request

```typescript
{
  message: string;
  context: {
    caseId: string;
    userId: string;
    sessionId?: string;
  };
}
```

### Response

```typescript
{
  response: string;
  toolCallsExecuted: number;
  agentRunId: string;
  status: 'success' | 'partial' | 'error';
}
```

---

## POST `/verifyEvidence` (Cloud Run)

**Internal Only** - Called by Next.js BFF `/api/verify-evidence`

Run Gemini Vision/Audio verification.

### Request

```typescript
{
  evidenceId: string;
  fileUrl: string;           // gs:// URL
  fileType: 'image' | 'audio' | 'document';
  actionDescription: string; // What action should evidence prove
}
```

### Response

```typescript
{
  verified: boolean;
  confidence: number;
  reasoning: string;
  suggestions?: string[];
}
```

---

## POST `/createReceipt` (Cloud Run)

**Internal Only** - Called by Next.js BFF `/api/receipts`

Generate receipt with certificate.

### Request

```typescript
{
  caseId: string;
  userId: string;
  planId: string;
  completedActionIds: string[];
}
```

### Response

```typescript
{
  receiptId: string;
  completedActions: number;
  totalActions: number;
  completionRate: number;
  certificateUrl?: string;
  message: string;
}
```

---

## Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Missing fields, invalid JSON |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | User doesn't own resource |
| 404 | Not Found | Resource doesn't exist |
| 413 | Payload Too Large | File exceeds 10MB |
| 500 | Internal Server Error | Gemini API error, Firestore error |
| 503 | Service Unavailable | Cloud Run timeout |

---

## Rate Limits

**Development**: No rate limits

**Production** (future):
- `/api/run-agent`: 60 requests/minute per user
- `/api/upload-evidence`: 20 requests/minute per user
- `/api/verify-evidence`: 30 requests/minute per user

Enforced via Firebase App Check or Cloud Armor.

---

## Testing Endpoints

### curl Examples

**Run Agent**:
```bash
curl -X POST http://localhost:3000/api/run-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "message": "Quiero vender tacos",
    "caseId": "demo_case_sofia"
  }'
```

**Upload Evidence**:
```bash
curl -X POST http://localhost:3000/api/upload-evidence \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "actionId": "act_001",
    "caseId": "demo_case_sofia",
    "fileType": "audio",
    "fileName": "evidence.m4a",
    "fileSize": 500000
  }'
```

**Verify Evidence**:
```bash
curl -X POST http://localhost:3000/api/verify-evidence \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "evidenceId": "evd_voice_001",
    "actionId": "act_001"
  }'
```

**Get Receipts**:
```bash
curl http://localhost:3000/api/receipts?caseId=demo_case_sofia \
  -H "Authorization: Bearer <your-token>"
```

---

## Postman Collection

See `postman/florece-api.json` for complete Postman collection with examples.

---

## SDK (Future)

```typescript
import { FloreceClient } from '@florece/client';

const client = new FloreceClient({ authToken });

// Run agent
const response = await client.runAgent({
  message: 'Quiero vender tacos',
  caseId: 'case_123'
});

// Upload evidence
const { uploadUrl } = await client.uploadEvidence({
  actionId: 'act_001',
  file: audioBlob
});

// Verify
const result = await client.verifyEvidence({
  evidenceId: 'evd_001',
  actionId: 'act_001'
});
```
