# AGENTS.md - Critical Context for AI Agents

**READ THIS FIRST if you're an AI agent working on this repo.**

## Purpose

Florece is a 7-day micro-venture accelerator for Latam entrepreneurs. Audio-first mobile app. Gemini-powered AI coaching. Evidence-based progress tracking.

## Non-Negotiable Constraints

1. **App Router Only** - No `pages/` router. All routes in `src/app/`
2. **Server-Side Secrets** - Gemini API keys NEVER in browser. All LLM calls via Cloud Run or Next.js API routes
3. **Firebase SDK Separation** - Admin SDK server-side only. Client SDK in client components only
4. **Deterministic Tools** - Tools are pure functions. LLM invokes but cannot invent outputs
5. **Happy Path MVP** - Demo flow must work: Login → 5Q → Agent → Plan → Action → Evidence → Verify → Receipt
6. **No Overengineering** - Simple patterns. Ship fast. Refactor later

## Repo Map

### UI Layer (`src/app/`)

```
src/app/
├── page.tsx              # Landing/home
├── layout.tsx            # Root layout
├── globals.css           # Tailwind styles
└── api/                  # BFF (Backend-for-Frontend)
    ├── run-agent/route.ts       # POST - Trigger agent
    ├── upload-evidence/route.ts # POST - Get signed upload URL
    ├── verify-evidence/route.ts # POST - Verify evidence
    └── receipts/route.ts        # POST/GET - Receipts
```

**Purpose**: Mobile-first UI, voice recorder/player, Firebase Auth, display agent responses

### BFF Layer (`src/app/api/`)

**Purpose**: Auth verification, proxy to agent service, Firestore writes, secret management

**Key Files**:
- `run-agent/route.ts` - Calls Cloud Run agent service
- `upload-evidence/route.ts` - Generates signed Storage URLs
- `verify-evidence/route.ts` - Triggers evidence verification
- `receipts/route.ts` - Creates/fetches completion certificates

### Agent Service (`src/agent/`)

```
src/agent/
├── orchestrator.ts              # Main agent loop
└── gemini/
    ├── client.ts                # Gemini API wrapper
    ├── prompts.ts               # System prompts
    └── toolRegistry.ts          # Tool definitions + execution
```

**Purpose**: Gemini orchestration, function calling, tool execution, conversation management

**Key Files**:
- `orchestrator.ts` - Runs agent with context, manages tool calls
- `gemini/client.ts` - Sends messages to Gemini, handles function calls
- `gemini/toolRegistry.ts` - Registers tools, executes handlers
- `gemini/prompts.ts` - Agent personality, constraints, behavior

### Tools (`src/tools/`)

**All tools are deterministic server-side functions.**

```
src/tools/
├── computeUnitEconomics.ts    # Calculate margin, profit
├── generatePlan.ts            # Create 7-day plan
├── createActions.ts           # Write actions to Firestore
├── verifyEvidence.ts          # Gemini Vision/Audio verification
├── createReceipt.ts           # Generate completion certificate
├── recommendSuppliers.ts      # Suggest suppliers (optional)
└── publishVenture.ts          # Public sharing (optional)
```

**See [tools.md](tools.md) for complete contracts.**

### Shared Libraries (`src/lib/`)

```
src/lib/
├── env.ts                      # Typed env var accessor
└── firebase/
    ├── admin.ts                # Firebase Admin SDK (server)
    ├── client.ts               # Firebase Client SDK (browser)
    └── emulators.ts            # Emulator config
```

### Types (`src/types/`)

```
src/types/
├── domain.ts                   # Case, Action, Evidence, etc.
└── tools.ts                    # Tool input/output types
```

## Tools Summary

| Tool | Input | Output | Purpose |
|------|-------|--------|---------|
| computeUnitEconomics | cost, price, volume | margin, revenue, profit | Calculate economics |
| generatePlan | case, product, hours | 7-day plan structure | Create action plan |
| createActions | plan, days, actions | actionIds[] | Write to Firestore |
| verifyEvidence | evidenceId, fileUrl, action | verified: bool, reasoning | Gemini verification |
| createReceipt | caseId, planId, completedIds | receiptId, completion% | Certificate |

**Details:** [tools.md](tools.md)

## API Summary

### Next.js BFF Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/run-agent` | POST | Required | Trigger agent orchestration |
| `/api/upload-evidence` | POST | Required | Get signed upload URL |
| `/api/verify-evidence` | POST | Required | Verify uploaded evidence |
| `/api/receipts` | POST/GET | Required | Create/fetch receipts |

### Cloud Run Endpoints (Internal)

| Endpoint | Caller | Purpose |
|----------|--------|---------|
| `/runAgent` | Next.js BFF | Execute agent with Gemini |
| `/verifyEvidence` | Next.js BFF | Run Gemini Vision/Audio |
| `/createReceipt` | Next.js BFF | Generate certificate |

**Details:** [api.md](api.md)

## Data Model Summary

**Firestore Collections:**

- `cases` - User venture sessions
- `products` - Product/service definitions
- `events` - Timeline events
- `plans` - 7-day action plans
- `actions` - Individual tasks (status: pending → in_progress → completed → verified)
- `evidence` - Proof files (status: pending → approved/rejected)
- `receipts` - Completion certificates
- `agent_runs` - Debug logs

**Details:** [data-model.md](data-model.md)

## Validation Checklist

Before committing code, verify:

### TypeScript
```bash
pnpm tsc --noEmit
```
**Must pass with zero errors.**

### Linting
```bash
pnpm lint
```
**Must pass or have justified exceptions.**

### Build
```bash
pnpm build
```
**Must complete successfully.**

### Environment
```bash
# Check .env.example is up to date
# Verify no secrets in client code
grep -r "GEMINI_API_KEY" src/app --include="*.tsx" --include="*.ts" | grep -v "api/"
# Should return nothing
```

### Security
- [ ] No `firebase-admin` imports in `src/app` (except `src/app/api/`)
- [ ] No `GEMINI_API_KEY` usage outside `src/agent/` or `src/app/api/`
- [ ] All API routes verify auth with `verifyAuthToken()`
- [ ] All Firestore queries filter by `userId`

### Happy Path Demo
- [ ] Login works (mock ok)
- [ ] 5Q diagnostic completes
- [ ] Agent generates plan
- [ ] Plan has 5 actions
- [ ] Action can be marked complete
- [ ] Evidence upload works
- [ ] Verification returns result
- [ ] Receipt generated

## DO NOT List

### Absolutely Never Do This

1. **DO NOT** use `pages/` router - App Router only
2. **DO NOT** import `firebase-admin` in client components
3. **DO NOT** call Gemini API from browser/client code
4. **DO NOT** expose secrets via `NEXT_PUBLIC_*` env vars
5. **DO NOT** skip auth verification in API routes
6. **DO NOT** return raw Firestore documents without filtering by userId
7. **DO NOT** allow tools to invent data - must be deterministic
8. **DO NOT** create multi-tenant features - single user MVP
9. **DO NOT** add payment processing - out of scope
10. **DO NOT** implement i18n - Spanish/English mixing is fine

### Architecture Violations

- **DO NOT** create REST API outside Next.js API routes
- **DO NOT** add Express server
- **DO NOT** use WebSockets (out of scope)
- **DO NOT** add Redis or caching layer (premature)
- **DO NOT** implement custom auth (use Firebase Auth)

### Code Quality Violations

- **DO NOT** commit TypeScript errors
- **DO NOT** disable ESLint rules without justification
- **DO NOT** add dependencies without checking `package.json` first
- **DO NOT** create placeholder/stub implementations without TODO comments
- **DO NOT** duplicate code that could be a shared utility

## Working with This Repo

### When Adding Features

1. Check [scope.md](scope.md) - Is this in scope?
2. Check [prd.md](prd.md) - Does this align with product vision?
3. Check [architecture.md](architecture.md) - Which layer does this belong to?
4. Write code
5. Run validation checklist
6. Update docs if needed
7. Commit with clear message

### When Fixing Bugs

1. Identify which layer has the bug (UI, BFF, Agent, Tools)
2. Check relevant documentation
3. Fix the issue
4. Run validation checklist
5. Add regression test if possible
6. Commit with "fix:" prefix

### When Adding Tools

1. Define contract in [tools.md](tools.md)
2. Create type definitions in `src/types/tools.ts`
3. Implement in `src/tools/yourTool.ts`
4. Register in `src/agent/gemini/toolRegistry.ts`
5. Add tests (happy path minimum)
6. Update this document

## Common Issues

### "Cannot find module 'firebase-admin'"
- Run `pnpm install`
- Check `package.json` has `firebase-admin`

### "Missing environment variable"
- Copy `.env.example` to `.env.local`
- Fill in actual values
- Never commit `.env.local`

### "Auth token verification failed"
- Check `Authorization: Bearer <token>` header
- Verify token is from Firebase Auth
- Check token hasn't expired

### "Tool execution failed"
- Check tool input matches schema
- Verify tool returns `ToolResult<T>` format
- Check Firestore permissions if writing data

## Next Steps

1. Read [PRD](prd.md) for product context
2. Read [Architecture](architecture.md) for system design
3. Read [Data Model](data-model.md) for schema details
4. Read [Dev Guide](dev.md) for setup instructions
5. Start coding with happy path in mind

## Questions?

- Architecture: [architecture.md](architecture.md)
- API contracts: [api.md](api.md)
- Data schema: [data-model.md](data-model.md)
- Security: [security.md](security.md)
- Development: [dev.md](dev.md)
