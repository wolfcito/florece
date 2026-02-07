# M1 (Agent Core) - Análisis de Issues

**Fecha:** 2026-02-06
**Milestone:** M1: Agent Core (18 issues abiertos)

## 📊 Estado de Implementación

### ✅ Completamente Implementados (2 issues)

#### 1. US-E3-01: Calcular unit economics
**Issue:** #27
**Archivo:** `src/tools/computeUnitEconomics.ts`
**Estado:** ✅ **LISTO PARA CERRAR**

**Implementado:**
- ✅ Función `computeUnitEconomics()` completa
- ✅ Validación de inputs (negativos, precio = 0)
- ✅ Cálculos: margin, revenue, cost, profit, break-even
- ✅ Recomendaciones basadas en margin
- ✅ Tipado completo con TypeScript
- ✅ Manejo de errores

**No hay TODOs pendientes.**

#### 2. US-E3-03: Crear acciones del plan
**Issue:** #29
**Archivo:** `src/tools/createActions.ts`
**Estado:** ✅ **LISTO PARA CERRAR**

**Implementado:**
- ✅ Función `createActions()` completa
- ✅ Integración con Firebase Admin
- ✅ Batch writes para performance
- ✅ Validación de inputs
- ✅ Creación de documentos en collection `actions`
- ✅ Manejo de errores

**No hay TODOs pendientes.**

---

### 🟡 Parcialmente Implementados (5 issues)

#### 3. US-E3-02: Generar plan de 7 días
**Issue:** #28
**Archivo:** `src/tools/generatePlan.ts`
**Estado:** 🟡 **80% COMPLETO**

**Implementado:**
- ✅ Estructura de función
- ✅ Validación de inputs
- ✅ Template de plan (7 días con acciones)
- ✅ Cálculo de horas totales
- ✅ Tipado completo

**Pendiente:**
- ❌ TODO: Integración con Gemini para planes personalizados
- ❌ TODO: Guardar plan en Firestore (collection `plans`)

**Bloqueado por:** US-E1-01 (Gemini integration)

#### 4. US-E3-04: Generar recibo de completación
**Issue:** #30
**Archivo:** `src/tools/createReceipt.ts`
**Estado:** 🟡 **Necesita revisión**

**TODOs:** 1

#### 5. US-E3-06: Recomendar proveedores
**Issue:** #32
**Archivo:** `src/tools/recommendSuppliers.ts`
**Estado:** 🟡 **Necesita revisión**

**TODOs:** 1

#### 6. US-E3-05: Publicar emprendimiento
**Issue:** #31
**Archivo:** `src/tools/publishVenture.ts`
**Estado:** 🟡 **Necesita revisión**

**TODOs:** 2

#### 7. US-E4-01, US-E4-02, US-E4-03, US-E4-04: Evidence Pipeline
**Issues:** #1, #2, #3, #4
**Archivo:** `src/tools/verifyEvidence.ts`
**Estado:** 🟡 **Necesita revisión**

**TODOs:** 3

---

### ❌ Sin Implementar - BLOQUEADORES (3 issues críticos)

#### 8. US-E1-01: Enviar mensajes a Gemini
**Issue:** #20
**Archivo:** `src/agent/gemini/client.ts`
**Estado:** ❌ **BLOQUEADOR**
**Prioridad:** P0 (Crítica)

**Pendiente:**
- ❌ Implementar `sendMessage()` con Gemini SDK
- ❌ Formatear mensajes para Gemini API
- ❌ Incluir tool definitions
- ❌ Parsear respuestas (texto + function calls)
- ❌ Retry con exponential backoff

**TODOs:** 5

**Bloquea:** US-E2-01, US-E2-02, US-E4-03, y indirectamente todo M1

#### 9. US-E1-02: Enviar resultados de funciones a Gemini
**Issue:** #21
**Archivo:** `src/agent/gemini/client.ts`
**Estado:** ❌ **BLOQUEADOR**
**Prioridad:** P0 (Crítica)

**Pendiente:**
- ❌ Implementar `sendFunctionResults()`
- ❌ Formatear resultados según spec de Gemini
- ❌ Manejar múltiples function results en batch

**Bloquea:** US-E2-02

#### 10. US-E1-03: Registrar tools en Gemini
**Issue:** #22
**Archivo:** `src/agent/gemini/toolRegistry.ts`
**Estado:** ❌ **BLOQUEADOR**
**Prioridad:** P0 (Crítica)

**Pendiente:**
- ❌ Definir JSON schemas para las 7 tools
- ❌ Registrar tools en `toolRegistry`
- ❌ Validar schemas con TypeScript
- ❌ Implementar `getToolsForGemini()`

**TODOs:** 1 (pero conceptualmente muchos)

**Bloquea:** US-E2-01

---

### ❌ Orchestration Sin Implementar (4 issues)

#### 11. US-E2-01: Implementar loop del agente
**Issue:** #23
**Archivo:** `src/agent/orchestrator.ts`
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P0 (Crítica)

**Pendiente:**
- ❌ Implementar `runAgent()`
- ❌ Loop: recibir → procesar → tool call → responder
- ❌ Máximo 10 iteraciones por seguridad
- ❌ Manejar conversaciones multi-turno

**Bloqueado por:** US-E1-01, US-E1-03

#### 12. US-E2-02: Ejecutar tools desde el agente
**Issue:** #24
**Archivo:** `src/agent/orchestrator.ts`
**Estado:** ❌ **SIN IMPLEMENTAR**

**Pendiente:**
- ❌ Implementar `executeToolCall()`
- ❌ Lookup tool en toolRegistry
- ❌ Validar input contra schema
- ❌ Ejecutar tool handler
- ❌ Retornar result o error

**TODOs:** 6

**Bloqueado por:** US-E1-01, US-E1-02

#### 13. US-E2-03: Conectar API route con orchestrator
**Issue:** #25
**Archivo:** `src/app/api/run-agent/route.ts`
**Estado:** ❌ **Necesita revisión**

#### 14. US-E2-04: Logging de agent runs
**Issue:** #26
**Archivo:** `src/agent/orchestrator.ts`
**Estado:** ❌ **SIN IMPLEMENTAR**

**Pendiente:**
- ❌ Implementar `logAgentRun()`
- ❌ Escribir a collection `agent_runs` en Firestore
- ❌ Retornar document ID

---

## 📈 Resumen por Épica

### E1: Gemini Integration (3 stories)
| Issue | Story | Estado | Archivos |
|-------|-------|--------|----------|
| #20 | US-E1-01: Enviar mensajes | ❌ Sin implementar | client.ts |
| #21 | US-E1-02: Enviar resultados | ❌ Sin implementar | client.ts |
| #22 | US-E1-03: Registrar tools | ❌ Sin implementar | toolRegistry.ts |

**Estado:** 0/3 completo (0%)
**Bloqueador crítico:** Toda la épica bloquea M1

### E2: Agent Orchestration (4 stories)
| Issue | Story | Estado | Archivos |
|-------|-------|--------|----------|
| #23 | US-E2-01: Loop del agente | ❌ Sin implementar | orchestrator.ts |
| #24 | US-E2-02: Ejecutar tools | ❌ Sin implementar | orchestrator.ts |
| #25 | US-E2-03: Conectar API route | ❌ Revisar | route.ts |
| #26 | US-E2-04: Logging | ❌ Sin implementar | orchestrator.ts |

**Estado:** 0/4 completo (0%)
**Bloqueado por:** E1

### E3: Business Tools (6 stories)
| Issue | Story | Estado | Archivos |
|-------|-------|--------|----------|
| #27 | US-E3-01: Unit economics | ✅ Completo | computeUnitEconomics.ts |
| #28 | US-E3-02: Generar plan | 🟡 80% | generatePlan.ts |
| #29 | US-E3-03: Crear acciones | ✅ Completo | createActions.ts |
| #30 | US-E3-04: Generar recibo | 🟡 Revisar | createReceipt.ts |
| #31 | US-E3-05: Publicar venture | 🟡 Revisar | publishVenture.ts |
| #32 | US-E3-06: Recomendar suppliers | 🟡 Revisar | recommendSuppliers.ts |

**Estado:** 2/6 completo (33%) + 4 parciales

### E4: Evidence Pipeline (5 stories - M1/M2)
| Issue | Story | Estado | Archivos |
|-------|-------|--------|----------|
| #1 | US-E4-01: Subir evidencia | 🟡 Revisar | verifyEvidence.ts |
| #2 | US-E4-02: Descargar evidencia | 🟡 Revisar | verifyEvidence.ts |
| #3 | US-E4-03: Verificar Vision | 🟡 Revisar | verifyEvidence.ts |
| #4 | US-E4-04: Verificar Audio | 🟡 Revisar | verifyEvidence.ts |
| #5 | US-E4-05: API route verificación | ❌ Revisar | route.ts |

**Estado:** 0/5 completo (0%) - Todos parciales/revisar

---

## 🎯 Recomendaciones

### Issues Listos para Cerrar (2)
✅ **#27** - US-E3-01: Calcular unit economics
✅ **#29** - US-E3-03: Crear acciones del plan

**Acción:** Cerrar estos 2 issues inmediatamente.

### Prioridad Alta - Desbloqueadores (3)
🔴 **#20** - US-E1-01: Enviar mensajes a Gemini (P0)
🔴 **#21** - US-E1-02: Enviar resultados de funciones (P0)
🔴 **#22** - US-E1-03: Registrar tools en Gemini (P0)

**Acción:** Implementar E1 completa para desbloquear todo M1.

### Prioridad Media - Dependientes (4)
🟡 **#23** - US-E2-01: Loop del agente
🟡 **#24** - US-E2-02: Ejecutar tools
🟡 **#25** - US-E2-03: Conectar API route
🟡 **#26** - US-E2-04: Logging

**Acción:** Implementar después de E1.

### Prioridad Baja - Revisar y Completar (9)
⚪ **#28** - US-E3-02: Generar plan (agregar Gemini + Firestore)
⚪ **#30, #31, #32** - E3 tools restantes
⚪ **#1, #2, #3, #4, #5** - E4 Evidence pipeline

**Acción:** Revisar implementaciones parciales y completar TODOs.

---

## 📊 Métricas M1

| Métrica | Valor |
|---------|-------|
| Total issues | 18 |
| Completados | 2 (11%) |
| Parcialmente implementados | 9 (50%) |
| Sin implementar | 7 (39%) |
| Bloqueadores críticos | 3 (E1) |
| Listos para cerrar | 2 |

**Estado general:** 🟡 En progreso (11% completo)

**Bloqueador principal:** Épica E1 (Gemini Integration) - sin esto, M1 no puede avanzar.

---

## 🚀 Plan de Acción Sugerido

### Fase 1: Cerrar lo completo (Ahora)
1. Cerrar issue #27 (computeUnitEconomics)
2. Cerrar issue #29 (createActions)
3. Actualizar milestone: 16/18 open

### Fase 2: Desbloquear M1 (Siguiente sprint)
1. Implementar US-E1-01: Gemini sendMessage()
2. Implementar US-E1-02: Gemini sendFunctionResults()
3. Implementar US-E1-03: Tool registry con schemas
4. Cerrar issues #20, #21, #22

### Fase 3: Orchestration (Sprint siguiente)
1. Implementar US-E2-01: Agent loop
2. Implementar US-E2-02: Tool execution
3. Implementar US-E2-03: API route
4. Implementar US-E2-04: Logging
5. Cerrar issues #23, #24, #25, #26

### Fase 4: Completar Tools (Refinamiento)
1. Revisar y completar tools parciales
2. Agregar Gemini integration a generatePlan
3. Completar Evidence pipeline
4. Cerrar issues restantes

---

## 📝 Notas

- M0 (Foundation) ya está completo (repo, docs, ambiente)
- M1 tiene buena base con 2 tools completamente funcionales
- El bloqueador real es E1 (Gemini Integration)
- Una vez desbloqueado E1, el resto puede avanzar rápido
- Arquitectura y tipos están bien definidos

**Siguiente paso inmediato:** Cerrar issues #27 y #29 en GitHub.
