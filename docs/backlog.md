# Product Backlog - Florece

## Milestones

| ID | Milestone | Objetivo | Estado |
|----|-----------|----------|--------|
| M0 | Foundation | Repo, docs, ambiente listo | ✅ Completado |
| M1 | Agent Core | Agente ejecuta tools y genera planes | 🚧 En progreso |
| M2 | UI & Evidence | Usuario completa diagnóstico y sube evidencia | ⬜ Pendiente |
| M3 | Demo E2E | Happy path funciona sin errores | ⬜ Bloqueado |

---

## Épicas

| ID | Épica | Descripción | Milestone | Stories |
|----|-------|-------------|-----------|---------|
| E1 | Gemini Integration | Conexión con API de Gemini para LLM | M1 | 3 |
| E2 | Agent Orchestration | Loop del agente y ejecución de tools | M1 | 4 |
| E3 | Business Tools | Herramientas de cálculo y generación | M1 | 6 |
| E4 | Evidence Pipeline | Subida, verificación y gestión de evidencia | M1/M2 | 5 |
| E5 | User Interface | Componentes de UI mobile-first | M2 | 8 |
| E6 | Authentication | Login y manejo de sesiones | M2 | 2 |
| E7 | Demo & Testing | Demo script y pruebas E2E | M3 | 4 |

---

## User Stories por Épica

### E1: Gemini Integration

#### US-E1-01: Enviar mensajes a Gemini
**Como** sistema
**Quiero** enviar mensajes al API de Gemini
**Para que** el agente pueda procesar lenguaje natural

**Archivo**: `src/agent/gemini/client.ts`

**Criterios de Aceptación**:
- [ ] Implementar `sendMessage(prompt, history)`
- [ ] Manejar respuestas de texto y function calls
- [ ] Implementar retry con exponential backoff
- [ ] Logs de cada llamada para debugging

**Puntos**: 5 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

**Bloquea**: US-E2-01, US-E2-02, US-E4-03

---

#### US-E1-02: Enviar resultados de funciones a Gemini
**Como** sistema
**Quiero** enviar los resultados de tool execution a Gemini
**Para que** el agente pueda continuar la conversación

**Archivo**: `src/agent/gemini/client.ts`

**Criterios de Aceptación**:
- [ ] Implementar `sendFunctionResults(functionName, result)`
- [ ] Formatear resultados según spec de Gemini
- [ ] Manejar múltiples function results en batch

**Puntos**: 3 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

**Bloquea**: US-E2-02

---

#### US-E1-03: Registrar tools en Gemini
**Como** sistema
**Quiero** registrar las 7 tools con sus JSON schemas
**Para que** Gemini pueda invocarlas via function calling

**Archivo**: `src/agent/gemini/toolRegistry.ts`

**Criterios de Aceptación**:
- [ ] Definir JSON schema para cada tool
- [ ] Registrar: computeUnitEconomics, generatePlan, createActions, verifyEvidence, createReceipt, publishVenture, recommendSuppliers
- [ ] Validar schemas con TypeScript types
- [ ] Export función `getToolsForGemini()`

**Puntos**: 5 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

**Bloquea**: US-E2-01

---

### E2: Agent Orchestration

#### US-E2-01: Implementar loop del agente
**Como** sistema
**Quiero** un loop de orquestación que procese mensajes
**Para que** el agente pueda mantener conversaciones multi-turno

**Archivo**: `src/agent/orchestrator.ts`

**Criterios de Aceptación**:
- [ ] Implementar `runAgent(caseId, message)`
- [ ] Loop: recibir → procesar → tool call → responder
- [ ] Máximo 10 iteraciones por seguridad
- [ ] Guardar agent_run en Firestore
- [ ] Retornar respuesta final al usuario

**Puntos**: 8 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

**Depende de**: US-E1-01, US-E1-03

---

#### US-E2-02: Ejecutar tools desde el agente
**Como** agente
**Quiero** ejecutar tools cuando Gemini las solicite
**Para que** pueda realizar acciones concretas

**Archivo**: `src/agent/gemini/toolRegistry.ts`

**Criterios de Aceptación**:
- [ ] Implementar `executeTool(name, params)`
- [ ] Validar parámetros antes de ejecutar
- [ ] Capturar errores y formatear para Gemini
- [ ] Loggear cada ejecución

**Puntos**: 5 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

**Depende de**: US-E1-02

---

#### US-E2-03: Conectar API route con orchestrator
**Como** frontend
**Quiero** llamar al agente via API
**Para que** los usuarios puedan interactuar

**Archivo**: `src/app/api/run-agent/route.ts`

**Criterios de Aceptación**:
- [ ] POST recibe `{ caseId, message }`
- [ ] Verificar Firebase Auth token
- [ ] Llamar `runAgent()` y retornar respuesta
- [ ] Manejar errores con códigos HTTP apropiados

**Puntos**: 3 | **Prioridad**: P0 (Crítica) | **Estado**: 🚧 Parcial

**Depende de**: US-E2-01

---

#### US-E2-04: Logging de agent runs
**Como** desarrollador
**Quiero** logs de cada ejecución del agente
**Para que** pueda debuggear problemas

**Archivo**: `src/agent/orchestrator.ts`

**Criterios de Aceptación**:
- [ ] Crear documento en `agent_runs` collection
- [ ] Guardar: caseId, messages, toolCalls, timestamps
- [ ] Actualizar status: running → completed/failed
- [ ] Incluir duración total

**Puntos**: 3 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

### E3: Business Tools

#### US-E3-01: Calcular unit economics
**Como** agente
**Quiero** calcular métricas económicas del negocio
**Para que** el usuario entienda su rentabilidad

**Archivo**: `src/tools/computeUnitEconomics.ts`

**Criterios de Aceptación**:
- [x] Recibir: costPerUnit, pricePerUnit, hoursAvailable
- [x] Calcular: margin, revenue, profit, breakEven
- [x] Validar inputs (no negativos)
- [x] Retornar recomendaciones

**Puntos**: 3 | **Prioridad**: P0 (Crítica) | **Estado**: ✅ Completado

---

#### US-E3-02: Generar plan de 7 días
**Como** agente
**Quiero** generar un plan personalizado
**Para que** el usuario sepa qué hacer

**Archivo**: `src/tools/generatePlan.ts`

**Criterios de Aceptación**:
- [ ] Recibir contexto del diagnóstico
- [ ] Generar exactamente 5 acciones
- [ ] Cada acción: título, descripción, día, evidenceType
- [ ] Usar templates + personalización via LLM
- [ ] Guardar en `plans` collection

**Puntos**: 5 | **Prioridad**: P0 (Crítica) | **Estado**: 🚧 Parcial

**Depende de**: US-E1-01

---

#### US-E3-03: Crear acciones del plan
**Como** agente
**Quiero** crear las 5 acciones en Firestore
**Para que** el usuario pueda trackearlas

**Archivo**: `src/tools/createActions.ts`

**Criterios de Aceptación**:
- [ ] Recibir planId y lista de acciones
- [ ] Crear documentos en `actions` collection
- [ ] Status inicial: `pending`
- [ ] Asignar orden y día correspondiente
- [ ] Retornar IDs de acciones creadas

**Puntos**: 3 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

---

#### US-E3-04: Generar recibo de completación
**Como** agente
**Quiero** generar un certificado de progreso
**Para que** el usuario sienta logro

**Archivo**: `src/tools/createReceipt.ts`

**Criterios de Aceptación**:
- [ ] Recibir caseId y planId
- [ ] Calcular acciones completadas/verificadas
- [ ] Generar mensaje de felicitación
- [ ] Crear imagen/PDF del certificado
- [ ] Guardar en `receipts` collection

**Puntos**: 5 | **Prioridad**: P1 (Alta) | **Estado**: 🚧 Parcial

---

#### US-E3-05: Publicar emprendimiento
**Como** agente
**Quiero** publicar el venture del usuario
**Para que** otros puedan verlo (post-MVP feature)

**Archivo**: `src/tools/publishVenture.ts`

**Criterios de Aceptación**:
- [ ] Marcar caso como público
- [ ] Generar URL compartible
- [ ] Crear preview card

**Puntos**: 3 | **Prioridad**: P2 (Media) | **Estado**: ⬜ Pendiente

---

#### US-E3-06: Recomendar proveedores
**Como** agente
**Quiero** sugerir proveedores relevantes
**Para que** el usuario encuentre recursos

**Archivo**: `src/tools/recommendSuppliers.ts`

**Criterios de Aceptación**:
- [ ] Recibir tipo de negocio y ubicación
- [ ] Buscar en catálogo de proveedores
- [ ] Retornar lista ordenada por relevancia

**Puntos**: 3 | **Prioridad**: P2 (Media) | **Estado**: ⬜ Pendiente

---

### E4: Evidence Pipeline

#### US-E4-01: Subir archivo de evidencia
**Como** usuario
**Quiero** subir foto/audio/documento
**Para que** mi progreso quede registrado

**Archivo**: `src/app/api/upload-evidence/route.ts`

**Criterios de Aceptación**:
- [ ] Aceptar image/audio/document (max 10MB)
- [ ] Generar signed URL para Firebase Storage
- [ ] Crear documento en `evidence` collection
- [ ] Status inicial: `pending`
- [ ] Retornar evidenceId y uploadUrl

**Puntos**: 5 | **Prioridad**: P0 (Crítica) | **Estado**: 🚧 Parcial

---

#### US-E4-02: Descargar archivo de evidencia
**Como** sistema
**Quiero** acceder al archivo subido
**Para que** pueda verificarlo

**Archivo**: `src/app/api/verify-evidence/route.ts`

**Criterios de Aceptación**:
- [ ] Obtener URL de descarga desde Storage
- [ ] Soportar image, audio, document
- [ ] Manejar archivos no encontrados

**Puntos**: 3 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

---

#### US-E4-03: Verificar evidencia con Gemini Vision
**Como** agente
**Quiero** analizar imágenes subidas
**Para que** pueda aprobar o rechazar evidencia

**Archivo**: `src/tools/verifyEvidence.ts`

**Criterios de Aceptación**:
- [ ] Enviar imagen a Gemini Vision
- [ ] Prompt: "¿Esta imagen muestra [criterio de la acción]?"
- [ ] Obtener: approved/rejected + confidence + reasoning
- [ ] Actualizar status en `evidence` collection
- [ ] Si approved, actualizar `action` status a verified

**Puntos**: 8 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

**Depende de**: US-E1-01, US-E4-02

---

#### US-E4-04: Verificar evidencia con Gemini Audio
**Como** agente
**Quiero** analizar audios subidos
**Para que** pueda verificar conversaciones

**Archivo**: `src/tools/verifyEvidence.ts`

**Criterios de Aceptación**:
- [ ] Transcribir audio con Gemini
- [ ] Analizar contenido de transcripción
- [ ] Verificar que cumple criterio de acción
- [ ] Retornar veredicto con explicación

**Puntos**: 8 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

**Depende de**: US-E1-01, US-E4-02

---

#### US-E4-05: API route para verificación
**Como** frontend
**Quiero** endpoint para solicitar verificación
**Para que** el usuario pueda ver resultados

**Archivo**: `src/app/api/verify-evidence/route.ts`

**Criterios de Aceptación**:
- [ ] POST recibe `{ evidenceId }`
- [ ] Verificar auth y ownership
- [ ] Llamar `verifyEvidence` tool
- [ ] Retornar resultado al frontend

**Puntos**: 3 | **Prioridad**: P0 (Crítica) | **Estado**: 🚧 Parcial

**Depende de**: US-E4-03

---

### E5: User Interface

#### US-E5-01: Landing page
**Como** usuario
**Quiero** ver una página de inicio atractiva
**Para que** entienda qué es Florece

**Archivo**: `src/app/page.tsx`

**Criterios de Aceptación**:
- [ ] Hero con propuesta de valor
- [ ] CTA para comenzar diagnóstico
- [ ] Mobile-first responsive
- [ ] Carga en < 2 segundos

**Puntos**: 5 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

#### US-E5-02: Flujo de diagnóstico (5Q)
**Como** usuario
**Quiero** responder 5 preguntas sobre mi idea
**Para que** el agente me entienda

**Archivo**: `src/app/diagnostic/page.tsx`

**Criterios de Aceptación**:
- [ ] UI paso a paso (1 pregunta por pantalla)
- [ ] Input de texto + botón de voz
- [ ] Progreso visual (1/5, 2/5...)
- [ ] Confirmación antes de enviar
- [ ] Transición suave entre preguntas

**Puntos**: 8 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

---

#### US-E5-03: Grabador de voz
**Como** usuario
**Quiero** grabar mi voz
**Para que** pueda responder sin escribir

**Archivo**: `src/components/VoiceRecorder.tsx`

**Criterios de Aceptación**:
- [ ] Botón de grabar/parar
- [ ] Visualización de ondas mientras graba
- [ ] Preview del audio grabado
- [ ] Funciona en Safari iOS y Chrome Android
- [ ] Max 2 minutos por grabación

**Puntos**: 8 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

---

#### US-E5-04: Vista del plan
**Como** usuario
**Quiero** ver mi plan de 7 días
**Para que** sepa qué debo hacer

**Archivo**: `src/app/plan/[id]/page.tsx`

**Criterios de Aceptación**:
- [ ] Lista de 5 acciones con status
- [ ] Indicador del día actual
- [ ] Click en acción abre detalle
- [ ] Progreso general visible (X/5)

**Puntos**: 5 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

---

#### US-E5-05: Detalle de acción
**Como** usuario
**Quiero** ver los detalles de una acción
**Para que** sepa exactamente qué hacer

**Archivo**: `src/app/actions/[id]/page.tsx`

**Criterios de Aceptación**:
- [ ] Título y descripción de la acción
- [ ] Tipo de evidencia requerida
- [ ] Botón para subir evidencia
- [ ] Status actual (pending/in_progress/completed/verified)
- [ ] Historial de evidencias subidas

**Puntos**: 5 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

---

#### US-E5-06: Componente de upload de evidencia
**Como** usuario
**Quiero** subir mi evidencia fácilmente
**Para que** complete mis acciones

**Archivo**: `src/components/EvidenceUpload.tsx`

**Criterios de Aceptación**:
- [ ] Selector de archivo (foto/audio/doc)
- [ ] Opción de tomar foto con cámara
- [ ] Opción de grabar audio directo
- [ ] Preview antes de enviar
- [ ] Progress bar durante upload
- [ ] Confirmación de éxito/error

**Puntos**: 8 | **Prioridad**: P0 (Crítica) | **Estado**: ⬜ Pendiente

---

#### US-E5-07: Vista de recibo
**Como** usuario
**Quiero** ver mi certificado de progreso
**Para que** me sienta motivado

**Archivo**: `src/app/receipts/[id]/page.tsx`

**Criterios de Aceptación**:
- [ ] Muestra X/5 acciones completadas
- [ ] Porcentaje de progreso
- [ ] Mensaje motivacional
- [ ] Opción de compartir (opcional)
- [ ] Lista de acciones verificadas

**Puntos**: 5 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

#### US-E5-08: Navegación y layout
**Como** usuario
**Quiero** navegación clara
**Para que** no me pierda en la app

**Archivo**: `src/app/layout.tsx`, `src/components/Navigation.tsx`

**Criterios de Aceptación**:
- [ ] Header con logo y menú
- [ ] Bottom nav para mobile
- [ ] Breadcrumbs en páginas internas
- [ ] Back button funcional

**Puntos**: 3 | **Prioridad**: P1 (Alta) | **Estado**: 🚧 Parcial

---

### E6: Authentication

#### US-E6-01: Login con Firebase Auth
**Como** usuario
**Quiero** iniciar sesión
**Para que** mis datos estén seguros

**Archivo**: `src/app/login/page.tsx`

**Criterios de Aceptación**:
- [ ] Login con email/password (mock ok para demo)
- [ ] Redirect a dashboard después de login
- [ ] Persistencia de sesión
- [ ] Logout funcional

**Puntos**: 5 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

#### US-E6-02: Proteger rutas privadas
**Como** sistema
**Quiero** verificar auth en cada request
**Para que** solo usuarios autenticados accedan

**Archivo**: `src/middleware.ts`

**Criterios de Aceptación**:
- [ ] Middleware verifica token en rutas /api/*
- [ ] Redirect a /login si no autenticado
- [ ] Rutas públicas: /, /login

**Puntos**: 3 | **Prioridad**: P1 (Alta) | **Estado**: 🚧 Parcial

---

### E7: Demo & Testing

#### US-E7-01: Seed data para demo
**Como** desarrollador
**Quiero** datos de prueba consistentes
**Para que** la demo sea reproducible

**Archivo**: `scripts/seed-demo.ts`

**Criterios de Aceptación**:
- [ ] Crear usuario "Sofía"
- [ ] Crear caso "La tienda de Sofía"
- [ ] Pre-cargar diagnóstico completado
- [ ] Reset a estado inicial

**Puntos**: 3 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

#### US-E7-02: Script de demo automatizado
**Como** presentador
**Quiero** un script que guíe la demo
**Para que** no olvide pasos

**Archivo**: `scripts/run-demo.sh`

**Criterios de Aceptación**:
- [ ] Instrucciones paso a paso
- [ ] Verificación de cada paso
- [ ] Tiempo total < 3 minutos
- [ ] Funciona 3 veces seguidas sin errores

**Puntos**: 3 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

#### US-E7-03: Tests unitarios de tools
**Como** desarrollador
**Quiero** tests para cada tool
**Para que** no rompamos funcionalidad

**Archivo**: `src/tools/__tests__/`

**Criterios de Aceptación**:
- [ ] Test computeUnitEconomics (happy path + edge cases)
- [ ] Test generatePlan (estructura correcta)
- [ ] Test createActions (crea en Firestore)
- [ ] Coverage > 80% en tools

**Puntos**: 5 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

#### US-E7-04: Test E2E del happy path
**Como** desarrollador
**Quiero** un test que corra el flujo completo
**Para que** detectemos regresiones

**Archivo**: `e2e/happy-path.spec.ts`

**Criterios de Aceptación**:
- [ ] Login → Diagnóstico → Plan → Acción → Evidencia → Recibo
- [ ] Usa Playwright o Cypress
- [ ] Corre en CI antes de merge
- [ ] Screenshots en cada paso

**Puntos**: 8 | **Prioridad**: P1 (Alta) | **Estado**: ⬜ Pendiente

---

## Resumen por Prioridad

### P0 - Críticas (Bloquean demo)
| ID | Story | Puntos | Estado |
|----|-------|--------|--------|
| US-E1-01 | Enviar mensajes a Gemini | 5 | ⬜ |
| US-E1-02 | Enviar resultados de funciones | 3 | ⬜ |
| US-E1-03 | Registrar tools en Gemini | 5 | ⬜ |
| US-E2-01 | Loop del agente | 8 | ⬜ |
| US-E2-02 | Ejecutar tools | 5 | ⬜ |
| US-E2-03 | API route run-agent | 3 | 🚧 |
| US-E3-01 | Calcular unit economics | 3 | ✅ |
| US-E3-02 | Generar plan | 5 | 🚧 |
| US-E3-03 | Crear acciones | 3 | ⬜ |
| US-E4-01 | Subir evidencia | 5 | 🚧 |
| US-E4-03 | Verificar con Vision | 8 | ⬜ |
| US-E4-04 | Verificar con Audio | 8 | ⬜ |
| US-E5-02 | Flujo diagnóstico | 8 | ⬜ |
| US-E5-03 | Grabador de voz | 8 | ⬜ |
| US-E5-04 | Vista del plan | 5 | ⬜ |
| US-E5-05 | Detalle de acción | 5 | ⬜ |
| US-E5-06 | Upload evidencia | 8 | ⬜ |
| **Total P0** | | **95 pts** | |

### P1 - Altas (Necesarias para demo completa)
| ID | Story | Puntos | Estado |
|----|-------|--------|--------|
| US-E2-04 | Logging agent runs | 3 | ⬜ |
| US-E3-04 | Generar recibo | 5 | 🚧 |
| US-E4-02 | Descargar evidencia | 3 | ⬜ |
| US-E4-05 | API verificación | 3 | 🚧 |
| US-E5-01 | Landing page | 5 | ⬜ |
| US-E5-07 | Vista de recibo | 5 | ⬜ |
| US-E5-08 | Navegación | 3 | 🚧 |
| US-E6-01 | Login | 5 | ⬜ |
| US-E6-02 | Proteger rutas | 3 | 🚧 |
| US-E7-01 | Seed data | 3 | ⬜ |
| US-E7-02 | Script demo | 3 | ⬜ |
| US-E7-03 | Tests unitarios | 5 | ⬜ |
| US-E7-04 | Test E2E | 8 | ⬜ |
| **Total P1** | | **54 pts** | |

### P2 - Medias (Post-MVP o si hay tiempo)
| ID | Story | Puntos | Estado |
|----|-------|--------|--------|
| US-E3-05 | Publicar venture | 3 | ⬜ |
| US-E3-06 | Recomendar suppliers | 3 | ⬜ |
| **Total P2** | | **6 pts** | |

---

## Sprint Planning Sugerido

### Sprint 1: Agent Core (P0 crítico)
**Objetivo**: El agente puede recibir mensajes y ejecutar tools

| Story | Asignado | Status |
|-------|----------|--------|
| US-E1-01 | Dev 1 | |
| US-E1-02 | Dev 1 | |
| US-E1-03 | Dev 1 | |
| US-E2-01 | Dev 2 | |
| US-E2-02 | Dev 2 | |
| US-E2-03 | Dev 2 | |

**Total**: 29 puntos

---

### Sprint 2: Tools & Evidence
**Objetivo**: Tools funcionan y evidencia se puede subir/verificar

| Story | Asignado | Status |
|-------|----------|--------|
| US-E3-02 | Dev 1 | |
| US-E3-03 | Dev 1 | |
| US-E4-01 | Dev 2 | |
| US-E4-02 | Dev 2 | |
| US-E4-03 | Dev 1 | |
| US-E4-04 | Dev 1 | |

**Total**: 35 puntos

---

### Sprint 3: UI Components
**Objetivo**: Usuario puede navegar el flujo completo

| Story | Asignado | Status |
|-------|----------|--------|
| US-E5-01 | Dev 3 | |
| US-E5-02 | Dev 3 | |
| US-E5-03 | Dev 3 | |
| US-E5-04 | Dev 3 | |
| US-E5-05 | Dev 3 | |
| US-E5-06 | Dev 3 | |

**Total**: 39 puntos

---

### Sprint 4: Integration & Demo
**Objetivo**: Demo funciona E2E sin errores

| Story | Asignado | Status |
|-------|----------|--------|
| US-E3-04 | Dev 1 | |
| US-E5-07 | Dev 3 | |
| US-E6-01 | Dev 2 | |
| US-E6-02 | Dev 2 | |
| US-E7-01 | Dev 2 | |
| US-E7-02 | Team | |
| US-E7-03 | Dev 1 | |
| US-E7-04 | Dev 2 | |

**Total**: 40 puntos

---

## Diagrama de Dependencias

```
US-E1-01 (Gemini sendMessage)
    │
    ├──► US-E1-02 (sendFunctionResults)
    │        │
    │        └──► US-E2-02 (Execute tools)
    │                 │
    │                 └──► US-E2-01 (Agent loop)
    │                          │
    │                          └──► US-E2-03 (API route)
    │
    ├──► US-E3-02 (generatePlan) ──► US-E3-03 (createActions)
    │
    └──► US-E4-03 (verifyEvidence Vision)
         US-E4-04 (verifyEvidence Audio)
              │
              └──► US-E4-05 (API verify)

US-E1-03 (Register tools)
    │
    └──► US-E2-01 (Agent loop)

US-E4-01 (Upload evidence)
    │
    └──► US-E4-02 (Download evidence)
              │
              └──► US-E4-03, US-E4-04 (Verify)

[UI Stories son mayormente independientes]
US-E5-02 (Diagnostic) ──► US-E5-03 (VoiceRecorder)
US-E5-04 (Plan view) ──► US-E5-05 (Action detail) ──► US-E5-06 (Evidence upload)
```

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Completado |
| 🚧 | En progreso / Parcialmente implementado |
| ⬜ | Pendiente |
| P0 | Crítica - Bloquea demo |
| P1 | Alta - Necesaria para demo completa |
| P2 | Media - Post-MVP |

---

## Notas para el Equipo

1. **Empezar por E1** - Sin Gemini integration, nada más funciona
2. **UI puede ir en paralelo** - Un dev puede trabajar UI mientras otros hacen backend
3. **Tests son importantes** - Incluir tiempo para tests unitarios
4. **Mobile-first** - Probar en Safari iOS frecuentemente
5. **No scope creep** - Si no está en este doc, va al backlog post-MVP
