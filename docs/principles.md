# Florece Principles

## NON-NEGOTIABLE RULES

1. **App Router Only** — No `pages/` router. All routes live in `src/app/`.

2. **Server-Side Secrets** — Gemini API keys and all secrets NEVER run in the browser. All LLM calls occur in Cloud Run or via Next.js API routes (BFF) calling Cloud Run.

3. **Firebase SDK Separation**
   - **Admin SDK**: Server-side only (API routes, Cloud Run)
   - **Client SDK**: Client components only, where strictly needed

4. **Deterministic Tools** — Tools are server-side functions with defined inputs/outputs. The LLM can call them but cannot "invent" outputs.

5. **Happy Path MVP** — Keep the demo flow simple and working:
   - Login (mock acceptable for hackathon)
   - 5Q diagnostic
   - Run Agent
   - Generate 7-day plan + 5 actions
   - Complete 1 action
   - Upload evidence
   - Verify evidence
   - Generate receipt

6. **No Overengineering** — Minimal structure, explicit env handling, simple patterns. Ship fast, refactor later.

## Audio-First Guideline

- **Voice leads, text supports**: The primary interaction is voice input/output
- UI shows transcripts and confirmations
- Mobile-first design: thumb-friendly, large touch targets
- Audio feedback for state changes

## Hackathon Scope

### IN SCOPE
- Core diagnostic → plan → action → verify flow
- Voice input/output
- Basic Firebase auth (mock ok)
- Agent orchestration with Gemini
- Simple unit economics calculator
- Evidence upload + verification
- Receipt generation

### OUT OF SCOPE
- Multi-user collaboration
- Payment processing
- Advanced analytics dashboards
- Production-grade error handling
- Internationalization
- Offline support
- Complex role-based permissions
