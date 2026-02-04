# Florece Documentation

## What is Florece?

Florece is an AI-powered micro-venture accelerator for Latam entrepreneurs. It guides users through a 7-day journey from idea to first customers using audio-first interactions, AI coaching via Gemini, and practical daily action plans. Users validate their business model, complete trackable actions, and receive verification through evidence-based progress tracking.

## 3-Minute Demo Flow

**Demo Case:** La Sofía - tienda de abarrotes in El Piñón, Magdalena

1. **Login** (mock auth) → User "Sofía" enters the app
2. **5-Question Diagnostic** → AI asks about product, customers, costs, pricing, time
3. **Run Agent** → Gemini processes answers, calculates unit economics
4. **Generate Plan** → 7-day plan with 5 actions (e.g., "Talk to 3 neighbors about their shopping needs")
5. **Complete Action** → Sofía talks to neighbors, records voice note
6. **Upload Evidence** → Voice recording uploaded to Firebase Storage
7. **Verify Evidence** → Gemini verifies the recording matches the action
8. **Receipt** → Certificate showing 1/5 actions completed (20%)

## Start Here

### For New Contributors

1. Read [PRD](prd.md) - Understand the product vision
2. Read [Architecture](architecture.md) - Understand the system design
3. Read [AGENTS](AGENTS.md) - Critical for AI agents working on the repo
4. Read [Development Guide](dev.md) - Set up your environment
5. Check [Decision Log](decision-log.md) - Understand why we made key choices

### For AI Agents

**READ THIS FIRST:** [AGENTS.md](AGENTS.md) contains repo structure, constraints, validation checklist, and DO NOT rules.

## Documentation Index

### Core Documents

- **[AGENTS.md](AGENTS.md)** - AI agent guide with repo map, constraints, validation
- **[PRD.md](prd.md)** - Product requirements and success metrics
- **[Architecture](architecture.md)** - System design and layer responsibilities
- **[Principles](principles.md)** - Non-negotiable rules and guidelines

### Technical Specs

- **[Data Model](data-model.md)** - Firestore collections and schemas
- **[API Reference](api.md)** - Request/response contracts for all endpoints
- **[Tools](tools.md)** - Agent tool contracts and invariants
- **[Security](security.md)** - PII, secrets, and access control rules

### Project Management

- **[Scope](scope.md)** - Scope freeze, milestones, definition of done
- **[Decision Log](decision-log.md)** - Architectural decisions and rationale

### Development

- **[Development Guide](dev.md)** - Setup, workflows, troubleshooting

## Key Terms

- **Florece**: The application name
- **La Sofía**: Demo case (small grocery store)
- **El Piñón, Magdalena**: Demo location (can use "Zone A" as placeholder)
- **Case**: A user's venture journey (diagnostic + plan + actions)
- **Action**: A single task in the 7-day plan
- **Evidence**: Proof of action completion (photo/audio/document)
- **Receipt**: Completion certificate

## Quick Reference

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (BFF) + Cloud Run (Agent Service)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Auth**: Firebase Auth
- **AI**: Google Gemini (direct API for hackathon)

### Repo Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # BFF API routes
│   └── ...                # Pages and layouts
├── agent/                 # Agent orchestration
│   └── gemini/           # Gemini client and tools
├── tools/                 # Deterministic agent tools
├── lib/                   # Shared utilities
└── types/                 # TypeScript definitions
```

### Non-Negotiables

1. App Router only (no pages/ router)
2. Server-side secrets only (no Gemini/keys in browser)
3. Firebase Admin SDK server-side only
4. Tools are deterministic functions
5. Happy path MVP focus

See [Principles](principles.md) for complete list.

## Need Help?

- **Architecture questions**: See [architecture.md](architecture.md)
- **Data questions**: See [data-model.md](data-model.md)
- **API questions**: See [api.md](api.md)
- **Setup issues**: See [dev.md](dev.md)
- **Security concerns**: See [security.md](security.md)
