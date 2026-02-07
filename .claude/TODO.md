## Session Plan - 2026-02-07 15:30

### Current State
- ✅ **Completed**: Backend core implementation - Gemini integration (E1) + Agent orchestration (E2) - 7 issues closed
  - Full agent loop working with function calling
  - computeUnitEconomics tool tested end-to-end
  - Test endpoint confirming Spanish responses with tool execution
  - Model: gemini-2.5-flash, SDK: 0.24.1

- 🚧 **In Progress**: M1 Agent Core milestone - 50% complete (9/18 issues)
  - E3: Business Tools - 2/6 complete (generatePlan, createReceipt, publishVenture, recommendSuppliers partially done)
  - E4: Evidence Pipeline - 0/5 complete (blocked on Firebase Storage configuration)

- ⚠️ **Blockers**:
  - Firebase Admin credentials not configured (affects logging, Storage)
  - No .env.local with FIREBASE_ADMIN_CREDENTIALS
  - Evidence pipeline blocked until Storage setup complete

- 🔧 **Tech Debt**:
  - No unit tests yet (US-E7-03 pending)
  - Partially implemented tools need completion
  - Firebase emulator not configured for local dev

### Project Context
- **Type**: Web (Next.js Full-Stack)
- **Stack**: Next.js 16, React 19, TypeScript, Firebase (Auth, Firestore, Storage), Gemini AI, Tailwind CSS 4
- **Package Manager**: pnpm (enforced)
- **Testing**: Not yet configured (Jest/Vitest needed)
- **Git**: Clean working tree, 2 commits ahead of origin

### Next Steps (Prioritized)

#### Priority 1: Critical - Complete M1 Agent Core

1. **Complete E3: Business Tools (generatePlan, createReceipt, publishVenture, recommendSuppliers)** - L
   - **Why**: Core agent functionality depends on these tools
   - **Files**: `src/tools/generatePlan.ts`, `src/tools/createReceipt.ts`, `src/tools/publishVenture.ts`, `src/tools/recommendSuppliers.ts`
   - **Acceptance**:
     - [ ] All 4 tools fully implemented with TypeScript types
     - [ ] Registered in toolRegistry with JSON schemas
     - [ ] Manual test confirms each tool executes via agent
     - [ ] Tool results properly formatted for Gemini continuation
   - **Notes**: generatePlan and createReceipt marked "🚧 Parcial" in backlog
   - **Dependencies**: None - can start immediately
   - **Issues**: #28, #30, #31, #32

2. **Configure Firebase Admin & Storage** - M
   - **Why**: Unblocks E4 Evidence Pipeline + agent logging
   - **Files**: `.env.local`, `src/lib/firebase/admin.ts`
   - **Acceptance**:
     - [ ] FIREBASE_ADMIN_CREDENTIALS in .env.local (from Firebase Console)
     - [ ] Firebase Admin SDK initializes successfully
     - [ ] Storage bucket configured and accessible
     - [ ] Test file upload/download works
     - [ ] Agent runs successfully log to Firestore
   - **Notes**: Check docs/security.md for security rules
   - **Dependencies**: Firebase project must exist

3. **Implement E4: Evidence Pipeline (upload, verify with Vision/Audio)** - L
   - **Why**: Critical for demo flow - users need to upload evidence
   - **Files**: `src/app/api/upload-evidence/route.ts`, `src/app/api/verify-evidence/route.ts`, `src/tools/verifyEvidence.ts`
   - **Acceptance**:
     - [ ] Upload endpoint generates signed URLs for Storage
     - [ ] Supports image/audio/document (max 10MB)
     - [ ] Gemini Vision analyzes images
     - [ ] Gemini Audio transcribes and analyzes audio
     - [ ] Verification updates action status to "verified"
     - [ ] Manual test: upload photo → verify → see approval/rejection
   - **Notes**: US-E4-03 and US-E4-04 are both P0 critical
   - **Dependencies**: Firebase Storage must be configured first
   - **Issues**: #1, #2, #3, #4, #5

#### Priority 2: High - Enable Frontend Development

4. **Start E5: User Interface - Diagnostic Flow (5Q)** - L
   - **Why**: Enables user to complete diagnostic and get plan
   - **Files**: `src/app/diagnostic/page.tsx`, `src/components/VoiceRecorder.tsx`
   - **Acceptance**:
     - [ ] Step-by-step UI (1 question per screen, 5 total)
     - [ ] Text input + voice recorder toggle
     - [ ] Progress indicator (1/5, 2/5, etc.)
     - [ ] Mobile-first responsive design
     - [ ] Calls /api/run-agent with answers
     - [ ] Transitions to plan view after completion
   - **Notes**: VoiceRecorder must work on Safari iOS + Chrome Android
   - **Dependencies**: Agent already working, can build UI
   - **Issues**: #34 (diagnostic flow), #35 (voice recorder)

5. **Implement E5: Plan & Action Views** - M
   - **Why**: Show generated plan and allow action completion
   - **Files**: `src/app/plan/[id]/page.tsx`, `src/app/actions/[id]/page.tsx`, `src/components/EvidenceUpload.tsx`
   - **Acceptance**:
     - [ ] Plan view shows 5 actions with status indicators
     - [ ] Click action → opens detail page
     - [ ] Action detail shows description + evidence type
     - [ ] Upload evidence button triggers file picker/camera
     - [ ] Progress bar during upload
     - [ ] Manual test: complete diagnostic → see plan → open action → upload evidence
   - **Notes**: Requires E4 Evidence Pipeline complete
   - **Dependencies**: E4 must be done first
   - **Issues**: #36 (plan view), #37 (action detail), #38 (evidence upload)

6. **Implement E6: Firebase Authentication** - M
   - **Why**: Protect routes and secure user data
   - **Files**: `src/app/login/page.tsx`, `src/middleware.ts`
   - **Acceptance**:
     - [ ] Login with email/password (mock ok for demo)
     - [ ] Middleware verifies token on /api/* routes
     - [ ] Redirect to /login if not authenticated
     - [ ] Logout functional
     - [ ] Session persists across page reloads
   - **Notes**: Mock auth acceptable for hackathon demo
   - **Dependencies**: None
   - **Issues**: #40, #41

#### Priority 3: Medium - Demo Readiness

7. **Create E7: Demo Seed Data & Scripts** - S
   - **Why**: Make demo reproducible and reliable
   - **Files**: `scripts/seed-demo.ts`, `scripts/run-demo.sh`
   - **Acceptance**:
     - [ ] Seed script creates test user "Sofía"
     - [ ] Pre-loads case "La tienda de Sofía" with completed diagnostic
     - [ ] Reset script clears test data
     - [ ] Demo script provides step-by-step instructions
     - [ ] Demo completes in < 3 minutes
     - [ ] Runs 3 times successfully without errors
   - **Notes**: Use Firebase emulator for safe testing
   - **Dependencies**: E2E flow must work first
   - **Issues**: #43, #44

8. **Add E7: Unit Tests for Tools** - M
   - **Why**: Prevent regressions, validate tool behavior
   - **Files**: `src/tools/__tests__/*.test.ts`
   - **Acceptance**:
     - [ ] Test framework configured (Vitest recommended for Next.js)
     - [ ] Tests for computeUnitEconomics (happy path + edge cases)
     - [ ] Tests for generatePlan (structure validation)
     - [ ] Tests for createActions (Firestore writes)
     - [ ] Tests for verifyEvidence (Gemini Vision mocked)
     - [ ] Coverage > 80% for tools directory
     - [ ] `pnpm test` passes
   - **Notes**: Mock Firebase and Gemini for unit tests
   - **Dependencies**: None - can be done anytime
   - **Issues**: #45

#### Priority 4: Low - Polish & Refinement

9. **Create Landing Page & Navigation** - S
   - **Why**: Professional first impression, easy navigation
   - **Files**: `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/Navigation.tsx`
   - **Acceptance**:
     - [ ] Hero section with value proposition
     - [ ] CTA button → /diagnostic
     - [ ] Mobile-first responsive
     - [ ] Loads in < 2 seconds
     - [ ] Bottom nav for mobile (Home, Plan, Profile)
     - [ ] Header with logo and menu
   - **Notes**: Use Tailwind CSS 4, avoid generic AI aesthetics
   - **Dependencies**: None
   - **Issues**: #33 (landing), #39 (navigation)

10. **Implement Receipt Generation & View** - S
    - **Why**: Motivational completion certificate
    - **Files**: `src/tools/createReceipt.ts`, `src/app/receipts/[id]/page.tsx`
    - **Acceptance**:
      - [ ] Receipt shows X/5 actions completed
      - [ ] Progress percentage calculated
      - [ ] Motivational message in Spanish
      - [ ] Visual certificate (could be simple styled div for MVP)
      - [ ] Shareable link (optional)
    - **Notes**: Post-MVP feature, low priority
    - **Dependencies**: E5 complete (plan and actions working)
    - **Issues**: #42 (receipt view)

---

### Technical Decisions Made
- **Gemini Model**: Using `models/gemini-2.5-flash` with SDK 0.24.1 for function calling
- **Tool Pattern**: Deterministic server-side functions registered in toolRegistry
- **Agent Orchestration**: Max 10 iterations, graceful error handling, Firestore logging
- **Package Manager**: Enforcing pnpm via CLAUDE.md instructions
- **Testing Strategy**: Manual E2E tests working, unit tests pending

### Notes for Next Session
- **Backend core is fully functional** - Agent loop + Gemini integration working E2E
- **Main blocker**: Firebase Admin credentials needed for Storage and logging
- **Parallel work possible**: E3 tools + E5 UI can be developed simultaneously
- **Demo target**: Full happy path (Login → Diagnostic → Plan → Evidence → Receipt)
- **Timeline**: 4 milestones total, currently in M1 (50% complete)
- **Keep in mind**: Audio-first UX, mobile-first design, Spanish language support
- **Reference docs**: docs/AGENTS.md (must read), docs/backlog.md (complete stories), docs/architecture.md (system design)

### Quick Commands
```bash
# Development
pnpm dev              # Start dev server (port 3002)
pnpm type-check       # TypeScript validation
pnpm lint             # ESLint check

# Testing
curl -X POST http://localhost:3002/api/test-agent \
  -H "Content-Type: application/json" \
  -d '{"message":"Tamales: costo 20, vendo 50, 100/mes"}'

# Firebase (when configured)
firebase emulators:start  # Run local emulators
pnpm seed-demo            # Seed test data (once script created)

# Git
git status
git log --oneline -10
git push origin main      # Push recent commits
```

---

**Planning Strategy:** Frontend-focused path prioritizes E3 tools completion first (unblocks everything), then E4 evidence pipeline (critical for demo), then E5 UI components (user-facing), then E6 auth (security), then E7 testing/demo (validation). This maximizes parallel work potential and delivers user value incrementally.

**Estimated Effort:**
- Priority 1: ~24 hours (E3: 12h, Firebase: 3h, E4: 9h)
- Priority 2: ~20 hours (E5: 14h, E6: 6h)
- Priority 3: ~8 hours (E7: 8h)
- Priority 4: ~6 hours (polish)
- **Total to MVP**: ~58 hours (~7-8 full days of development)
