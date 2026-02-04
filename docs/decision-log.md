# Decision Log (ADR-Lite)

Architectural decisions and their rationale. Date format: 2026-02-04.

---

## 2026-02-04: Next.js App Router

**Decision**: Use Next.js 16 App Router exclusively (no Pages Router)

**Rationale**: App Router provides better server component support, streaming, and RSC patterns. Simplifies BFF implementation with API route handlers. Avoids legacy patterns and reduces bundle size. Team familiarity with React 19 server components.

**Alternatives Considered**: Pages Router (legacy), standalone Express API (too complex)

---

## 2026-02-04: Firebase as Primary Backend

**Decision**: Use Firebase (Firestore + Storage + Auth) for all backend services

**Rationale**: Managed service reduces ops overhead during hackathon. Real-time capabilities for future features. Generous free tier. Strong mobile SDK support. Easy emulator setup for local dev. Team has existing Firebase experience.

**Alternatives Considered**: Supabase (less mobile-focused), MongoDB Atlas (more ops), custom Postgres (too much setup)

---

## 2026-02-04: Cloud Run for Agent Service

**Decision**: Deploy agent orchestration as separate Cloud Run service

**Rationale**: Isolates compute-heavy Gemini calls from Next.js frontend. Allows independent scaling of agent workloads. Easier to migrate to Vertex AI later. Keeps Next.js deployment simple (Vercel-compatible). Clear separation of concerns.

**Alternatives Considered**: Next.js API routes only (timeout issues), Cloud Functions (cold starts), separate VM (too much ops)

---

## 2026-02-04: Gemini Direct API (with Vertex adapter plan)

**Decision**: Use Gemini API directly via REST for hackathon, design adapter for Vertex AI migration

**Rationale**: Direct API simpler for rapid prototyping. No GCP project setup overhead initially. Easy to test and iterate. Adapter pattern allows clean migration to Vertex AI post-hackathon without changing tool code. Function calling works identically in both.

**Alternatives Considered**: Vertex AI from start (slower setup), OpenAI (less multimodal), Claude (no function calling)

---

## 2026-02-04: Audio-First UX Approach

**Decision**: Design all interactions for voice input/output with text as fallback

**Rationale**: Target users (Latam micro-entrepreneurs) often prefer voice over typing. Higher engagement with spoken interactions. Differentiates from text-heavy competitors. Leverages Gemini's multimodal capabilities. Mobile-first aligns with voice-first.

**Alternatives Considered**: Text-first with audio option (less engaging), chat-only (less accessible)

---

## 2026-02-04: Deterministic Tools Pattern

**Decision**: All agent tools are pure server-side functions with strict input/output contracts

**Rationale**: Prevents LLM hallucination of data. Makes debugging tractable. Enables testing without LLM. Clear audit trail of what agent did. Firestore writes are explicit and traceable. Aligns with function calling best practices.

**Alternatives Considered**: LLM generates data directly (unreliable), tools with side effects (hard to debug)

---

## 2026-02-04: Mock Auth for MVP

**Decision**: Allow mock/simplified auth for hackathon demo, real Firebase Auth in code

**Rationale**: Auth setup can block demo progress. Focus on core value prop (agent coaching) not auth flow. Firebase Auth code is production-ready when needed. Demo can use single test user. Reduces friction in 7-day timeline.

**Alternatives Considered**: Full auth from start (slower), no auth (insecure), magic link only (email dependency)

---

## 2026-02-04: Single Firestore Region

**Decision**: Deploy Firestore in single region (us-central1 or southamerica-east1)

**Rationale**: Multi-region adds complexity with no user benefit at MVP stage. Latency acceptable for target users. Simplifies backup/export. Lower cost. Can migrate later if needed.

**Alternatives Considered**: Multi-region (premature), local-only (no persistence)

---

## 2026-02-04: TypeScript Strict Mode

**Decision**: Enable TypeScript strict mode and require type safety

**Rationale**: Catches errors at compile time. Makes refactoring safer. Improves IDE autocomplete. Aligns with Next.js best practices. Small upfront cost, large long-term benefit.

**Alternatives Considered**: Loose types (tech debt), JavaScript (no type safety)

---

## 2026-02-04: pnpm as Package Manager

**Decision**: Use pnpm for dependency management (enforced via engines field)

**Rationale**: Faster installs than npm/yarn. Disk space efficient. Strict dependency resolution prevents phantom deps. Workspace support for future monorepo. Already configured in repo.

**Alternatives Considered**: npm (slower), yarn (less strict)

---

## 2026-02-04: Tailwind CSS for Styling

**Decision**: Use Tailwind CSS v4 for all styling

**Rationale**: Rapid prototyping with utility classes. Mobile-first responsive design built-in. Small production bundle. No CSS naming conflicts. Team velocity preference.

**Alternatives Considered**: CSS Modules (more boilerplate), styled-components (runtime cost), plain CSS (slower iteration)

---

## 2026-02-04: Evidence Types Limited to Three

**Decision**: Support only image, audio, document evidence types

**Rationale**: Covers 95% of use cases. Simplifies upload flow. Gemini supports all three modalities. Easy to validate. Keeps MVP focused.

**Alternatives Considered**: Video (large files, complex processing), unlimited types (harder to verify)

---

## 2026-02-04: 7-Day Plan Horizon Only

**Decision**: All plans are exactly 7 days, no customization

**Rationale**: Constraint forces focus. Easy to explain and demo. Aligns with "move fast" entrepreneurship. Simplifies UI. Future can add 30-day plans.

**Alternatives Considered**: Flexible duration (more complex), 30 days (too long for MVP)

---

## 2026-02-04: La Sofía Demo Case

**Decision**: Standardize on "La Sofía" (tienda de abarrotes, El Piñón) for all demos and seed data

**Rationale**: Concrete example is easier to understand than abstract placeholder. Relatable to target audience. Provides realistic test data. Consistent across docs and code.

**Alternatives Considered**: Generic "Store A" (less engaging), multiple examples (confusing)

---

## 2026-02-04: No Internationalization (i18n)

**Decision**: Hard-code Spanish/English mixing, no i18n framework

**Rationale**: Target users are bilingual Latam entrepreneurs. i18n adds complexity for minimal value at MVP stage. Agent can respond in user's language naturally. Reduces bundle size.

**Alternatives Considered**: Full i18n (overkill), Spanish-only (limits reach), English-only (bad UX)

---

## Future Decisions to Document

- Deployment strategy (Vercel vs Cloud Run for Next.js)
- Error tracking solution (Sentry vs alternatives)
- Analytics approach (GA4 vs Mixpanel vs PostHog)
- A/B testing framework (if needed)
