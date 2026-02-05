# Prompt para Desarrolladores - Florece

## Prompt Universal (Copia esto al iniciar)

```text
Soy desarrollador en el proyecto Florece. Mi nombre es: [TU_NOMBRE]

INSTRUCCIONES PARA TI (AGENTE):

1. Lee STATUS.md para entender el estado actual del proyecto
2. Lee docs/AGENTS.md para las restricciones técnicas
3. Verifica si tengo tareas "En Progreso" pendientes de completar
4. Muéstrame un resumen del estado y recomiéndame qué hacer

Si tengo tareas incompletas, recuérdame actualizarlas antes de tomar nuevas.
```

---

## Instrucciones para el Agente

> **AGENTE**: Sigue este flujo SIEMPRE que un desarrollador inicie sesión.

### Paso 1: Diagnóstico Inicial

Lee estos archivos en orden:
1. `STATUS.md` - Estado actual del proyecto
2. `docs/backlog.md` - Lista completa de tareas

### Paso 2: Verificar Tareas del Desarrollador

Busca en STATUS.md si el desarrollador tiene tareas "En Progreso".

**Si tiene tareas en progreso**, responde:

```text
Hola [NOMBRE]! Veo que tienes pendiente:

📋 [TAREA_ID] - [DESCRIPCIÓN]
   Archivo: [ARCHIVO]
   Iniciada: [FECHA]

¿Qué te gustaría hacer?
1. Continuar con esta tarea
2. Marcarla como completada (actualizo STATUS.md y backlog.md)
3. Pausarla y tomar otra (la dejo en progreso)
```

**Si NO tiene tareas en progreso**, salta al Paso 3.

### Paso 3: Mostrar Estado y Recomendar

```text
📊 Estado del Proyecto Florece
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Milestone: [MILESTONE_ACTIVO]
Progreso: [PROGRESO]%
Sprint: [SPRINT_ACTIVO]

🎯 Siguiente paso recomendado:
[TAREA_ID] - [TÍTULO]
Archivo: [ARCHIVO]
Razón: [POR_QUÉ_ESTA_TAREA]

📋 Alternativas disponibles:
1. [TAREA_ALT_1]
2. [TAREA_ALT_2]
3. [TAREA_ALT_3]

¿Cuál te gustaría tomar?
```

### Paso 4: Cuando el Dev Elige una Tarea

1. Actualiza STATUS.md:
   - Agrega la tarea a "Tareas en Progreso"
   - Incluye nombre del dev y fecha

2. Muestra el plan de implementación:
   - Lee el archivo principal
   - Lista los criterios de aceptación
   - Propón pasos concretos

3. Pregunta: "¿Empezamos con el paso 1?"

### Paso 5: Cuando el Dev Completa una Tarea

1. Actualiza `docs/backlog.md`:
   - Cambia estado de ⬜ a ✅

2. Actualiza `STATUS.md`:
   - Mueve de "En Progreso" a "Completadas Recientemente"
   - Actualiza métricas por épica
   - Actualiza progreso general
   - Recalcula "Siguiente Paso Recomendado"

3. Haz commit:
   ```bash
   git add docs/backlog.md STATUS.md [ARCHIVOS_CÓDIGO]
   git commit -m "feat([ÁREA]): [DESCRIPCIÓN]

   Completes US-[ID]

   Wolfcito 🐾 @akawolfcito"
   ```

4. Muestra:
   ```text
   ✅ Tarea completada: [TAREA_ID]

   🔓 Tareas desbloqueadas:
   - [LISTA_DE_TAREAS_QUE_YA_PUEDEN_HACERSE]

   🎯 Siguiente recomendación:
   [NUEVA_TAREA_RECOMENDADA]

   ¿Continuamos con la siguiente o terminamos por hoy?
   ```

---

## Recordatorios Automáticos

El agente debe recordar al desarrollador en estos casos:

### Si hay tareas en progreso por más de 1 día:

```text
⚠️ Recordatorio: Tienes [TAREA] en progreso desde [FECHA].
¿Necesitas ayuda para completarla o la marcamos como bloqueada?
```

### Si el dev quiere tomar una tarea bloqueada:

```text
⚠️ Esta tarea está bloqueada por:
- [TAREA_BLOQUEANTE_1] (estado: [ESTADO])
- [TAREA_BLOQUEANTE_2] (estado: [ESTADO])

¿Prefieres trabajar en una de las bloqueantes primero?
```

### Al final de cada sesión:

```text
📝 Resumen de tu sesión:
- Tareas completadas: [N]
- Commits realizados: [N]
- Próxima recomendación: [TAREA]

¿Actualizamos STATUS.md con el historial de esta sesión?
```

---

## Cálculo de Siguiente Paso Recomendado

El agente debe recalcular la recomendación usando esta lógica:

```text
PRIORIDAD DE SELECCIÓN:

1. Tareas P0 sin dependencias bloqueantes
2. Tareas P0 cuyas dependencias ya están ✅
3. Tareas P1 sin dependencias
4. Tareas que desbloquean más tareas (mayor impacto)

CRITERIOS DE DESEMPATE:
- Menor cantidad de puntos (más rápida)
- Más tareas desbloquea
- Orden en el backlog
```

---

## Formato de Actualización de STATUS.md

Cuando actualices STATUS.md, sigue este formato:

### Para agregar tarea en progreso:

```markdown
| US-E1-01 | @nombre | 2025-02-05 | src/agent/gemini/client.ts |
```

### Para mover a completadas:

```markdown
| US-E1-01 | @nombre | 2025-02-05 | abc123 |
```

### Para actualizar métricas:

Recalcula contando en `docs/backlog.md`:
- ✅ = completadas
- 🚧 = en progreso
- ⬜ = pendientes

---

## Archivos del Sistema

| Archivo | Propósito | Cuándo Leer | Cuándo Actualizar |
|---------|-----------|-------------|-------------------|
| `STATUS.md` | Estado actual | Al iniciar sesión | Al completar tareas |
| `docs/backlog.md` | Todas las tareas | Para ver detalles | Al completar tareas |
| `docs/AGENTS.md` | Restricciones | Antes de implementar | Nunca (solo lectura) |

---

## Ejemplo de Sesión Completa

```text
DEV: Soy Dev1, inicio sesión en Florece.

AGENTE: [Lee STATUS.md y backlog.md]

         Hola Dev1! 👋

         📊 Estado del Proyecto
         ━━━━━━━━━━━━━━━━━━━━━
         Milestone: M1 - Agent Core
         Progreso: 15%

         No tienes tareas en progreso.

         🎯 Recomendación:
         US-E1-01 - Enviar mensajes a Gemini
         Archivo: src/agent/gemini/client.ts
         Puntos: 5 | Prioridad: P0
         Desbloquea: 5 tareas

         📋 Alternativas:
         1. US-E5-01 - Landing page (UI)
         2. US-E5-03 - Grabador de voz
         3. US-E6-01 - Login Firebase

         ¿Cuál tomas?

DEV: Voy con la recomendada, US-E1-01.

AGENTE: [Actualiza STATUS.md - agrega a "En Progreso"]

         Perfecto! Tomaste US-E1-01.

         📋 Criterios de Aceptación:
         - [ ] Implementar sendMessage(prompt, history)
         - [ ] Manejar respuestas de texto y function calls
         - [ ] Implementar retry con exponential backoff
         - [ ] Logs de cada llamada

         Plan de implementación:
         1. Leer archivo actual y entender estructura
         2. Implementar llamada básica a Gemini API
         3. Agregar manejo de function calls
         4. Agregar retry logic
         5. Agregar logging

         ¿Empezamos con el paso 1?

DEV: Sí, adelante.

AGENTE: [Lee src/agent/gemini/client.ts]
         [Implementa el código]
         [...]

DEV: Funciona, completemos la tarea.

AGENTE: [Actualiza docs/backlog.md - US-E1-01 de ⬜ a ✅]
         [Actualiza STATUS.md - mueve a "Completadas"]
         [Actualiza métricas]
         [Hace commit]

         ✅ Completado: US-E1-01

         📊 Nuevo estado:
         - E1: Gemini: 33% (1/3)
         - Progreso general: 18%

         🔓 Tareas desbloqueadas:
         - US-E1-02 (sendFunctionResults)
         - US-E3-02 (generatePlan)
         - US-E4-03 (verifyEvidence Vision)

         🎯 Siguiente recomendación:
         US-E1-02 - Enviar resultados de funciones
         (Continúa la cadena de Gemini integration)

         ¿Seguimos o terminamos por hoy?

DEV: Terminamos por hoy.

AGENTE: 📝 Resumen de sesión:
         - Completaste: US-E1-01
         - Commits: 1
         - Desbloqueaste: 3 tareas

         Hasta mañana! 👋
```

---

## Quick Reference

### Iniciar sesión
```text
Soy [NOMBRE] en Florece. Lee STATUS.md y recomiéndame qué hacer.
```

### Tomar tarea
```text
Tomo la tarea [US-ID]. Dame el plan de implementación.
```

### Completar tarea
```text
Completé [US-ID]. Actualiza backlog, STATUS y haz commit.
```

### Ver estado
```text
Muéstrame el estado actual del proyecto.
```

### Buscar tarea específica
```text
Dame detalles de la tarea [US-ID].
```
