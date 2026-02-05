# Estado del Proyecto - Florece

> **IMPORTANTE PARA AGENTES**: Lee este archivo primero para entender el estado actual.
> Después de cada sesión de trabajo, actualiza este archivo.

## Estado Actual

```yaml
ultima_actualizacion: 2025-02-05
milestone_activo: M1 - Agent Core
sprint_activo: Sprint 1
progreso_general: 15%
```

## Tareas en Progreso

<!-- Cuando alguien esté trabajando en algo, agrégalo aquí -->

| Tarea | Desarrollador | Inicio | Archivo Principal |
|-------|---------------|--------|-------------------|
| - | - | - | - |

## Tareas Completadas Recientemente

<!-- Últimas 5 tareas completadas -->

| Tarea | Desarrollador | Fecha | Commit |
|-------|---------------|-------|--------|
| US-E3-01 | setup | 2025-02-04 | initial |

## Bloqueos Actuales

<!-- Si algo está bloqueado, documéntalo aquí -->

| Tarea Bloqueada | Bloqueada Por | Notas |
|-----------------|---------------|-------|
| US-E2-01 | US-E1-01, US-E1-03 | Necesita Gemini client |
| US-E4-03 | US-E1-01 | Necesita Gemini Vision |

---

## Siguiente Paso Recomendado

### Para CUALQUIER desarrollador disponible:

**Tarea**: `US-E1-01` - Enviar mensajes a Gemini
**Archivo**: `src/agent/gemini/client.ts`
**Por qué**: Es P0, no tiene dependencias, y desbloquea 5 tareas más.

### Alternativas (pueden hacerse en paralelo):

1. `US-E5-01` - Landing page (UI, sin dependencias backend)
2. `US-E5-03` - Grabador de voz (componente aislado)
3. `US-E6-01` - Login con Firebase (UI + Auth)

---

## Ruta Crítica

```
┌─────────────────────────────────────────────────────────────┐
│  CRÍTICO: Sin esto, nada más funciona                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  US-E1-01 ──► US-E1-02 ──► US-E2-02 ──► US-E2-01           │
│  (Gemini)    (FnResults)   (Execute)    (Loop)             │
│     │                                      │                │
│     └──────────────────────────────────────┘                │
│                      │                                      │
│                      ▼                                      │
│               US-E2-03 (API route)                          │
│                      │                                      │
│                      ▼                                      │
│              ┌───────┴───────┐                              │
│              │               │                              │
│          US-E3-02        US-E4-03                           │
│         (genPlan)      (verify)                             │
│              │               │                              │
│              ▼               ▼                              │
│          US-E3-03        US-E4-05                           │
│        (actions)       (API verify)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Checklist del Agente

Cuando un desarrollador inicie sesión, el agente debe:

- [ ] Leer este archivo (STATUS.md)
- [ ] Verificar si hay tareas "En Progreso" sin completar
- [ ] Sugerir completar/actualizar tareas pendientes del dev
- [ ] Mostrar el "Siguiente Paso Recomendado"
- [ ] Preguntar qué tarea quiere tomar el dev

Cuando el desarrollador complete una tarea:

- [ ] Actualizar `docs/backlog.md` (cambiar ⬜ a ✅)
- [ ] Mover la tarea de "En Progreso" a "Completadas Recientemente"
- [ ] Actualizar "Siguiente Paso Recomendado" si aplica
- [ ] Verificar si se desbloquearon nuevas tareas
- [ ] Hacer commit con los cambios

---

## Métricas por Épica

| Épica | Total | ✅ | 🚧 | ⬜ | % |
|-------|-------|----|----|----|----|
| E1: Gemini | 3 | 0 | 0 | 3 | 0% |
| E2: Agent | 4 | 0 | 1 | 3 | 10% |
| E3: Tools | 6 | 1 | 2 | 3 | 25% |
| E4: Evidence | 5 | 0 | 2 | 3 | 15% |
| E5: UI | 8 | 0 | 1 | 7 | 5% |
| E6: Auth | 2 | 0 | 1 | 1 | 20% |
| E7: Testing | 4 | 0 | 0 | 4 | 0% |
| **Total** | **32** | **1** | **7** | **24** | **15%** |

---

## Historial de Sesiones

<!-- El agente agrega entrada al inicio de cada sesión -->

### 2025-02-05
- **Setup inicial**: Creación de backlog, prompts y sistema de tracking
- **Archivos creados**: `docs/backlog.md`, `PROMPT.md`, `STATUS.md`
