# Security

Security rules, PII handling, and access control for Florece.

---

## PII Definition

**Personally Identifiable Information (PII)** includes:

- Full name
- Email address
- Phone number
- Home address
- Government ID numbers
- Credit card information
- IP addresses (in logs)
- GPS coordinates (precise location)

**Not PII** (for our purposes):
- Business name (e.g., "La Sofía")
- General location (e.g., "El Piñón, Magdalena")
- Product descriptions
- Unit economics (costs, prices)
- Voice recordings about business (if no personal info mentioned)

---

## PII Handling Rules

### Collection
1. **Minimize Collection**: Only collect PII when absolutely necessary
2. **User Consent**: Inform users what data we collect and why
3. **No Credit Cards**: Payment processing is out of scope for MVP
4. **Business Focus**: Encourage users to talk about their business, not personal life

### Storage
1. **Firestore**: Store user email in `users` collection only (from Firebase Auth)
2. **Never Log PII**: No emails, names, or phone numbers in agent_runs or console logs
3. **Encrypt at Rest**: Firestore encrypts all data automatically
4. **Regional Storage**: Keep data in compliance-friendly regions

### Transmission
1. **HTTPS Only**: All API calls use TLS
2. **No Query Params**: Never send PII in URL query parameters
3. **Signed URLs**: Storage uploads use time-limited signed URLs

### Deletion
1. **User Deletion**: When user deletes account, delete all associated cases, evidence, receipts
2. **Retention**: Keep agent_runs logs for 30 days max, then auto-delete
3. **Right to Forget**: Provide endpoint to hard-delete all user data

---

## Project Bank (Sanitization)

Before sending data to Gemini, sanitize PII to prevent leakage.

### What to Sanitize

**In diagnostic answers**:
- Replace phone numbers with `[PHONE]`
- Replace email addresses with `[EMAIL]`
- Replace full names with first name only or `[NAME]`
- Keep business names (La Sofía is fine)
- Keep general locations (El Piñón is fine)

**In voice transcripts**:
- Detect and redact phone numbers
- Detect and redact email addresses
- Keep business-related content

**In evidence files**:
- Images: Blur faces, license plates, IDs before sending to Gemini
- Audio: Transcribe and sanitize transcript, don't send raw audio with personal info
- Documents: OCR and sanitize before analysis

### Sanitization Functions

```typescript
// src/lib/sanitize.ts

export function sanitizeForGemini(text: string): string {
  // Remove phone numbers
  text = text.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');

  // Remove emails
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');

  // Remove credit card patterns
  text = text.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]');

  return text;
}
```

**Apply before Gemini calls**:
```typescript
const sanitizedMessage = sanitizeForGemini(userMessage);
const response = await gemini.sendMessage(sanitizedMessage);
```

---

## Secret Management

### Environment Variables

**Server-Side Secrets** (NEVER in browser):
```bash
# Firebase Admin
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account",...}
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# Gemini API
GEMINI_API_KEY=AIzaSy...
VERTEX_PROJECT_ID=my-project
VERTEX_LOCATION=us-central1

# Agent Service
AGENT_SERVICE_URL=https://agent-xyz.run.app
```

**Client-Side Config** (public, safe to expose):
```bash
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-project
# ... other NEXT_PUBLIC_FIREBASE_* vars
```

### Secret Storage

**Local Development**:
- `.env.local` (gitignored)
- Never commit secrets to git

**Vercel Deployment**:
- Use Vercel Environment Variables
- Mark server-only secrets as "Server" scope

**Cloud Run Deployment**:
- Use Google Secret Manager
- Mount secrets as environment variables
- Grant service account read-only access

### Rotation Policy

**Gemini API Key**:
- Rotate every 90 days
- Rotate immediately if exposed

**Firebase Service Account**:
- Rotate every 180 days
- Use multiple keys during rotation

**Storage Signed URLs**:
- Expire after 5 minutes (300 seconds)
- Generate new URL for each upload

---

## Firebase Storage Access

### Upload Strategy

**Client Direct Upload** (preferred for MVP):
1. Client requests signed URL from `/api/upload-evidence`
2. Server generates time-limited signed URL (5 min)
3. Client uploads directly to Storage using signed URL
4. Server writes evidence metadata to Firestore

**Why**: Reduces server bandwidth, faster uploads, scales better

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Evidence files
    match /evidence/{userId}/{evidenceId}/{fileName} {
      // Read only if authenticated and owner
      allow read: if request.auth != null && request.auth.uid == userId;

      // Write via signed URL only (no direct writes)
      allow write: if false;
    }

    // Receipts/certificates
    match /receipts/{userId}/{receiptId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }
  }
}
```

**Key Points**:
- Users can only read their own files
- Writes happen via signed URLs, not direct client SDK
- No public read access

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Cases
    match /cases/{caseId} {
      allow read, write: if isOwner(resource.data.userId);
    }

    // Products
    match /products/{productId} {
      allow read: if isOwner(get(/databases/$(database)/documents/cases/$(resource.data.caseId)).data.userId);
      allow write: if isOwner(get(/databases/$(database)/documents/cases/$(request.resource.data.caseId)).data.userId);
    }

    // Plans
    match /plans/{planId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId);
      allow update, delete: if isOwner(resource.data.userId);
    }

    // Actions
    match /actions/{actionId} {
      allow read: if isOwner(resource.data.userId);
      // Only allow status updates, not full write
      allow update: if isOwner(resource.data.userId) &&
                       request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'startedAt', 'completedAt', 'verifiedAt']);
    }

    // Evidence
    match /evidence/{evidenceId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId);
      // Only server can verify (via Admin SDK)
      allow update: if false;
    }

    // Receipts (read-only for users)
    match /receipts/{receiptId} {
      allow read: if isOwner(resource.data.userId);
      allow write: if false; // Server writes via Admin SDK
    }

    // Agent runs (read-only for debugging)
    match /agent_runs/{runId} {
      allow read: if isOwner(resource.data.userId);
      allow write: if false;
    }
  }
}
```

**Key Principles**:
1. **Authentication Required**: No unauthenticated access
2. **User Isolation**: Users can only access their own data
3. **Minimal Write Permissions**: Most writes via Admin SDK on server
4. **Field-Level Security**: Actions can only update status fields

---

## API Route Security

### Auth Verification

**Every API route** must verify Firebase Auth token:

```typescript
import { verifyAuthToken } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    // Verify auth token
    const authHeader = request.headers.get('authorization');
    const userId = await verifyAuthToken(authHeader);

    // ... rest of handler
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

### Input Validation

**Validate all inputs** before using:

```typescript
// Bad
const { caseId } = await request.json();
const caseDoc = await db.collection('cases').doc(caseId).get();

// Good
const body = await request.json();
const { caseId } = body;

if (!caseId || typeof caseId !== 'string') {
  return NextResponse.json(
    { success: false, error: 'Invalid caseId' },
    { status: 400 }
  );
}

const caseDoc = await db.collection('cases').doc(caseId).get();

// Verify ownership
if (caseDoc.data()?.userId !== userId) {
  return NextResponse.json(
    { success: false, error: 'Forbidden' },
    { status: 403 }
  );
}
```

### Rate Limiting

**Future**: Add rate limiting to prevent abuse

```typescript
// Using Vercel Edge Config or Redis
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
});

const { success } = await ratelimit.limit(userId);
if (!success) {
  return NextResponse.json(
    { success: false, error: 'Rate limit exceeded' },
    { status: 429 }
  );
}
```

---

## Gemini API Security

### API Key Protection

1. **Never in Browser**: Gemini API key only in server code
2. **Environment Variable**: Store in `GEMINI_API_KEY`
3. **Rotate Regularly**: Every 90 days minimum
4. **Monitor Usage**: Set up billing alerts

### Prompt Injection Prevention

**Sanitize user input** before sending to Gemini:

```typescript
// Prevent prompt injection
function sanitizePrompt(userInput: string): string {
  // Remove system prompt keywords
  const dangerous = ['system:', 'assistant:', 'ignore previous'];
  let sanitized = userInput;

  for (const keyword of dangerous) {
    sanitized = sanitized.replace(new RegExp(keyword, 'gi'), '[FILTERED]');
  }

  return sanitized;
}

const sanitized = sanitizePrompt(userMessage);
const response = await gemini.sendMessage(sanitized);
```

### Output Validation

**Never trust LLM output blindly**:

```typescript
// Validate tool call outputs
const result = await tool.handler(input);

if (!result.success) {
  // Log error, don't expose to user
  console.error('Tool error:', result.error);
  return 'Sorry, something went wrong. Please try again.';
}

// Sanitize before returning to client
return sanitizeForClient(result.data);
```

---

## Incident Response

### If API Key Leaked

1. **Immediate**: Revoke key in Google Cloud Console
2. **Generate**: Create new key
3. **Update**: Update `GEMINI_API_KEY` in all environments
4. **Monitor**: Check for unauthorized usage
5. **Notify**: Inform team and stakeholders

### If User Data Exposed

1. **Assess**: Determine scope of exposure
2. **Contain**: Block further access
3. **Notify**: Email affected users (if required by law)
4. **Audit**: Review security rules and logs
5. **Fix**: Patch vulnerability
6. **Document**: Record incident in decision-log.md

---

## Security Checklist

Before deploying to production:

- [ ] All secrets in environment variables (not code)
- [ ] Firebase Storage rules deployed
- [ ] Firestore Security Rules deployed
- [ ] All API routes verify auth
- [ ] Input validation on all endpoints
- [ ] PII sanitization before Gemini calls
- [ ] HTTPS enforced (no HTTP)
- [ ] CORS configured properly
- [ ] Error messages don't leak secrets
- [ ] Logging doesn't include PII
- [ ] Rate limiting enabled (if available)
- [ ] Security headers configured (CSP, HSTS)

---

## Compliance

### GDPR (Future)

- Right to access: Provide user data export
- Right to deletion: Hard-delete all user data
- Right to portability: Export in JSON format
- Consent: Get consent before data collection

### CCPA (Future)

- Similar to GDPR requirements
- California residents have extra rights

**For MVP**: Focus on basic security, defer compliance to post-launch.

---

## Reporting Security Issues

Email: security@florece.app (future)

For hackathon: Report to team lead immediately.
