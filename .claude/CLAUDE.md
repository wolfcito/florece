# Florece - Claude Code Instructions

## Project Overview

Florece is an AI-powered micro-venture accelerator helping entrepreneurs in Latam build and validate business ideas in 7 days. Audio-first mobile application built with Next.js, Firebase, and Gemini.

**Tech Stack:** Next.js 16, React 19, TypeScript, Firebase (Auth, Firestore, Storage), Gemini AI, Tailwind CSS 4

## Package Manager

**CRITICAL:** This project uses **pnpm**. NEVER use npm commands.

✅ Always use:
- `pnpm install`
- `pnpm add [package]`
- `pnpm run [script]`
- `pnpm dev`

❌ Never use:
- `npm install`
- `npm run`
- Any npm commands

## Git & PR Workflow

### Pull Requests
- When asked for PR title/description, provide **TEXT ONLY**
- Do **NOT** execute `gh pr create` unless explicitly asked
- Format: ## Title, ## Summary, ## Changes, ## Testing

### Commits
- Always include co-author line: `Wolfcito 🐾 @akawolfcito`
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- When creating GitHub issues, **ALWAYS verify milestone assignments** after creation

### Before Pushing
- Verify tests pass (if applicable)
- Run type-check: `pnpm type-check`
- Run linter: `pnpm lint`

## Context Discipline

**IMPORTANT:** Do NOT mix context from unrelated projects in this workspace.

- If multiple projects exist, confirm which one is in scope
- When documentation or context is already loaded, answer questions FROM that context before asking discovery questions
- Do NOT reference or acknowledge data from other projects (e.g., DenLabs, SnowRail, etc.)

## TypeScript / ES Modules

This is a strict TypeScript project with ES modules.

### Rules:
- Always include `.js` extensions in relative imports for ES module projects
- When importing from libraries, **verify types exist** before using them
  - ❌ Don't invent types like `EthereumProvider`
  - ✅ Check actual exports from the library
- Verify CWD path resolution when building Node.js servers or tools
- Use strict type checking (`pnpm type-check` before committing)

## Firebase & Gemini

### Security Rules:
**CRITICAL:** No secrets in client code.

- Firebase Admin SDK → **Server-side only** (API routes, Cloud Run)
- Gemini API calls → **Server-side only** (never in client components)
- Firebase Client SDK → Client components only (auth, storage uploads)
- All API keys must be in `.env.local` (never committed)

### Environment Variables:
- Server-side: `FIREBASE_ADMIN_CREDENTIALS`, `GEMINI_API_KEY`
- Client-side: `NEXT_PUBLIC_FIREBASE_*`
- Check `.env.example` for required variables

## Architecture Patterns

### Project Structure:
```
src/
├── app/           # Next.js App Router
│   ├── api/      # BFF API routes (server-side only)
│   └── ...       # Pages and layouts
├── agent/        # Agent orchestration (Gemini + tools)
├── tools/        # Deterministic agent tools
├── lib/          # Shared utilities
│   ├── firebase/ # Firebase client & admin
│   └── env.ts    # Typed env variables
└── types/        # TypeScript definitions
```

### Key Principles:
- **Server-side first:** All AI/API calls happen server-side
- **Mobile-first:** Audio-first UX, optimized for mobile
- **Simple code:** Hackathon MVP - focus on happy path
- **Iterative:** Ship working code, improve later

## Execution Bias

- **Prefer action over planning**
- Start producing deliverables within the first 2-3 messages
- If exploration is needed, timebox it and communicate what you're doing
- Do **NOT** spend extended time exploring/planning without producing actionable output

## Documentation

- Read `docs/AGENTS.md` first if you're starting a new session
- Check `docs/architecture.md` for system design
- See `docs/api.md` for endpoint specifications
- Update `STATUS.md` at the end of each session with:
  1. What was completed
  2. What's in progress (exact file/line references)
  3. What's blocked and why
  4. Exact next steps for the next session

## Common Workflows

### Starting Development:
```bash
pnpm install
pnpm dev          # Start Next.js dev server
```

### Type Checking & Linting:
```bash
pnpm type-check   # TypeScript check
pnpm lint         # ESLint
```

### Building:
```bash
pnpm build        # Production build
pnpm start        # Start production server
```

### Firebase Emulators (Local Dev):
```bash
firebase emulators:start
# Set NEXT_PUBLIC_USE_EMULATORS=true in .env.local
```

## Skills Available

Use these skills with `/command`:
- `/pr` - Generate PR title and description (text only)
- `/github-setup` - Set up GitHub milestones and issues

## What NOT to Do

❌ Don't use npm (use pnpm)
❌ Don't put secrets in client code
❌ Don't execute `gh pr create` unless asked
❌ Don't mix context from other projects
❌ Don't invent types that don't exist
❌ Don't over-plan without producing output
❌ Don't skip type-checking before committing
❌ Don't create documentation unless asked
❌ Don't add features beyond what's requested

## Session Handoff Protocol

Before ending a session:
1. Update `STATUS.md` with current state
2. Update TODO items if using TodoWrite
3. Verify all changes are committed
4. Leave clear next steps for continuation

---

**Remember:** This is an MVP. Prioritize working code over perfection. Ship fast, iterate based on feedback.
