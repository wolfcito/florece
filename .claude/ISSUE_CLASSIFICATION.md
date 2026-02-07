# Clasificación de Issues - Backend vs Frontend

**Fecha:** 2026-02-06
**Total Issues:** 32 (30 abiertos, 2 cerrados)

## 📋 Labels Creados

| Label | Descripción | Color | Uso |
|-------|-------------|-------|-----|
| `area:backend` | Backend/API/Agent logic | 🟣 Purple | Server-side, APIs, agent, tools, database |
| `area:frontend` | UI/Components/Client-side | 🔵 Blue | React components, pages, UI/UX |
| `area:infra` | Infrastructure/Firebase/Config | 🟡 Yellow | Setup, config, Firebase, deployment |
| `area:testing` | Tests/Demo/QA | 🟪 Light Purple | Unit tests, E2E, demo scripts |

---

## 🎯 Clasificación por Issue

### E1: Gemini Integration (3 issues) - 🟣 BACKEND

| Issue | Title | Labels |
|-------|-------|--------|
| #20 | US-E1-01: Enviar mensajes a Gemini | `area:backend` `Epic:E1-Gemini` `P0:Crítica` |
| #21 | US-E1-02: Enviar resultados de funciones | `area:backend` `Epic:E1-Gemini` `P0:Crítica` |
| #22 | US-E1-03: Registrar tools en Gemini | `area:backend` `Epic:E1-Gemini` `P0:Crítica` |

**Clasificación:** 100% Backend (Gemini API client, function calling)

---

### E2: Agent Orchestration (4 issues) - 🟣 BACKEND

| Issue | Title | Labels |
|-------|-------|--------|
| #23 | US-E2-01: Loop del agente | `area:backend` `Epic:E2-Orchestration` `P0:Crítica` |
| #24 | US-E2-02: Ejecutar tools | `area:backend` `Epic:E2-Orchestration` `P0:Crítica` |
| #25 | US-E2-03: API route con orchestrator | `area:backend` `Epic:E2-Orchestration` `P0:Crítica` |
| #26 | US-E2-04: Logging de agent runs | `area:backend` `Epic:E2-Orchestration` `P1:Alta` |

**Clasificación:** 100% Backend (Agent orchestration, API routes, logging)

---

### E3: Business Tools (6 issues) - 🟣 BACKEND

| Issue | Title | Labels | Estado |
|-------|-------|--------|--------|
| #27 | US-E3-01: Calcular unit economics | `area:backend` `Epic:E3-Business-Tools` `P0:Crítica` | ✅ CERRADO |
| #28 | US-E3-02: Generar plan | `area:backend` `Epic:E3-Business-Tools` `P0:Crítica` | 🟡 Parcial |
| #29 | US-E3-03: Crear acciones | `area:backend` `Epic:E3-Business-Tools` `P0:Crítica` | ✅ CERRADO |
| #30 | US-E3-04: Generar recibo | `area:backend` `Epic:E3-Business-Tools` `P1:Alta` | 🟡 Parcial |
| #31 | US-E3-05: Publicar emprendimiento | `area:backend` `Epic:E3-Business-Tools` `P2:Media` | 🟡 Parcial |
| #32 | US-E3-06: Recomendar proveedores | `area:backend` `Epic:E3-Business-Tools` `P2:Media` | 🟡 Parcial |

**Clasificación:** 100% Backend (Deterministic tools, business logic)

---

### E4: Evidence Pipeline (5 issues) - 🟣🔵 BACKEND + FRONTEND

| Issue | Title | Labels | Tipo |
|-------|-------|--------|------|
| #1 | US-E4-01: Subir evidencia | `area:backend` `Epic:E4-Evidence` `P0:Crítica` | Backend (Storage API) |
| #2 | US-E4-02: Descargar evidencia | `area:backend` `Epic:E4-Evidence` `P1:Alta` | Backend (Storage API) |
| #3 | US-E4-03: Verificar con Vision | `area:backend` `Epic:E4-Evidence` `P0:Crítica` | Backend (Gemini Vision) |
| #4 | US-E4-04: Verificar con Audio | `area:backend` `Epic:E4-Evidence` `P0:Crítica` | Backend (Gemini Audio) |
| #5 | US-E4-05: API route verificación | `area:backend` `Epic:E4-Evidence` `P1:Alta` | Backend (API route) |

**Clasificación:** 100% Backend (aunque UI tendrá componentes de upload, la lógica es backend)

**Nota:** El componente UI de upload (#11) está en E5, no aquí.

---

### E5: User Interface (8 issues) - 🔵 FRONTEND

| Issue | Title | Labels | Tipo |
|-------|-------|--------|------|
| #6 | US-E5-01: Landing page | `area:frontend` `Epic:E5-UI` `P1:Alta` | Frontend (React page) |
| #7 | US-E5-02: Flujo diagnóstico 5Q | `area:frontend` `Epic:E5-UI` `P0:Crítica` | Frontend (Multi-step form) |
| #8 | US-E5-03: Grabador de voz | `area:frontend` `Epic:E5-UI` `P0:Crítica` | Frontend (Audio recorder component) |
| #9 | US-E5-04: Vista del plan | `area:frontend` `Epic:E5-UI` `P0:Crítica` | Frontend (Plan display) |
| #10 | US-E5-05: Detalle de acción | `area:frontend` `Epic:E5-UI` `P0:Crítica` | Frontend (Action detail page) |
| #11 | US-E5-06: Upload evidencia | `area:frontend` `Epic:E5-UI` `P0:Crítica` | Frontend (File upload component) |
| #12 | US-E5-07: Vista de recibo | `area:frontend` `Epic:E5-UI` `P1:Alta` | Frontend (Receipt display) |
| #13 | US-E5-08: Navegación y layout | `area:frontend` `Epic:E5-UI` `P1:Alta` | Frontend (Layout, navigation) |

**Clasificación:** 100% Frontend (UI components, pages, user interactions)

---

### E6: Authentication (2 issues) - 🟣🔵 BACKEND + FRONTEND

| Issue | Title | Labels | Tipo |
|-------|-------|--------|------|
| #14 | US-E6-01: Login con Firebase Auth | `area:frontend` `area:backend` `Epic:E6-Auth` `P1:Alta` | Ambos (UI + API validation) |
| #15 | US-E6-02: Proteger rutas privadas | `area:frontend` `area:backend` `Epic:E6-Auth` `P1:Alta` | Ambos (Middleware + UI guards) |

**Clasificación:** 50% Backend, 50% Frontend (Auth requiere ambos lados)

---

### E7: Demo & Testing (4 issues) - 🟪 TESTING

| Issue | Title | Labels | Tipo |
|-------|-------|--------|------|
| #16 | US-E7-01: Seed data | `area:testing` `area:backend` `Epic:E7-Demo` `P1:Alta` | Testing + Backend (script + data) |
| #17 | US-E7-02: Script de demo | `area:testing` `Epic:E7-Demo` `P1:Alta` | Testing (automation script) |
| #18 | US-E7-03: Tests unitarios tools | `area:testing` `area:backend` `Epic:E7-Demo` `P1:Alta` | Testing + Backend (unit tests) |
| #19 | US-E7-04: Test E2E happy path | `area:testing` `area:frontend` `Epic:E7-Demo` `P1:Alta` | Testing + Frontend (E2E tests) |

**Clasificación:** Principalmente Testing, con overlap en backend/frontend

---

## 📊 Resumen por Área

| Área | Issues | % | Descripción |
|------|--------|---|-------------|
| **Backend** | 22 | 69% | Agent, APIs, tools, database, Gemini |
| **Frontend** | 10 | 31% | UI components, pages, layouts |
| **Ambos** | 2 | 6% | Auth (frontend + backend) |
| **Testing** | 4 | 13% | Tests, demo, QA |

**Nota:** Algunos issues tienen múltiples labels (ej. Auth, Testing)

### Desglose Detallado

**Solo Backend (18 issues):**
- E1: Gemini Integration (3)
- E2: Agent Orchestration (4)
- E3: Business Tools (6)
- E4: Evidence Pipeline (5)

**Solo Frontend (8 issues):**
- E5: User Interface (8)

**Backend + Frontend (2 issues):**
- E6: Authentication (2)

**Testing (4 issues):**
- E7: Demo & Testing (4)

---

## 🎯 Filtros Útiles para el Equipo

### Para Backend Team
```bash
# Ver todos los issues de backend
gh issue list --label "area:backend" --state open

# Backend críticos (P0)
gh issue list --label "area:backend" --label "P0:Crítica" --state open

# Backend en progreso
gh issue list --label "area:backend" --label "status:in-progress" --state open
```

### Para Frontend Team
```bash
# Ver todos los issues de frontend
gh issue list --label "area:frontend" --state open

# Frontend críticos
gh issue list --label "area:frontend" --label "P0:Crítica" --state open

# Frontend UI
gh issue list --label "Epic:E5-UI" --state open
```

### Para Testing Team
```bash
# Ver todos los issues de testing
gh issue list --label "area:testing" --state open

# Tests que pueden hacerse ahora
gh issue list --label "area:testing" --json number,title,labels
```

---

## 🚀 Comandos para Aplicar Labels

### Backend Issues (E1, E2, E3, E4)
```bash
# E1: Gemini Integration
gh issue edit 20 --add-label "area:backend"
gh issue edit 21 --add-label "area:backend"
gh issue edit 22 --add-label "area:backend"

# E2: Agent Orchestration
gh issue edit 23 --add-label "area:backend"
gh issue edit 24 --add-label "area:backend"
gh issue edit 25 --add-label "area:backend"
gh issue edit 26 --add-label "area:backend"

# E3: Business Tools
gh issue edit 27 --add-label "area:backend"  # Cerrado pero le ponemos label
gh issue edit 28 --add-label "area:backend"
gh issue edit 29 --add-label "area:backend"  # Cerrado pero le ponemos label
gh issue edit 30 --add-label "area:backend"
gh issue edit 31 --add-label "area:backend"
gh issue edit 32 --add-label "area:backend"

# E4: Evidence Pipeline
gh issue edit 1 --add-label "area:backend"
gh issue edit 2 --add-label "area:backend"
gh issue edit 3 --add-label "area:backend"
gh issue edit 4 --add-label "area:backend"
gh issue edit 5 --add-label "area:backend"
```

### Frontend Issues (E5)
```bash
# E5: User Interface
gh issue edit 6 --add-label "area:frontend"
gh issue edit 7 --add-label "area:frontend"
gh issue edit 8 --add-label "area:frontend"
gh issue edit 9 --add-label "area:frontend"
gh issue edit 10 --add-label "area:frontend"
gh issue edit 11 --add-label "area:frontend"
gh issue edit 12 --add-label "area:frontend"
gh issue edit 13 --add-label "area:frontend"
```

### Backend + Frontend (E6)
```bash
# E6: Authentication
gh issue edit 14 --add-label "area:frontend,area:backend"
gh issue edit 15 --add-label "area:frontend,area:backend"
```

### Testing Issues (E7)
```bash
# E7: Demo & Testing
gh issue edit 16 --add-label "area:testing,area:backend"
gh issue edit 17 --add-label "area:testing"
gh issue edit 18 --add-label "area:testing,area:backend"
gh issue edit 19 --add-label "area:testing,area:frontend"
```

---

## 📝 Notas para el Equipo

### Backend Team - Prioridades
1. **CRÍTICO:** E1 (Gemini) - Sin esto nada funciona
2. **CRÍTICO:** E2 (Orchestration) - Depende de E1
3. **Alta:** Completar E3 (Tools) - 4 parciales pendientes
4. **Media:** E4 (Evidence) - Verificación con Gemini

### Frontend Team - Prioridades
1. **Esperar a backend:** E5 necesita agent funcionando
2. **Puede empezar:** #6 (Landing), #8 (Grabador), #13 (Layout)
3. **Bloqueado:** #7 (Diagnóstico), #9 (Plan) necesitan backend

### Testing Team - Puede Empezar
1. **#18** - Tests unitarios de tools (NO bloqueado)
2. **#16, #17, #19** - Bloqueados por backend + frontend

---

## ✅ Beneficios de Esta Clasificación

**Para el equipo:**
- ✅ Filtrar issues por área de expertise
- ✅ Identificar dependencias backend/frontend
- ✅ Asignar trabajo según especialidad
- ✅ Ver progreso por área

**Para planificación:**
- ✅ Backend primero, frontend después
- ✅ Identificar bottlenecks (E1 bloquea todo backend)
- ✅ Paralelizar trabajo cuando sea posible
- ✅ Estimar capacidad por equipo

**Próximo paso:** Aplicar todos los labels automáticamente.
