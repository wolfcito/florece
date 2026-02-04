# Development Guide

Complete setup and workflow guide for developing Florece locally.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: 20.x or higher
- **pnpm**: 9.15.0 or higher
- **Git**: Latest version
- **Firebase CLI**: `npm install -g firebase-tools`
- **Code Editor**: VS Code recommended

Check versions:
```bash
node --version  # Should be >= 20.0.0
pnpm --version  # Should be >= 9.15.0
firebase --version
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/florece.git
cd florece
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs:
- Next.js 16.1.6
- React 19.2.3
- Firebase SDK 11.2.0
- Firebase Admin SDK 13.0.1
- TypeScript, Tailwind, ESLint

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

**For Local Development (Firebase Emulators)**:
```bash
# Firebase Admin (server-side)
FIREBASE_PROJECT_ID=demo-florece
# Leave credentials empty for emulators

# Gemini API (get from Google AI Studio)
GEMINI_API_KEY=AIzaSy...

# Agent Service (for local dev, use localhost)
AGENT_SERVICE_URL=http://localhost:8080

# Firebase Client (use demo values for emulators)
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-florece
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-florece.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:demo

# Enable emulators
NEXT_PUBLIC_USE_EMULATORS=true
NODE_ENV=development
```

**For Production Firebase**:

Get values from Firebase Console → Project Settings → General:

```bash
FIREBASE_PROJECT_ID=your-real-project
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account",...}

NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-real-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

NEXT_PUBLIC_USE_EMULATORS=false
```

### 4. Get Gemini API Key

Visit [Google AI Studio](https://makersuite.google.com/app/apikey):
1. Sign in with Google account
2. Click "Get API Key"
3. Copy key to `GEMINI_API_KEY` in `.env.local`

---

## Firebase Emulator Setup

### 1. Initialize Firebase

```bash
firebase login
firebase init emulators
```

Select:
- [x] Firestore
- [x] Authentication
- [x] Storage
- [ ] Functions (not needed)

Use default ports:
- Firestore: 8080
- Auth: 9099
- Storage: 9199

### 2. Start Emulators

```bash
firebase emulators:start
```

You should see:
```
✔  All emulators ready!
┌─────────────┬────────────────┬─────────────────────────────────┐
│ Emulator    │ Host:Port      │ View in Emulator Suite          │
├─────────────┼────────────────┼─────────────────────────────────┤
│ Auth        │ localhost:9099 │ http://localhost:4000/auth      │
│ Firestore   │ localhost:8080 │ http://localhost:4000/firestore │
│ Storage     │ localhost:9199 │ http://localhost:4000/storage   │
└─────────────┴────────────────┴─────────────────────────────────┘
```

**Emulator UI**: http://localhost:4000

### 3. Seed Demo Data

Create seed script:

```bash
# Create seed script
mkdir -p scripts
touch scripts/seed-demo-data.ts
```

**File: `scripts/seed-demo-data.ts`**:
```typescript
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Connect to emulators
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

const app = initializeApp({ projectId: 'demo-florece' });
const db = getFirestore(app);

async function seedData() {
  console.log('Seeding demo data...');

  // Create demo case
  const caseRef = db.collection('cases').doc('demo_case_sofia');
  await caseRef.set({
    userId: 'demo_user_sofia',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    answers: {
      product: 'Comidas preparadas para llevar',
      customer: 'Vecinos que trabajan',
      cost: 2,
      price: 5,
      hours: 3,
    },
    metadata: {
      location: 'El Piñón, Magdalena',
      businessName: 'La Sofía',
    },
  });

  // Create demo product
  await db.collection('products').doc('demo_product_sofia').set({
    caseId: 'demo_case_sofia',
    name: 'Comidas preparadas',
    description: 'Platos listos para llevar con ingredientes frescos',
    targetMarket: 'Trabajadores sin tiempo para cocinar',
    category: 'food',
    createdAt: new Date(),
  });

  console.log('✅ Demo data seeded successfully!');
  process.exit(0);
}

seedData().catch(console.error);
```

Run seed script:
```bash
pnpm tsx scripts/seed-demo-data.ts
```

---

## Development Workflows

### Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000

**Hot Reload**: Changes to code auto-reload

### Type Checking

```bash
# Check types without building
pnpm tsc --noEmit

# Watch mode (continuous)
pnpm tsc --noEmit --watch
```

Fix all TypeScript errors before committing.

### Linting

```bash
# Run ESLint
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

### Building

```bash
# Production build
pnpm build

# Check build output
ls -la .next
```

Build must succeed before deploying.

### Testing

```bash
# Run all tests (when added)
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

**For MVP**: Focus on happy path manual testing. Add unit tests for tools.

---

## Project Structure

```
florece/
├── docs/                    # Documentation
│   ├── README.md           # Master index
│   ├── AGENTS.md           # AI agent guide
│   ├── prd.md              # Product requirements
│   ├── architecture.md     # System design
│   ├── data-model.md       # Firestore schema
│   ├── api.md              # API reference
│   ├── tools.md            # Tool contracts
│   ├── security.md         # Security rules
│   ├── scope.md            # Scope management
│   ├── decision-log.md     # Architectural decisions
│   └── dev.md              # This file
│
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── page.tsx        # Landing page
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   └── api/            # BFF API routes
│   │       ├── run-agent/
│   │       ├── upload-evidence/
│   │       ├── verify-evidence/
│   │       └── receipts/
│   │
│   ├── agent/              # Agent orchestration
│   │   ├── orchestrator.ts
│   │   └── gemini/
│   │       ├── client.ts
│   │       ├── prompts.ts
│   │       └── toolRegistry.ts
│   │
│   ├── tools/              # Deterministic tools
│   │   ├── computeUnitEconomics.ts
│   │   ├── generatePlan.ts
│   │   ├── createActions.ts
│   │   ├── verifyEvidence.ts
│   │   ├── createReceipt.ts
│   │   ├── recommendSuppliers.ts
│   │   └── publishVenture.ts
│   │
│   ├── lib/                # Shared utilities
│   │   ├── env.ts
│   │   └── firebase/
│   │       ├── admin.ts
│   │       ├── client.ts
│   │       └── emulators.ts
│   │
│   └── types/              # TypeScript types
│       ├── domain.ts
│       └── tools.ts
│
├── scripts/                # Development scripts
│   └── seed-demo-data.ts
│
├── public/                 # Static assets
├── .env.example           # Environment template
├── .env.local             # Your local env (gitignored)
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Common Tasks

### Add a New Tool

1. Define contract in `docs/tools.md`
2. Add types in `src/types/tools.ts`
3. Implement in `src/tools/yourTool.ts`
4. Register in `src/agent/gemini/toolRegistry.ts`
5. Test with curl or Postman

Example:
```typescript
// src/tools/exampleTool.ts
import type { ToolResult } from '@/types/tools';

export interface ExampleInput {
  value: number;
}

export interface ExampleOutput {
  result: number;
}

export async function exampleTool(
  input: ExampleInput,
  context: { userId: string; caseId: string }
): Promise<ToolResult<ExampleOutput>> {
  return {
    success: true,
    data: { result: input.value * 2 },
  };
}
```

### Add a New API Route

1. Create folder in `src/app/api/`
2. Create `route.ts` file
3. Implement `POST`, `GET`, etc.
4. Add auth verification
5. Document in `docs/api.md`

Example:
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(
      request.headers.get('authorization')
    );

    const body = await request.json();

    // ... your logic

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Update Firestore Schema

1. Document change in `docs/data-model.md`
2. Update types in `src/types/domain.ts`
3. Update Security Rules in Firebase Console
4. Create migration script if needed
5. Test with emulators

### Deploy Firestore Rules

```bash
# Deploy rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

---

## Troubleshooting

### "Cannot find module 'firebase-admin'"

**Solution**:
```bash
pnpm install
```

If still failing, check `package.json` has `firebase-admin`.

---

### "Missing environment variable: GEMINI_API_KEY"

**Solution**:
```bash
# Check .env.local exists
ls -la .env.local

# Check variable is set
cat .env.local | grep GEMINI_API_KEY

# If missing, add it
echo "GEMINI_API_KEY=your-key-here" >> .env.local
```

---

### "Firestore: PERMISSION_DENIED"

**Cause**: Security rules blocking request

**Solution**:
1. Check Firebase Emulator UI → Firestore → Rules
2. Verify `userId` matches in document and auth token
3. Check rule allows the operation

**Test auth**:
```typescript
const user = await auth.currentUser;
const token = await user.getIdToken();
console.log('Token:', token);
```

---

### "Firebase emulators not running"

**Solution**:
```bash
# Start emulators
firebase emulators:start

# If port conflict, kill process
lsof -ti:8080 | xargs kill -9
lsof -ti:9099 | xargs kill -9

# Restart
firebase emulators:start
```

---

### "TypeScript error: Type 'any'"

**Solution**:
Add proper type annotations:

```typescript
// Bad
const data = doc.data();

// Good
const data = doc.data() as Case;

// Better
interface CaseDocument {
  userId: string;
  status: 'active' | 'completed';
}
const data = doc.data() as CaseDocument;
```

---

### "CORS error in browser"

**Cause**: API route not allowing origin

**Solution**:
Add CORS headers in `next.config.ts`:

```typescript
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

**For production**: Restrict origin to your domain.

---

### "Build fails with TypeScript errors"

**Solution**:
```bash
# Check errors
pnpm tsc --noEmit

# Fix all errors
# Then build again
pnpm build
```

Common fixes:
- Add missing type imports
- Remove unused variables
- Add proper return types
- Fix typos in property names

---

### "Gemini API rate limit exceeded"

**Cause**: Too many requests

**Solution**:
- Add exponential backoff in `src/agent/gemini/client.ts`
- Cache responses for repeated queries
- Reduce test frequency

```typescript
async function sendMessageWithRetry(message: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await gemini.sendMessage(message);
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 2 ** i * 1000)); // Exponential backoff
      } else {
        throw error;
      }
    }
  }
}
```

---

### "Evidence upload fails"

**Possible causes**:
1. File too large (>10MB)
2. Signed URL expired (>5 min)
3. Wrong Content-Type header

**Solution**:
```bash
# Check file size
ls -lh evidence.jpg

# Generate fresh signed URL
curl -X POST http://localhost:3000/api/upload-evidence ...

# Upload immediately with correct Content-Type
curl -X PUT "<signed-url>" \
  -H "Content-Type: image/jpeg" \
  --data-binary @evidence.jpg
```

---

## Performance Tips

### 1. Use React Server Components

**Good** (Server Component):
```typescript
// src/app/plan/[id]/page.tsx
export default async function PlanPage({ params }) {
  const plan = await db.collection('plans').doc(params.id).get();
  return <div>{plan.title}</div>;
}
```

**Bad** (Client Component with useEffect):
```typescript
'use client';
export default function PlanPage({ params }) {
  const [plan, setPlan] = useState(null);
  useEffect(() => {
    fetch(`/api/plans/${params.id}`).then(r => r.json()).then(setPlan);
  }, []);
  return <div>{plan?.title}</div>;
}
```

### 2. Minimize Client JavaScript

Only use `'use client'` when necessary:
- User interactions (onClick, onChange)
- Hooks (useState, useEffect)
- Browser APIs (localStorage, audio recording)

### 3. Optimize Images

Use Next.js Image component:
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Florece"
  width={200}
  height={100}
  priority
/>
```

---

## Git Workflow

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/add-voice-recorder

# Make changes
git add src/components/VoiceRecorder.tsx
git commit -m "feat: add voice recorder component"

# Push to remote
git push origin feature/add-voice-recorder

# Create PR
gh pr create --title "Add voice recorder"
```

### Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, no logic change)
- `refactor:` Code refactor
- `test:` Add tests
- `chore:` Build, dependencies

Examples:
```bash
git commit -m "feat: add evidence upload flow"
git commit -m "fix: audio recording on iOS Safari"
git commit -m "docs: update API reference"
git commit -m "chore: upgrade Next.js to 16.2"
```

### Before Pushing

```bash
# 1. Type check
pnpm tsc --noEmit

# 2. Lint
pnpm lint

# 3. Build
pnpm build

# 4. Test (when added)
pnpm test

# 5. Push
git push
```

---

## VS Code Setup

### Recommended Extensions

Install from Extensions panel:
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Firebase** - Firebase syntax
- **Error Lens** - Inline errors

### Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true
  }
}
```

---

## Deployment

### Vercel (Next.js)

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Add environment variables in Vercel Dashboard.

### Cloud Run (Agent Service)

```bash
# Build Docker image
docker build -t agent-service .

# Deploy to Cloud Run
gcloud run deploy agent-service \
  --image agent-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Next Steps

1. ✅ Read all docs in `docs/`
2. ✅ Set up local environment
3. ✅ Start Firebase emulators
4. ✅ Run `pnpm dev`
5. ⬜ Implement agent orchestration
6. ⬜ Build UI components
7. ⬜ Test happy path end-to-end
8. ⬜ Deploy to staging

**Happy coding!** 🚀
