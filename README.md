# Florece 🌱

An AI-powered micro-venture accelerator helping entrepreneurs in Latam build and validate business ideas in 7 days.

## What is Florece?

Florece is an audio-first mobile application that guides aspiring entrepreneurs through a rapid 7-day journey from idea to first customers. Using AI-powered coaching and practical action plans, users receive personalized guidance, validate their business model, and build momentum through structured, achievable daily tasks.

**Core Flow:** Login → 5Q Diagnostic → AI Agent Plan → 7-Day Actions → Evidence Upload → Verification → Completion Receipt

## Architecture

```
Next.js UI → Next.js BFF (API Routes) → Cloud Run Agent Service → Firebase + Gemini
```

- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS (mobile-first, audio-first)
- **Backend**: Next.js API Routes + Cloud Run (agent service)
- **Database**: Firebase (Firestore, Storage, Auth)
- **AI**: Google Gemini (server-side only, function calling)

**Key Principle:** No secrets in client. All API keys and LLM calls happen server-side.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Firebase project (or use emulators for development)
- Gemini API key or Vertex AI access

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Gemini credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Development with Firebase Emulators

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulators
firebase emulators:start

# In .env.local, set:
NEXT_PUBLIC_USE_EMULATORS=true
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # BFF API routes
│   │   ├── run-agent/    # Agent orchestration endpoint
│   │   ├── upload-evidence/
│   │   ├── verify-evidence/
│   │   └── receipts/
│   └── ...                # Pages and layouts
├── agent/                 # Agent orchestration logic
│   ├── orchestrator.ts    # Main agent runner
│   └── gemini/           # Gemini client and prompts
├── tools/                 # Deterministic agent tools
│   ├── computeUnitEconomics.ts
│   ├── generatePlan.ts
│   ├── createActions.ts
│   ├── verifyEvidence.ts
│   └── ...
├── lib/                   # Shared utilities
│   ├── firebase/         # Firebase client & admin SDKs
│   └── env.ts            # Typed env variable access
└── types/                 # TypeScript definitions
    ├── domain.ts         # Core domain types
    └── tools.ts          # Agent tool types
```

## Documentation

Detailed documentation is available in the `/docs` directory:

- **[docs/principles.md](docs/principles.md)** - Non-negotiable rules, audio-first guidelines, scope
- **[docs/architecture.md](docs/architecture.md)** - System diagram, data model, security notes
- **[docs/tools.md](docs/tools.md)** - Agent tool contracts and invariants

## Environment Variables

### Required (Server-side)

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CREDENTIALS='{"type":"service_account",...}'
# OR
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

GEMINI_API_KEY=your-gemini-api-key
# OR
VERTEX_PROJECT_ID=your-vertex-project
VERTEX_LOCATION=us-central1

AGENT_SERVICE_URL=https://agent-service.run.app
```

### Required (Client-side)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Optional

```bash
NEXT_PUBLIC_USE_EMULATORS=true  # Use Firebase emulators for local dev
```

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Security Rules

**CRITICAL:** No secrets in client code.

- Firebase Admin SDK → Server-side only
- Gemini API calls → Server-side only (Cloud Run or Next.js API routes)
- Firebase Client SDK → Client components only, for auth and storage uploads

## Contributing

This is a hackathon MVP. Focus on:

1. Happy path functionality
2. Audio-first UX
3. Simple, working code over perfection
4. Iterative improvements based on user testing

## License

[Add your license here]

## Team

Built with ❤️ by [Your Team Name]

Wolfcito 🐾 @akawolfcito
