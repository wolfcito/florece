# Plan de Implementación - Backend Core (E1 + E2)

**Fecha:** 2026-02-06
**Objetivo:** Desbloquear el backend core implementando E1 (Gemini Integration) y E2 (Agent Orchestration)

## 🎯 Objetivo Final

**Tener un agente funcional que:**
1. Reciba mensaje del usuario via API
2. Procese con Gemini (function calling)
3. Ejecute tools deterministas
4. Retorne respuesta al usuario

**Sin frontend** - Solo backend funcionando, testeable via API calls.

---

## 📋 Checklist de Prerequisitos

### ✅ Ya Tienes (Listo)
- [x] Firebase Admin SDK configurado
- [x] Firebase Client SDK configurado
- [x] Next.js App Router funcionando
- [x] TypeScript configurado
- [x] 2 tools completamente funcionales:
  - [x] `computeUnitEconomics.ts`
  - [x] `createActions.ts`
- [x] Scaffolding de archivos core:
  - [x] `src/agent/gemini/client.ts`
  - [x] `src/agent/gemini/toolRegistry.ts`
  - [x] `src/agent/orchestrator.ts`
  - [x] `src/app/api/run-agent/route.ts`

### ❓ Necesitas Proveer

#### 1. Gemini API Access
**Opción A: Gemini API Key (Más fácil)**
```bash
# Obtener en: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...
```

**Opción B: Vertex AI (Producción)**
```bash
# Requiere proyecto GCP configurado
VERTEX_PROJECT_ID=your-gcp-project
VERTEX_LOCATION=us-central1
```

**¿Cuál prefieres?** Recomiendo Opción A para desarrollo.

#### 2. SDK de Gemini
```bash
# Instalar dependencia
pnpm add @google/generative-ai
```

#### 3. Datos de Prueba (Opcional)
- Usuario de prueba en Firebase
- Caso de ejemplo para testing

---

## 🏗️ Fases de Implementación

### **FASE 1: E1 - Gemini Integration** (Bloqueador crítico)

#### Issue #20: US-E1-01 - Enviar mensajes a Gemini
**Archivo:** `src/agent/gemini/client.ts`
**Tiempo estimado:** 2-3 horas

**Implementación:**

```typescript
// src/agent/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerEnv } from '@/lib/env';

let genAI: GoogleGenerativeAI;

export function initializeGeminiClient() {
  if (!genAI) {
    const apiKey = getServerEnv('GEMINI_API_KEY');
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function sendMessage(
  messages: GeminiMessage[],
  tools: any[],
  systemPrompt: string
): Promise<GeminiResponse> {
  const genAI = initializeGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash', // o gemini-1.5-pro
    systemInstruction: systemPrompt,
    tools: tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
  });

  // Convertir mensajes al formato de Gemini
  const chat = model.startChat({
    history: messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
  });

  // Enviar último mensaje
  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;

  // Parsear respuesta
  const functionCalls = response.functionCalls()?.map(fc => ({
    name: fc.name,
    args: fc.args,
  }));

  return {
    content: response.text() || '',
    functionCalls,
    finishReason: functionCalls ? 'function_call' : 'stop',
  };
}
```

**Testing:**
```bash
# Crear archivo de prueba
# test-gemini.ts
const response = await sendMessage(
  [{ role: 'user', content: 'Hola' }],
  [],
  'Eres un asistente útil'
);
console.log(response);
```

---

#### Issue #21: US-E1-02 - Enviar resultados de funciones
**Archivo:** `src/agent/gemini/client.ts`
**Tiempo estimado:** 1-2 horas

**Implementación:**

```typescript
export async function sendFunctionResults(
  chat: any, // Chat instance from Gemini
  functionCalls: GeminiFunctionCall[],
  functionResults: any[]
): Promise<GeminiResponse> {
  // Formatear resultados para Gemini
  const functionResponseParts = functionCalls.map((fc, index) => ({
    functionResponse: {
      name: fc.name,
      response: functionResults[index],
    },
  }));

  // Enviar resultados de vuelta a Gemini
  const result = await chat.sendMessage(functionResponseParts);
  const response = result.response;

  const newFunctionCalls = response.functionCalls()?.map(fc => ({
    name: fc.name,
    args: fc.args,
  }));

  return {
    content: response.text() || '',
    functionCalls: newFunctionCalls,
    finishReason: newFunctionCalls ? 'function_call' : 'stop',
  };
}
```

---

#### Issue #22: US-E1-03 - Registrar tools en Gemini
**Archivo:** `src/agent/gemini/toolRegistry.ts`
**Tiempo estimado:** 2-3 horas

**Implementación:**

```typescript
// src/agent/gemini/toolRegistry.ts
import { computeUnitEconomics } from '@/tools/computeUnitEconomics';
import { createActions } from '@/tools/createActions';
// ... otros tools cuando estén listos

// Definir JSON schemas para Gemini
const toolSchemas = {
  computeUnitEconomics: {
    name: 'computeUnitEconomics',
    description: 'Calculate unit economics for a product/service',
    parameters: {
      type: 'object',
      properties: {
        estimatedCost: {
          type: 'number',
          description: 'Cost per unit',
        },
        proposedPrice: {
          type: 'number',
          description: 'Selling price per unit',
        },
        monthlyVolume: {
          type: 'number',
          description: 'Expected monthly sales volume',
        },
      },
      required: ['estimatedCost', 'proposedPrice', 'monthlyVolume'],
    },
  },
  createActions: {
    name: 'createActions',
    description: 'Create trackable action items from a plan',
    parameters: {
      type: 'object',
      properties: {
        planId: { type: 'string', description: 'Plan ID' },
        caseId: { type: 'string', description: 'Case ID' },
        days: {
          type: 'array',
          description: 'Days with actions',
          items: {
            type: 'object',
            properties: {
              day: { type: 'number' },
              actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    estimatedHours: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
      required: ['planId', 'caseId', 'days'],
    },
  },
  // Agregar más tools conforme se implementen
};

// Registry con handlers
export const toolRegistry: Record<string, ToolDefinition> = {
  computeUnitEconomics: {
    ...toolSchemas.computeUnitEconomics,
    handler: computeUnitEconomics,
    requiresAuth: true,
  },
  createActions: {
    ...toolSchemas.createActions,
    handler: createActions,
    requiresAuth: true,
  },
};

export function formatToolsForGemini(): any[] {
  return Object.values(toolRegistry).map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
}

export async function executeTool(
  toolName: string,
  input: any,
  context: { userId: string; caseId: string }
): Promise<ToolResult<any>> {
  const tool = toolRegistry[toolName];

  if (!tool) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: `Unknown tool: ${toolName}`,
      },
    };
  }

  try {
    return await tool.handler(input, context);
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNKNOWN',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
```

**Testing:**
```typescript
const tools = formatToolsForGemini();
console.log('Tools registered:', tools.length);
```

---

### **FASE 2: E2 - Agent Orchestration** (Depende de E1)

#### Issue #23: US-E2-01 - Implementar loop del agente
**Archivo:** `src/agent/orchestrator.ts`
**Tiempo estimado:** 3-4 horas

**Implementación:**

```typescript
// src/agent/orchestrator.ts
import { sendMessage, sendFunctionResults } from './gemini/client';
import { formatToolsForGemini, executeTool } from './gemini/toolRegistry';
import { getFirebaseAdmin } from '@/lib/firebase/admin';

const MAX_ITERATIONS = 10;

const SYSTEM_PROMPT = `Eres un coach de emprendimiento que ayuda a validar ideas de negocio en 7 días.

Tu trabajo es:
1. Hacer diagnóstico con 5 preguntas clave
2. Generar un plan de 7 días personalizado
3. Crear acciones concretas y medibles
4. Verificar evidencia de progreso

Siempre sé práctico, directo y enfocado en acción.`;

export async function runAgent(input: AgentInput): Promise<AgentOutput> {
  const { message, context } = input;
  const { db } = getFirebaseAdmin();

  // 1. Crear agent_run document
  const agentRunRef = db.collection('agent_runs').doc();
  await agentRunRef.set({
    caseId: context.caseId,
    userId: context.userId,
    status: 'running',
    startedAt: new Date(),
    toolCallsExecuted: 0,
  });

  try {
    // 2. Preparar tools y mensajes
    const tools = formatToolsForGemini();
    const messages: GeminiMessage[] = [
      { role: 'user', content: message },
    ];

    let iterations = 0;
    let toolCallsExecuted = 0;
    let finalResponse = '';

    // 3. Loop del agente
    while (iterations < MAX_ITERATIONS) {
      iterations++;

      // Enviar a Gemini
      const response = await sendMessage(messages, tools, SYSTEM_PROMPT);

      // Si no hay function calls, terminamos
      if (!response.functionCalls || response.functionCalls.length === 0) {
        finalResponse = response.content;
        break;
      }

      // Ejecutar function calls
      const functionResults = await Promise.all(
        response.functionCalls.map(async (fc) => {
          const result = await executeTool(fc.name, fc.args, {
            userId: context.userId,
            caseId: context.caseId,
          });
          toolCallsExecuted++;
          return result;
        })
      );

      // Enviar resultados de vuelta
      // (Necesitaremos ajustar la API para mantener el chat)
      // Por ahora, agregamos a messages
      messages.push({
        role: 'model',
        content: `[Function calls: ${response.functionCalls.map(fc => fc.name).join(', ')}]`,
      });
      messages.push({
        role: 'user',
        content: `Results: ${JSON.stringify(functionResults)}`,
      });
    }

    // 4. Actualizar agent_run
    await agentRunRef.update({
      status: 'completed',
      completedAt: new Date(),
      toolCallsExecuted,
      response: finalResponse,
    });

    return {
      response: finalResponse,
      toolCallsExecuted,
      status: 'success',
      agentRunId: agentRunRef.id,
    };
  } catch (error) {
    // Error handling
    await agentRunRef.update({
      status: 'failed',
      completedAt: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      response: '',
      toolCallsExecuted: 0,
      status: 'error',
      agentRunId: agentRunRef.id,
    };
  }
}
```

---

#### Issue #25: US-E2-03 - Conectar API route
**Archivo:** `src/app/api/run-agent/route.ts`
**Tiempo estimado:** 1 hora

**Implementación:**

```typescript
// src/app/api/run-agent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { runAgent } from '@/agent/orchestrator';

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar auth
    const authHeader = request.headers.get('authorization');
    const userId = await verifyAuthToken(authHeader);

    // 2. Parse body
    const { caseId, message } = await request.json();

    if (!caseId || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing caseId or message' },
        { status: 400 }
      );
    }

    // 3. Run agent
    const result = await runAgent({
      message,
      context: { caseId, userId },
    });

    // 4. Return response
    return NextResponse.json({
      success: result.status === 'success',
      response: result.response,
      agentRunId: result.agentRunId,
      toolCallsExecuted: result.toolCallsExecuted,
    });
  } catch (error) {
    console.error('Error in /api/run-agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing del Backend

### Test 1: Gemini Connection
```bash
# Crear test simple
curl -X POST http://localhost:3000/api/test-gemini \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola"}'
```

### Test 2: Agent con Tool
```bash
curl -X POST http://localhost:3000/api/run-agent \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": "test-case-123",
    "message": "Calcula los unit economics para un producto que cuesta $10, lo vendo a $20, y espero vender 100 al mes"
  }'
```

Respuesta esperada:
```json
{
  "success": true,
  "response": "Los unit economics son: margin 50%, revenue $2000/mes...",
  "toolCallsExecuted": 1,
  "agentRunId": "agent_run_abc123"
}
```

---

## 📦 Instalación de Dependencias

```bash
# Gemini SDK
pnpm add @google/generative-ai

# (Opcional) Para testing
pnpm add -D vitest @vitest/ui
```

---

## 🎯 Orden de Implementación Recomendado

### Sprint 1: E1 Gemini Integration (1 semana)
1. **Día 1:** Setup Gemini API key + test básico
2. **Día 2:** Implementar #20 (sendMessage)
3. **Día 3:** Implementar #21 (sendFunctionResults)
4. **Día 4-5:** Implementar #22 (Tool registry)
5. **Testing:** Gemini responde y puede llamar tools

### Sprint 2: E2 Agent Orchestration (1 semana)
1. **Día 1-2:** Implementar #23 (Agent loop)
2. **Día 3:** Implementar #25 (API route)
3. **Día 4:** Testing end-to-end
4. **Día 5:** Refinamiento y logging

---

## ✅ Definition of Done (Backend Core)

**Cuando esté completo, deberías poder:**

```bash
# 1. Enviar mensaje simple
curl -X POST localhost:3000/api/run-agent \
  -H "Authorization: Bearer TOKEN" \
  -d '{"caseId": "test", "message": "Hola"}'
# → Respuesta de Gemini

# 2. Usar computeUnitEconomics
curl -X POST localhost:3000/api/run-agent \
  -H "Authorization: Bearer TOKEN" \
  -d '{"caseId": "test", "message": "Calcula economics: costo $10, precio $20, volumen 100"}'
# → Gemini llama la tool y retorna resultados

# 3. Crear acciones
curl -X POST localhost:3000/api/run-agent \
  -H "Authorization: Bearer TOKEN" \
  -d '{"caseId": "test", "message": "Crea un plan de 3 días"}'
# → Gemini genera plan y crea acciones en Firestore
```

---

## 🚀 Quick Start

### Paso 1: Obtener API Key
```bash
# Ir a: https://aistudio.google.com/app/apikey
# Copiar key
```

### Paso 2: Configurar .env.local
```bash
cp .env.example .env.local
# Editar .env.local:
GEMINI_API_KEY=tu-key-aquí
```

### Paso 3: Instalar dependencias
```bash
pnpm add @google/generative-ai
```

### Paso 4: Implementar en orden
1. Issue #20 → Test
2. Issue #21 → Test
3. Issue #22 → Test
4. Issue #23 → Test
5. Issue #25 → Test end-to-end

---

## ❓ Preguntas para Ti

1. **¿Ya tienes Gemini API Key?**
   - [ ] Sí, tengo la key
   - [ ] No, necesito crearla
   - [ ] Prefiero usar Vertex AI

2. **¿Tienes Firebase configurado?**
   - [ ] Sí, tengo proyecto y credenciales
   - [ ] No, necesito configurarlo
   - [ ] Usaré emuladores locales

3. **¿Quieres que te ayude con:**
   - [ ] La implementación completa (te guío paso a paso)
   - [ ] Solo la estructura (tú implementas)
   - [ ] Pair programming (vamos juntos)

4. **Tiempo disponible:**
   - [ ] Puedo dedicar tiempo completo esta semana
   - [ ] Solo algunas horas al día
   - [ ] Queremos ir rápido, hazlo tú

---

**¿Qué necesitas que haga primero?** 🚀
