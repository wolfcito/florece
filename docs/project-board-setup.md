# Configuración del Project Board

Esta guía te ayudará a configurar el GitHub Project Board para visualizar el progreso de Florece.

## 🎯 Paso 1: Crear el proyecto

### Opción A: Desde el repositorio
1. Ve a https://github.com/wolfcito/florece
2. Click en **"Projects"** (pestaña superior)
3. Click en **"New project"** (botón verde)

### Opción B: Desde tu perfil
1. Ve a https://github.com/users/wolfcito/projects/new
2. Esto te llevará directamente a la creación

## ⚙️ Paso 2: Configurar el proyecto

1. **Nombre del proyecto**: `Florece Development Board`
2. **Template**: Selecciona **"Board"** (vista Kanban)
3. Click en **"Create project"**

## 📋 Paso 3: Personalizar columnas

El template "Board" viene con columnas básicas. Te recomiendo esta estructura:

### Columnas recomendadas:

| Columna | Descripción | Issues |
|---------|-------------|--------|
| 📝 **Backlog** | Issues que aún no están priorizados | P2, post-MVP |
| 📅 **To Do** | Listo para trabajar | P0, P1 pendientes |
| 🚧 **In Progress** | En desarrollo activo | Status: in-progress |
| 👀 **In Review** | Esperando review | PRs abiertos |
| ✅ **Done** | Completado | Status: completed |

### Cómo personalizar:

1. Click en **"⋮"** en cada columna para renombrar
2. Click en **"+ Add column"** para agregar nuevas
3. Arrastra y suelta para reordenar

## 🤖 Paso 4: Agregar issues automáticamente

Una vez creado el proyecto, agrega todos los issues automáticamente:

### 1. Obtén el número del proyecto

Mira la URL de tu proyecto:
```
https://github.com/users/wolfcito/projects/5
                                           ^
                                    Este es el número
```

### 2. Ejecuta el script

```bash
# Desde la raíz del proyecto
./scripts/add-issues-to-project.sh 5
```

Reemplaza `5` con el número real de tu proyecto.

### 3. Verifica

El script agregará los 37 issues al proyecto automáticamente.

## 🎨 Paso 5: Configurar vistas personalizadas

GitHub Projects permite múltiples vistas. Te recomiendo crear estas vistas:

### Vista 1: Board (principal)
- **Agrupar por**: Status
- **Ordenar por**: Priority (P0 → P1 → P2)

### Vista 2: Por Milestone
1. Click en **"⋮"** → **"New view"** → **"Board"**
2. Nombre: `Por Milestone`
3. **Agrupar por**: Milestone
4. Verás columnas: M0, M1, M2, M3

### Vista 3: Por Épica
1. Click en **"⋮"** → **"New view"** → **"Board"**
2. Nombre: `Por Épica`
3. **Agrupar por**: Labels
4. **Filtrar**: `label:Epic:*`

### Vista 4: Timeline (Roadmap)
1. Click en **"⋮"** → **"New view"** → **"Roadmap"**
2. Nombre: `Timeline`
3. Esta vista muestra los milestones en el tiempo

## 📊 Paso 6: Configurar campos personalizados

Agrega campos útiles para tracking:

1. Click en **"⋮"** → **"Settings"**
2. Scroll a **"Custom fields"**
3. Agrega estos campos:

| Campo | Tipo | Valores |
|-------|------|---------|
| `Story Points` | Number | 1-8 |
| `Epic` | Select | E1, E2, E3, E4, E5, E6, E7 |
| `Priority` | Select | P0-Crítica, P1-Alta, P2-Media |
| `Status` | Select | Pending, In Progress, Completed, Blocked |

## 🔄 Paso 7: Automatizaciones

GitHub Projects tiene automatizaciones integradas:

1. Click en **"⋮"** → **"Workflows"**
2. Activa estas automatizaciones:

### Auto-add to project
- Cuando se crea un issue → Agregar a "To Do"

### Item closed
- Cuando se cierra un issue → Mover a "Done"

### Pull request merged
- Cuando se mergea un PR → Mover a "Done"

### Item reopened
- Cuando se reabre un issue → Mover a "To Do"

## 🎯 Resultado final

Tu Project Board debería verse así:

```
┌─────────────┬──────────────┬─────────────┬──────────┐
│   To Do     │ In Progress  │  In Review  │   Done   │
├─────────────┼──────────────┼─────────────┼──────────┤
│ US-E1-01    │ US-E2-03     │             │ US-E3-01 │
│ US-E1-02    │ US-E3-02     │             │ M0-01    │
│ US-E1-03    │ US-E4-01     │             │ M0-02    │
│ ...         │ ...          │             │ ...      │
└─────────────┴──────────────┴─────────────┴──────────┘
```

## 📱 Tips adicionales

### Usar el board en mobile
- Descarga la app **GitHub Mobile**
- Los proyectos se sincronizan automáticamente
- Puedes mover issues desde tu teléfono

### Notificaciones
- Configura notificaciones para cambios en el proyecto
- Settings → Notifications → Projects

### Compartir
- El proyecto es público si el repo es público
- Puedes compartir el link directo

## 🔗 Links útiles

- **Tu proyecto**: https://github.com/users/wolfcito/projects/[NUMERO]
- **Milestones**: https://github.com/wolfcito/florece/milestones
- **Issues**: https://github.com/wolfcito/florece/issues
- **GitHub Projects Docs**: https://docs.github.com/en/issues/planning-and-tracking-with-projects

## 🐛 Troubleshooting

### Los issues no se agregan automáticamente
```bash
# Verifica que tienes permisos
gh auth status

# Intenta agregar un issue manualmente
gh project item-add [NUMERO] --owner wolfcito --url https://github.com/wolfcito/florece/issues/1
```

### No veo el proyecto en el repo
1. Ve a Settings del proyecto
2. En "Manage access" → "Link a repository"
3. Selecciona `wolfcito/florece`

## ✨ ¿Necesitas ayuda?

Si tienes problemas, revisa:
1. Permisos de autenticación de gh CLI
2. Visibilidad del proyecto (debe ser público o accessible)
3. Los issues existen en el repositorio

---

**Última actualización**: 2026-02-06
