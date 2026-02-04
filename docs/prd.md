# Product Requirements Document (PRD)

## Objective

Build an AI-powered micro-venture accelerator that helps Latam entrepreneurs validate and launch their business ideas in 7 days through audio-first interactions, structured action plans, and evidence-based progress tracking.

## Target User

**Primary**: Aspiring micro-entrepreneurs in Latin America
- Age: 25-45
- Context: Want to start small business (tiendas, services, artisan products)
- Constraints: Limited capital, limited time, uncertain where to start
- Needs: Practical guidance, confidence building, accountability
- Behavior: Mobile-first, prefer voice over typing, need simple steps

**Example User**: Sofía, 32, wants to expand her corner store (tienda de abarrotes) in El Piñón, Magdalena. Unsure if neighbors would buy prepared foods. Has 2-3 hours/day to work on it.

## User Journey (Happy Path)

### Phase 1: Discovery (5 minutes)
1. User opens Florece app on mobile
2. Logs in (Firebase Auth - mock ok for demo)
3. AI agent greets in Spanish/English, asks "¿Qué quieres vender?"

### Phase 2: Diagnostic (10 minutes)
4. Agent asks 5 questions:
   - What product/service?
   - Who are your customers?
   - Cost per unit?
   - Price per unit?
   - Hours available per day?
5. User responds via voice (transcribed) or text
6. Agent confirms understanding

### Phase 3: Analysis (30 seconds)
7. Agent calculates unit economics (margin, profit potential)
8. Agent shares findings: "Good news! 40% margin is healthy"
9. Agent asks if user wants to continue

### Phase 4: Planning (2 minutes)
10. Agent generates 7-day action plan
11. Plan includes 5 key actions (e.g., "Talk to 3 neighbors", "Create price list")
12. Each action is concrete, verifiable, low-cost
13. User reviews and accepts plan

### Phase 5: Execution (7 days)
14. User sees today's action on home screen
15. User completes action (e.g., talks to neighbors)
16. User uploads evidence (photo/audio/document)
17. Agent verifies evidence using Gemini Vision/Audio
18. Action marked as "verified" ✓
19. Repeat for next actions

### Phase 6: Completion
20. After completing actions, user requests receipt
21. Agent generates completion certificate
22. Shows progress: "5/5 actions completed! 🎉"
23. User can share receipt or continue with new plan

## Demo Flow (3 minutes)

**Case**: La Sofía - tienda de abarrotes, El Piñón

```
1. Login → "Sofía" (mock)
2. Diagnostic →
   - Product: "Comidas preparadas para llevar"
   - Customers: "Vecinos que trabajan"
   - Cost: $2 per meal
   - Price: $5 per meal
   - Time: 3 hours/day
3. Agent → "60% margin! Great start. Let's validate demand."
4. Plan →
   Day 1: Talk to 3 neighbors
   Day 2: Create menu with prices
   Day 3: Make 5 sample meals
   Day 4: Get feedback from neighbors
   Day 5: Adjust pricing/menu
5. Action 1 → Record voice note of neighbor conversation
6. Upload → Voice file to Storage
7. Verify → Gemini confirms conversation happened
8. Receipt → "1/5 actions completed (20%)"
```

## Scope

### IN SCOPE (MVP)

**Core Flow**
- 5-question diagnostic (voice or text input)
- Unit economics calculator
- 7-day plan generation with 5 actions
- Action tracking (pending → in_progress → completed → verified)
- Evidence upload (image, audio, document)
- Evidence verification (Gemini Vision/Audio)
- Completion receipt/certificate

**Technical**
- Next.js 16 App Router
- Firebase (Firestore, Storage, Auth)
- Cloud Run agent service
- Gemini function calling
- Mobile-responsive UI
- Audio recording/playback

**User Experience**
- Audio-first interactions
- Spanish/English support (no formal i18n)
- Mobile-first design
- Simple, encouraging tone

### OUT OF SCOPE (Post-MVP)

- Multi-user collaboration
- Payment processing
- Marketplace/directory
- Advanced analytics dashboards
- Social features (followers, likes)
- Multiple plan durations (only 7-day)
- Video evidence
- Offline mode
- Push notifications
- Email marketing
- Internationalization framework
- Custom branding per user
- API for third parties

### SCOPE FREEZE

Once implemented, these cannot change without major refactor:
- Firestore schema (collections, core fields)
- Tool function signatures
- Evidence types (image, audio, document)
- 7-day plan structure
- Next.js App Router (no pages/ router)

## Success Metrics

### Demo Success (Hackathon)
- [ ] Demo completes in under 3 minutes
- [ ] All 8 demo steps work without errors
- [ ] Agent responds in under 2 seconds
- [ ] Evidence verification completes in under 5 seconds
- [ ] UI is thumb-friendly on mobile

### Technical Success
- [ ] TypeScript builds with zero errors
- [ ] No secrets exposed in client code
- [ ] All API routes require auth
- [ ] Firestore rules prevent unauthorized access
- [ ] Evidence files upload successfully
- [ ] Agent logs all tool calls for debugging

### User Experience Success
- [ ] Agent feels encouraging and helpful
- [ ] Voice recording works on mobile Safari/Chrome
- [ ] Actions are concrete and achievable
- [ ] Evidence requirements are clear
- [ ] Completion receipt feels rewarding

## Tech Stack

### Frontend
- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Firebase SDK 11.2.0 (client)

### Backend
- Next.js API Routes (BFF)
- Cloud Run (agent service)
- Firebase Admin SDK 13.0.1
- Google Gemini API (direct REST)

### Infrastructure
- Firebase Firestore (database)
- Firebase Storage (evidence files)
- Firebase Auth (user authentication)
- Cloud Run (agent hosting)
- Vercel (Next.js hosting - optional)

### Development
- pnpm 9.15.0
- Firebase Emulators
- TypeScript strict mode
- ESLint

## User Stories

### US-001: Diagnostic
**As** an aspiring entrepreneur
**I want** to answer questions about my idea
**So that** the AI can understand my business

**Acceptance**:
- Agent asks 5 questions
- I can respond via voice or text
- Agent confirms my answers
- Agent calculates unit economics

### US-002: Plan Generation
**As** a user with a validated idea
**I want** to receive a 7-day action plan
**So that** I know what to do next

**Acceptance**:
- Plan has exactly 5 actions
- Actions are specific and achievable
- Each action takes 1-4 hours
- Actions are ordered by day

### US-003: Evidence Upload
**As** a user completing an action
**I want** to upload proof
**So that** my progress is tracked

**Acceptance**:
- I can upload photo, audio, or document
- File size limited to 10MB
- Upload completes in under 10 seconds
- I get confirmation of upload

### US-004: Verification
**As** a user who uploaded evidence
**I want** to know if it's accepted
**So that** I can move to the next action

**Acceptance**:
- Agent reviews evidence in under 5 seconds
- I get clear feedback (approved/rejected)
- If rejected, I get suggestions
- If approved, action marked verified

### US-005: Receipt
**As** a user who completed actions
**I want** to see my progress certificate
**So that** I feel accomplished

**Acceptance**:
- Receipt shows X/5 actions completed
- Completion percentage displayed
- Encouraging message included
- Can view all past receipts

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gemini API rate limits | High | Implement exponential backoff, cache responses |
| Evidence verification inaccurate | Medium | Set confidence threshold, allow manual override |
| Firebase costs exceed budget | Medium | Set up billing alerts, use emulators for dev |
| Voice recording fails on iOS | High | Test on Safari, provide text fallback |
| Agent generates unrealistic actions | Medium | Use templates, validate with business rules |
| User uploads unrelated evidence | Low | Clear instructions, Gemini verification |

## Open Questions

1. Should receipt be shareable on social media?
2. Do we need action reminders (daily)?
3. Should users be able to edit their diagnostic answers?
4. What happens after completing the 7-day plan?
5. Do we need admin dashboard for support?

## Next Steps

1. ✅ Set up repo structure
2. ✅ Create documentation
3. ⬜ Implement Firebase schema
4. ⬜ Build agent orchestration
5. ⬜ Create UI components
6. ⬜ Integrate Gemini API
7. ⬜ Test happy path end-to-end
8. ⬜ Deploy demo environment
