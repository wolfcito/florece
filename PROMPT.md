# Prompt para Desarrolladores - Florece

Este archivo contiene prompts listos para usar con tu agente de IA (Claude, Cursor, Copilot, etc.).

---

## Prompt de Inicio de Sesión

Copia y pega este prompt al iniciar tu sesión de desarrollo:

```
Soy desarrollador trabajando en el proyecto Florece, un acelerador de micro-emprendimientos con IA para Latinoamérica.

Por favor:
1. Lee los archivos `docs/AGENTS.md` y `docs/backlog.md` para entender el contexto
2. Muéstrame las tareas disponibles (status ⬜ Pendiente) ordenadas por prioridad
3. Recomiéndame cuál debería tomar considerando las dependencias
4. Una vez que elija una tarea, ayúdame a implementarla siguiendo los criterios de aceptación

Mi nombre/identificador es: [TU_NOMBRE]
```

---

## Prompt para Ver Tareas Disponibles

```
Lee `docs/backlog.md` y muéstrame:
1. Tareas P0 (Críticas) que están pendientes (⬜)
2. Cuáles NO tienen dependencias bloqueantes
3. Recomienda cuál debería tomar primero y por qué
```

---

## Prompt para Tomar una Tarea

```
Voy a trabajar en la tarea [US-ID] del backlog.

Por favor:
1. Lee los detalles de la tarea en `docs/backlog.md`
2. Identifica el archivo principal a modificar
3. Lee ese archivo y cualquier dependencia relacionada
4. Dame un plan de implementación paso a paso
5. Empieza con el primer paso cuando yo confirme
```

---

## Prompt para Actualizar Estado de Tarea

```
Completé la tarea [US-ID].

Por favor:
1. Actualiza el estado en `docs/backlog.md` de ⬜ a ✅
2. Verifica si hay tareas que ahora están desbloqueadas
3. Haz commit con mensaje descriptivo
4. Muéstrame la siguiente tarea recomendada
```

---

## Prompt para Revisar Progreso del Sprint

```
Lee `docs/backlog.md` y dame un resumen de:
1. Tareas completadas (✅) vs pendientes (⬜) por épica
2. Porcentaje de avance del sprint actual
3. Tareas bloqueadas y qué las desbloquea
4. Riesgos o cuellos de botella
```

---

## Prompts por Rol

### Backend Developer

```
Soy backend developer en Florece. Lee `docs/backlog.md` y muéstrame:
1. Tareas de las épicas E1 (Gemini), E2 (Agent), E3 (Tools), E4 (Evidence)
2. Filtra solo las que están pendientes
3. Ordena por dependencias (primero las que desbloquean otras)
4. Recomiéndame por dónde empezar
```

### Frontend Developer

```
Soy frontend developer en Florece. Lee `docs/backlog.md` y muéstrame:
1. Tareas de las épicas E5 (UI) y E6 (Auth)
2. Filtra solo las que están pendientes
3. Cuáles puedo empezar sin esperar al backend
4. Dame el orden recomendado de implementación
```

### Full Stack Developer

```
Soy fullstack developer en Florece. Lee `docs/backlog.md` y:
1. Muéstrame el estado actual de todas las épicas
2. Identifica la ruta crítica (tareas que bloquean más cosas)
3. Recomiéndame las 3 tareas más importantes que puedo hacer hoy
4. Considera tanto backend como frontend
```

---

## Prompt para Debugging

```
Tengo un error en [ARCHIVO/FUNCIONALIDAD].

El error es: [DESCRIPCIÓN DEL ERROR]

Por favor:
1. Lee los archivos relevantes del proyecto
2. Consulta `docs/AGENTS.md` para entender las restricciones
3. Identifica la causa probable
4. Propón una solución que siga los principios del proyecto
```

---

## Prompt para Code Review

```
Revisa mi implementación de [US-ID]:

[PEGA TU CÓDIGO O INDICA LOS ARCHIVOS]

Verifica contra:
1. Criterios de aceptación en `docs/backlog.md`
2. Restricciones en `docs/AGENTS.md`
3. Patrones existentes en el código
4. Seguridad (no secrets en cliente, auth en APIs)
```

---

## Prompt para Finalizar el Día

```
Terminé mi sesión de desarrollo. Por favor:
1. Resume qué tareas completé hoy
2. Actualiza `docs/backlog.md` con los nuevos estados
3. Haz commit de los cambios en el backlog
4. Lista las tareas recomendadas para mañana
```

---

## Reglas para el Agente

Cuando trabajes con el backlog, sigue estas reglas:

1. **Prioridad P0 primero** - Nunca trabajes en P1/P2 si hay P0 pendientes
2. **Respetar dependencias** - No implementes algo si sus dependencias no están ✅
3. **Actualizar estados** - Siempre actualiza el backlog al completar tareas
4. **Commits granulares** - Un commit por tarea o subtarea lógica
5. **Seguir AGENTS.md** - Las restricciones ahí son obligatorias

---

## Leyenda de Estados

| Estado | Significado |
|--------|-------------|
| ⬜ | Pendiente - Disponible para tomar |
| 🚧 | En progreso - Alguien está trabajando |
| ✅ | Completado - Implementado y funcionando |

---

## Ejemplo de Sesión Completa

```
Developer: Soy Dev1, empiezo mi día de trabajo en Florece.
           Lee docs/backlog.md y recomiéndame una tarea.

Agent: [Lee backlog, analiza dependencias]
       Recomiendo US-E1-01 (Enviar mensajes a Gemini) porque:
       - Es P0 (crítica)
       - No tiene dependencias
       - Desbloquea 5 otras tareas

Developer: Perfecto, voy con esa. Dame el plan de implementación.

Agent: [Lee el archivo src/agent/gemini/client.ts]
       Plan:
       1. Implementar función sendMessage()
       2. Agregar manejo de errores con retry
       3. Implementar logging
       4. Probar con mensaje simple

       ¿Empezamos con el paso 1?

Developer: Sí, adelante.

Agent: [Implementa el código]

Developer: Listo, funciona. Actualiza el backlog y haz commit.

Agent: [Actualiza backlog.md: US-E1-01 de ⬜ a ✅]
       [Commit: "feat(agent): implement Gemini sendMessage"]

       Siguiente recomendación: US-E1-02 (sendFunctionResults)
       ya que ahora está desbloqueada.
```

---

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `docs/backlog.md` | Lista de tareas con estados y dependencias |
| `docs/AGENTS.md` | Restricciones y contexto para agentes |
| `docs/scope.md` | Qué está en scope y qué no |
| `docs/architecture.md` | Diseño del sistema |
| `docs/api.md` | Contratos de API |
| `docs/tools.md` | Especificación de tools |

---

## Soporte

Si el agente no entiende el contexto:
1. Asegúrate de que lea `docs/AGENTS.md` primero
2. Proporciona el ID específico de la tarea (ej: US-E1-01)
3. Indica el archivo exacto que quieres modificar
