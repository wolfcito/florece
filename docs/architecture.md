# Florece Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│                                                             │
│  Next.js App Router (src/app)                              │
│  - Voice UI components                                     │
│  - Firebase Client SDK (auth, storage uploads)             │
│  - Audio recorder/player                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              Next.js BFF (API Routes)                       │
│                                                             │
│  src/app/api/*                                             │
│  - /run-agent        → Trigger agent orchestration         │
│  - /upload-evidence  → Handle evidence uploads             │
│  - /verify-evidence  → Verify action completion            │
│  - /receipts         → Generate completion receipts        │
│                                                             │
│  Firebase Admin SDK (server-side)                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS
                  │
┌─────────────────▼───────────────────────────────────────────┐
│            Cloud Run Agent Service                          │
│                                                             │
│  src/agent/orchestrator.ts                                 │
│  - Gemini function calling                                 │
│  - Tool registry + execution                               │
│  - Conversation management                                 │
│                                                             │
│  src/tools/*                                               │
│  - Deterministic server functions                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐   ┌──────▼──────┐
│   Firebase     │   │   Gemini    │
│                │   │     API     │
│ - Firestore    │   │             │
│ - Storage      │   │ (Vertex AI) │
│ - Auth         │   │             │
└────────────────┘   └─────────────┘
```

## Layer Responsibilities

### Client (Browser)
- Voice recording and playback
- UI rendering (mobile-first)
- Firebase Auth (login)
- Direct storage uploads (signed URLs)
- Display agent responses and plans

### Next.js BFF (Backend-for-Frontend)
- Authentication verification (Firebase Admin)
- Proxy to Cloud Run agent service
- File validation and metadata
- Database writes (Firestore Admin)
- Secret management (env vars)

### Cloud Run Agent Service
- Gemini LLM orchestration
- Tool function execution
- Business logic (unit economics, plan generation)
- Firestore queries and writes (Admin SDK)
- Deterministic verification logic

### Firebase
- **Firestore**: Primary database
- **Storage**: Evidence files (images, audio, documents)
- **Auth**: User authentication

### Gemini (Vertex AI)
- Function calling for tool invocation
- Natural language understanding
- Plan and recommendation generation

## Data Model (Firestore Collections)

### `cases`
User diagnostic sessions.
```typescript
{
  userId: string
  createdAt: timestamp
  answers: Record<string, any>  // 5Q diagnostic
  status: 'active' | 'completed'
}
```

### `products`
Product/service definitions from diagnostics.
```typescript
{
  caseId: string
  name: string
  description: string
  targetMarket: string
  createdAt: timestamp
}
```

### `events`
Timeline of business milestones.
```typescript
{
  caseId: string
  date: timestamp
  type: 'diagnostic' | 'plan_created' | 'action_completed'
  data: Record<string, any>
}
```

### `plans`
7-day business plans.
```typescript
{
  caseId: string
  productId: string
  createdAt: timestamp
  horizon: '7days'
  goals: string[]
  unitEconomics: {
    cost: number
    price: number
    margin: number
  }
}
```

### `actions`
Individual action items in plans.
```typescript
{
  planId: string
  caseId: string
  day: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'verified'
  createdAt: timestamp
}
```

### `evidence`
Proof of action completion.
```typescript
{
  actionId: string
  caseId: string
  userId: string
  fileUrl: string
  fileType: 'image' | 'audio' | 'document'
  uploadedAt: timestamp
  verificationStatus: 'pending' | 'approved' | 'rejected'
  verificationNotes?: string
}
```

### `receipts`
Completion certificates.
```typescript
{
  caseId: string
  userId: string
  planId: string
  completedActions: number
  totalActions: number
  generatedAt: timestamp
  certificateUrl?: string
}
```

### `agent_runs`
Agent execution logs for debugging.
```typescript
{
  caseId: string
  userId: string
  startedAt: timestamp
  completedAt?: timestamp
  toolCalls: Array<{
    tool: string
    input: any
    output: any
    timestamp: timestamp
  }>
  status: 'running' | 'completed' | 'failed'
  error?: string
}
```

## Security Notes

1. **No Secrets in Client**: All API keys, service account credentials stay server-side
2. **Admin SDK Only Server**: Never import Firebase Admin SDK in client components
3. **Signed URLs**: Storage uploads use time-limited signed URLs
4. **User Isolation**: All queries filter by authenticated `userId`
5. **Input Validation**: Sanitize all user inputs before Firestore writes
6. **Rate Limiting**: Consider rate limiting on API routes (future)

## Environment Variables

- **Client**: `NEXT_PUBLIC_FIREBASE_*` (public Firebase config)
- **Server**:
  - `FIREBASE_ADMIN_CREDENTIALS` or `GOOGLE_APPLICATION_CREDENTIALS`
  - `GEMINI_API_KEY` or Vertex AI config
  - `AGENT_SERVICE_URL` (Cloud Run endpoint)
  - `FIREBASE_PROJECT_ID`

## Deployment

- **Next.js**: Vercel or Cloud Run
- **Agent Service**: Cloud Run (separate service)
- **Firebase**: Managed service (no deployment needed)
