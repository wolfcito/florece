# Florece Agent Tools

All tools are deterministic server-side functions that the Gemini LLM can invoke via function calling. Tools must have strict input/output contracts and cannot access external state beyond what's passed in.

## Tool Contracts

### `computeUnitEconomics`

Calculate basic unit economics for a product/service.

**Input:**
```typescript
{
  productType: string          // e.g., "physical product", "service", "digital"
  estimatedCost: number         // Cost per unit
  proposedPrice: number         // Price per unit
  monthlyVolume: number         // Expected units per month
}
```

**Output:**
```typescript
{
  margin: number                // (price - cost) / price
  monthlyRevenue: number        // price * monthlyVolume
  monthlyCost: number           // cost * monthlyVolume
  monthlyProfit: number         // monthlyRevenue - monthlyCost
  breakEvenUnits: number        // Fixed costs / margin (if applicable)
  recommendation: string        // Human-readable assessment
}
```

**Determinism:** Pure calculation, no external calls.

---

### `generatePlan`

Generate a structured 7-day action plan based on diagnostic data.

**Input:**
```typescript
{
  caseId: string
  productDescription: string
  targetMarket: string
  availableHoursPerDay: number
  budget: number
  urgency: 'low' | 'medium' | 'high'
}
```

**Output:**
```typescript
{
  planId: string                // Generated plan ID
  horizon: '7days'
  goals: string[]               // 3-5 high-level goals
  days: Array<{
    day: number                 // 1-7
    focus: string               // Theme for the day
    actions: Array<{
      title: string
      description: string
      estimatedHours: number
      priority: 'high' | 'medium' | 'low'
    }>
  }>
  totalEstimatedHours: number
}
```

**Determinism:** Template-based with LLM customization. Outputs are reproducible given same inputs.

---

### `createActions`

Convert a plan into discrete Firestore action documents.

**Input:**
```typescript
{
  planId: string
  caseId: string
  days: Array<{
    day: number
    actions: Array<{
      title: string
      description: string
      estimatedHours: number
    }>
  }>
}
```

**Output:**
```typescript
{
  actionIds: string[]           // Created Firestore document IDs
  count: number                 // Total actions created
}
```

**Determinism:** Database write is idempotent (same input → same documents).

---

### `verifyEvidence`

Analyze uploaded evidence to confirm action completion.

**Input:**
```typescript
{
  actionId: string
  evidenceId: string
  fileUrl: string               // Firebase Storage URL
  fileType: 'image' | 'audio' | 'document'
  actionDescription: string     // What was supposed to be done
}
```

**Output:**
```typescript
{
  verified: boolean             // Pass/fail
  confidence: number            // 0-1 confidence score
  reasoning: string             // Explanation of decision
  suggestions?: string[]        // If rejected, what to improve
}
```

**Determinism:** Uses Gemini vision/audio analysis. Same file → same result (within model tolerance).

---

### `createReceipt`

Generate a completion certificate for verified actions.

**Input:**
```typescript
{
  caseId: string
  userId: string
  planId: string
  completedActionIds: string[]
}
```

**Output:**
```typescript
{
  receiptId: string
  completedActions: number
  totalActions: number
  completionRate: number        // 0-1
  certificateUrl?: string       // Optional PDF/image URL
  message: string               // Congratulatory message
}
```

**Determinism:** Pure data aggregation + document generation.

---

### `recommendSuppliers`

Suggest suppliers or resources based on product needs (optional for MVP).

**Input:**
```typescript
{
  productType: string
  location: string
  materials: string[]
  budget: number
}
```

**Output:**
```typescript
{
  suppliers: Array<{
    name: string
    type: 'manufacturer' | 'wholesaler' | 'platform'
    website?: string
    estimatedCost: number
    notes: string
  }>
}
```

**Determinism:** Database lookup + LLM enrichment. Cacheable.

---

### `publishVenture`

Prepare venture details for public sharing (optional, time permitting).

**Input:**
```typescript
{
  caseId: string
  productName: string
  description: string
  imageUrls: string[]
}
```

**Output:**
```typescript
{
  publishedUrl: string          // Public link
  shareableText: string         // Social media copy
  qrCode?: string               // QR code image URL
}
```

**Determinism:** URL generation is deterministic.

---

## Tool Invariants

### What Tools MUST Guarantee

1. **Input Validation**: Reject invalid inputs with clear error messages (e.g., negative prices, missing required fields).

2. **No Side Effects Without Confirmation**: Database writes require explicit confirmation in input (e.g., `confirm: true`).

3. **User Isolation**: Tools must accept `userId` and filter all queries to prevent cross-user data leakage.

4. **No PII Leaks**: Tools must not log or expose personally identifiable information (names, emails, addresses).

5. **Error Handling**: Tools return structured errors, never throw exceptions:
   ```typescript
   {
     success: false
     error: {
       code: 'INVALID_INPUT' | 'DATABASE_ERROR' | 'EXTERNAL_SERVICE_ERROR'
       message: string
     }
   }
   ```

6. **Idempotency**: Repeated calls with same input produce same result (critical for retries).

7. **Timeout Limits**: All tools must complete within 30 seconds or return partial results.

8. **Audit Trail**: Critical tools (verify, createReceipt) must write to `agent_runs` collection.

### What Tools MUST NOT Do

- **No Hallucination**: Tools return only computed or retrieved data, never invented facts.
- **No External HTTP Calls** (except approved APIs like Gemini Vision).
- **No File System Access** (except through Firebase Storage SDK).
- **No User Impersonation**: Tools cannot override `userId` from request context.

## Tool Registry

Tools are registered in `src/agent/gemini/toolRegistry.ts` with:
- Function name
- JSON Schema for inputs/outputs
- Execution handler
- Permission level (if role-based access is added later)

Example:
```typescript
export const toolRegistry = {
  computeUnitEconomics: {
    schema: { /* JSON Schema */ },
    handler: computeUnitEconomics,
    permissions: ['user', 'admin']
  },
  // ...
}
```

## Testing Tools

Each tool should have:
- **Unit tests**: Mock Firestore/Storage, test pure logic
- **Integration tests**: Test with Firebase emulators
- **Happy path**: Verify expected inputs → expected outputs
- **Error cases**: Invalid inputs, missing data, service failures

For hackathon MVP: prioritize happy path coverage.
