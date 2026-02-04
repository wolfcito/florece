# Scope Management

## Scope Freeze List

These decisions are **locked** for the MVP. Changing them requires major refactor and team consensus.

### Data Schema
- ✅ Firestore collections: cases, products, events, plans, actions, evidence, receipts, agent_runs
- ✅ Action statuses: pending, in_progress, completed, verified
- ✅ Evidence statuses: pending, approved, rejected
- ✅ Evidence types: image, audio, document (max 3)

### Architecture
- ✅ Next.js App Router (no pages/ router)
- ✅ Cloud Run for agent service (separate from Next.js)
- ✅ Firebase as primary backend
- ✅ Gemini for LLM (direct API with adapter for Vertex)

### User Flow
- ✅ 5-question diagnostic
- ✅ 7-day plan horizon (no custom durations)
- ✅ Exactly 5 actions per plan
- ✅ Login → Diagnostic → Plan → Action → Evidence → Verify → Receipt

### Technical Constraints
- ✅ Server-side secrets only
- ✅ Firebase Admin SDK server-side only
- ✅ Deterministic tools (no LLM data invention)
- ✅ Audio-first UX design

## Milestones & Definition of Done

### H0: Foundation (Hours 0-8)

**Goal**: Repo set up, documentation complete, environment working

**DoD (Minimum)**:
- [ ] All docs/ files exist and are complete
- [ ] `pnpm install` succeeds
- [ ] `pnpm tsc --noEmit` passes
- [ ] Firebase emulators run locally
- [ ] `.env.local` template documented
- [ ] Git repo has granular commits

**Deliverables**:
- ✅ docs/README.md
- ✅ docs/AGENTS.md
- ✅ docs/prd.md
- ✅ docs/scope.md
- ✅ docs/architecture.md
- ✅ docs/data-model.md
- ✅ docs/api.md
- ✅ docs/tools.md
- ✅ docs/security.md
- ✅ docs/dev.md
- ✅ Repo structure (src/app, src/agent, src/tools, src/lib, src/types)

---

### H1: Agent Core (Hours 8-24)

**Goal**: Agent can execute tools and generate plans

**DoD (Minimum)**:
- [ ] Gemini client can send/receive messages
- [ ] toolRegistry registers all 7 tools
- [ ] computeUnitEconomics works end-to-end
- [ ] generatePlan returns valid 7-day structure
- [ ] createActions writes to Firestore
- [ ] orchestrator.ts completes one agent run
- [ ] agent_runs collection logs execution

**Deliverables**:
- [ ] `src/agent/gemini/client.ts` (implemented)
- [ ] `src/agent/gemini/toolRegistry.ts` (7 tools registered)
- [ ] `src/agent/orchestrator.ts` (functional loop)
- [ ] All tool functions in `src/tools/` (implemented)
- [ ] Unit tests for computeUnitEconomics
- [ ] Integration test with Firebase emulator

**Validation**:
```bash
# Can run agent orchestration
curl -X POST http://localhost:3000/api/run-agent \
  -H "Authorization: Bearer test-token" \
  -d '{"message": "I want to sell tacos", "caseId": "test-case-1"}'
# Returns valid response
```

---

### H2: UI & Evidence Flow (Hours 24-48)

**Goal**: User can complete diagnostic, see plan, upload evidence

**DoD (Minimum)**:
- [ ] Landing page renders
- [ ] Voice recorder component works
- [ ] 5Q diagnostic UI complete
- [ ] Plan display shows 5 actions
- [ ] Evidence upload flow functional
- [ ] Verification shows result
- [ ] Receipt page displays completion

**Deliverables**:
- [ ] `src/app/page.tsx` (landing)
- [ ] `src/app/diagnostic/page.tsx` (5Q flow)
- [ ] `src/app/plan/[id]/page.tsx` (plan view)
- [ ] `src/app/actions/[id]/page.tsx` (action detail)
- [ ] `src/components/VoiceRecorder.tsx`
- [ ] `src/components/EvidenceUpload.tsx`
- [ ] Mobile-responsive CSS

**Validation**:
- [ ] Can record voice on mobile
- [ ] Can upload image evidence
- [ ] UI works on iPhone Safari
- [ ] UI works on Android Chrome

---

### H3: End-to-End Demo (Hours 48-56)

**Goal**: Complete happy path works without errors

**DoD (Minimum)**:
- [ ] Demo script runs in under 3 minutes
- [ ] All API routes return valid responses
- [ ] Evidence verification completes
- [ ] Receipt generation works
- [ ] No TypeScript errors
- [ ] No console errors in browser

**Demo Script**:
1. Open app → "La Sofía" case
2. Complete 5Q diagnostic (voice)
3. Generate plan (auto)
4. Complete action 1 (upload voice note)
5. Verify evidence (Gemini approves)
6. Generate receipt (1/5 complete)
7. Show receipt on screen

**Validation**:
```bash
# All tests pass
pnpm test

# Build succeeds
pnpm build

# No security issues
pnpm audit

# Demo completes
./scripts/run-demo.sh
```

**Deliverables**:
- [ ] Demo seed data script
- [ ] Demo walkthrough video (2 min)
- [ ] README with demo instructions
- [ ] Deployment to staging environment

---

## Scope Decision Matrix

When asked to add a feature, use this matrix:

| Category | In Scope? | Action |
|----------|-----------|--------|
| Critical for demo | ✅ Yes | Prioritize now |
| Enhances core flow | ⚠️ Maybe | Add to H3 if time permits |
| Nice-to-have | ❌ No | Document for post-MVP |
| Requires new infrastructure | ❌ No | Reject for MVP |
| Violates non-negotiables | 🚫 Never | Reject permanently |

### Examples

| Feature | Decision | Rationale |
|---------|----------|-----------|
| Add 6th diagnostic question | ⚠️ Maybe | Doesn't break flow, low effort |
| Allow 14-day plans | ❌ No | Changes schema, out of scope |
| Add video evidence | ❌ No | New file type, complex processing |
| Improve error messages | ✅ Yes | Critical for UX |
| Add dark mode | ❌ No | Nice-to-have, not core value |
| Multi-language i18n | ❌ No | Out of scope per decision log |
| Admin dashboard | ❌ No | Out of scope, add later |
| Gemini vision for logo | ⚠️ Maybe | Fits evidence flow if time |

## Out of Scope (Explicit)

### Features
- Payment processing or subscriptions
- Multi-user workspace or collaboration
- Social features (likes, comments, followers)
- Marketplace or venture directory
- Advanced analytics or reporting
- Email campaigns or notifications
- Custom branding per user
- White-label or multi-tenant
- API for third-party integrations
- Mobile app (native iOS/Android)

### Technical
- GraphQL API
- Real-time collaborative editing
- Offline mode with sync
- Custom authentication system
- Rate limiting (beyond Firebase)
- CDN for static assets
- Database sharding or read replicas
- Message queue (Pub/Sub, SQS)
- ElasticSearch or full-text search
- Redis caching layer

### Operational
- 24/7 on-call support
- SLA guarantees
- GDPR compliance tooling
- SOC2 certification
- Penetration testing
- Load testing beyond demo scale
- Disaster recovery plan
- Multi-region deployment

## Change Request Process

If you want to change something in the scope freeze list:

1. Document the request in decision-log.md
2. Estimate implementation time
3. Identify what gets deprioritized
4. Get team consensus
5. Update all affected docs
6. Create migration plan if needed
7. Commit with "BREAKING:" prefix

**Example**:
```
BREAKING: change action statuses to include 'blocked'

Rationale: Need to track dependencies between actions
Impact: Requires schema migration, UI updates
Time: 4 hours
Trade-off: Delays H2 by 0.5 days
```

## Scope Creep Red Flags

Watch for these phrases:

- "It would be cool if..."
- "What if we also..."
- "Can we just add..."
- "Users might want..."
- "In the future, we'll need..."
- "This is a quick win..."

**Response**: "Great idea! Let's add it to the post-MVP backlog."

## Post-MVP Backlog

Track out-of-scope ideas here:

1. 30-day plan option
2. Action dependencies (block action 2 until action 1 done)
3. Team collaboration (invite co-founder)
4. Export plan to PDF
5. WhatsApp integration for reminders
6. Voice-to-voice (no text transcription)
7. Gemini-generated action images
8. Supplier marketplace
9. Venture public profiles
10. Progress leaderboard

## Success Criteria

MVP is **done** when:

- [ ] All H0, H1, H2, H3 DoD items complete
- [ ] Demo runs in under 3 minutes
- [ ] No critical bugs in happy path
- [ ] Documentation is accurate and complete
- [ ] Code is deployed to staging
- [ ] Team can present confidently

MVP is **not done** until:
- Every item in "Scope Freeze List" is implemented
- Happy path works end-to-end
- Demo script succeeds 3 times in a row
