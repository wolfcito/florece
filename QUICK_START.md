# 🚀 Quick Start: GitHub Project Setup en 5 Minutos

## Para Cualquier Proyecto (Nuevo o Existente)

### Opción 1: Usar el Prompt Template (Recomendado)

**1. Abre tu AI agent (Claude, ChatGPT, etc.)**

**2. Copia y pega este prompt:**

```
Configura un sistema completo de gestión de proyecto en GitHub para mi repositorio.

## 🔍 FASE 1: ANÁLISIS
Analiza mi proyecto en: [TU_REPO_URL]
- Busca documentación existente (backlog.md, roadmap, PRD, etc.)
- Si no existe, genera estructura básica desde código y README
- Identifica milestones, épicas y tareas

## ⚙️ FASE 2: IMPLEMENTACIÓN
Crea en GitHub:
1. Milestones (incluye retrospectivos para trabajo completado)
2. Labels (prioridad, épicas, story points, estado)
3. Issues (con criterios de aceptación y metadata)
4. Project Board (con vistas múltiples)
5. Scripts ejecutables para todo lo anterior

## 📦 FASE 3: ENTREGABLES
- Scripts en scripts/
- Documentación en docs/
- Instrucciones paso a paso

## 📊 INFORMACIÓN
Repositorio: [TU_REPO_URL]
Estado: [Nuevo/Desarrollo/Producción]
Backlog existente: [Sí/No]
Metodología: [Ágil/Kanban/Scrum]
Prioridad: [Speed/Completeness]
```

**3. Reemplaza solo 5 variables:**
- `[TU_REPO_URL]`: URL de tu repo
- `[Nuevo/Desarrollo/Producción]`: Estado actual
- `[Sí/No]`: ¿Tienes backlog?
- `[Ágil/Kanban/Scrum]`: Tu metodología
- `[Speed/Completeness]`: Tu prioridad

**4. Ejecuta los scripts que te genere**

**5. ¡Listo!** En 5 minutos tendrás:
- ✅ Milestones organizados
- ✅ Issues estructurados
- ✅ Project board visual
- ✅ Documentación completa

---

### Opción 2: Usar el Script Automatizado

**Para proyecto con backlog existente:**

```bash
./scripts/setup-github-project.sh --auto
```

**Para proyecto sin backlog:**

```bash
./scripts/setup-github-project.sh --generate-backlog --auto
```

**Modo interactivo (recomendado para primera vez):**

```bash
./scripts/setup-github-project.sh
```

---

## 📋 Ejemplos Reales

### Ejemplo 1: Proyecto Personal Nuevo

```
Repositorio: https://github.com/usuario/mi-app
Estado: Nuevo (solo README)
Backlog existente: No
Metodología: Kanban simple
Prioridad: Speed
```

**Resultado:** 3 milestones, 15-20 issues básicos, board listo en 3 minutos.

---

### Ejemplo 2: Proyecto de Equipo (como Florece)

```
Repositorio: https://github.com/wolfcito/florece
Estado: Desarrollo (MVP en progreso)
Backlog existente: Sí (docs/backlog.md completo)
Metodología: Ágil con milestones
Prioridad: Completeness
```

**Resultado:** 4 milestones, 37 issues, board con múltiples vistas, 5 minutos.

---

### Ejemplo 3: Proyecto Legacy

```
Repositorio: https://github.com/company/old-project
Estado: Producción (v3.2.1)
Backlog existente: No (solo issues viejos)
Metodología: Scrum con sprints
Prioridad: Documentation
```

**Resultado:** Estructura retroactiva desde commits/issues, board organizado, 10 minutos.

---

## 🎯 Checklist de Verificación

Después de ejecutar, verifica que tengas:

- [ ] **Milestones** en `https://github.com/OWNER/REPO/milestones`
  - Al menos 3 milestones
  - M0 cerrado si hay trabajo previo
  - Descripciones claras

- [ ] **Labels** organizadas
  - Prioridad: P0, P1, P2
  - Épicas: Epic:E1, Epic:E2, etc.
  - Story points: story-points:3, 5, 8
  - Estado: status:in-progress, completed

- [ ] **Issues** estructurados
  - Títulos claros
  - Descripción con criterios
  - Labels asignadas
  - Milestone asignado

- [ ] **Project Board** en `https://github.com/users/OWNER/projects/N`
  - Todos los issues agregados
  - Columnas organizadas (To Do, In Progress, Done)
  - Al menos 2 vistas (por estado y por milestone)

- [ ] **Documentación** generada
  - `docs/backlog.md` (si no existía)
  - `docs/project-board-setup.md`
  - `scripts/` con scripts ejecutables

---

## 🔧 Troubleshooting Rápido

### "gh CLI not authenticated"
```bash
gh auth login
```

### "Permission denied: project"
Crea el project board manualmente:
1. https://github.com/users/TU_USUARIO/projects/new
2. Ejecuta: `./scripts/add-issues-to-project.sh [NUMERO]`

### "No backlog found"
```bash
./scripts/setup-github-project.sh --generate-backlog
```

### "Too many issues to create"
Usa el prompt template - el AI generará scripts optimizados en lotes.

---

## 💡 Tips Pro

### 1. Adjunta screenshot de referencia
Si tienes una imagen de cómo quieres que se vea tu board, inclúyela en el prompt:
```
Similar a esta imagen: [adjuntar screenshot]
```

### 2. Personaliza los milestones
Edita la sección de milestones en el prompt:
```
Milestones específicos:
1. Alpha Release (2 semanas)
2. Beta Testing (1 mes)
3. Public Launch (fecha fija)
```

### 3. Usa templates específicos por tipo de proyecto
- **App Web**: Frontend, Backend, Deploy, Testing
- **Librería**: Core, Docs, Examples, Release
- **API**: Endpoints, Auth, Documentation, V2

### 4. Ejecuta en dry-run primero
```bash
./scripts/setup-github-project.sh --dry-run
```
Verifica qué se creará antes de ejecutar.

### 5. Guarda el prompt template
- Bookmarkea: `GITHUB_PROJECT_SETUP_PROMPT.md`
- O guarda en Notion/Obsidian
- Reutiliza en cada proyecto nuevo

---

## 📚 Recursos Adicionales

### Documentación Completa
- [`GITHUB_PROJECT_SETUP_PROMPT.md`](GITHUB_PROJECT_SETUP_PROMPT.md) - Template completo
- [`docs/project-board-setup.md`](docs/project-board-setup.md) - Guía detallada
- [`scripts/setup-github-project.sh`](scripts/setup-github-project.sh) - Script automatizado

### Scripts Útiles
- `scripts/setup-github-project.sh` - Setup completo
- `scripts/add-issues-to-project.sh` - Agregar issues a project
- `scripts/create-issues.sh` - Crear issues en lote

### Links Oficiales
- [GitHub Projects Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Manual](https://cli.github.com/manual/)

---

## 🎓 Aprende Más

### Para principiantes
1. Lee el template completo una vez
2. Usa el script con `--dry-run`
3. Crea tu primer board manualmente
4. Automatiza proyectos futuros

### Para equipos
1. Define metodología común (Kanban/Scrum)
2. Customiza labels según tu equipo
3. Crea templates de issues reutilizables
4. Configura automatizaciones de workflow

### Para proyectos grandes
1. Usa org-level projects
2. Múltiples repos en un project
3. Campos custom avanzados
4. Integración con CI/CD

---

## ⏱️ Comparación de Tiempo

| Método | Proyecto Nuevo | Proyecto con Docs | Proyecto Legacy |
|--------|----------------|-------------------|-----------------|
| **Manual** | 2-3 horas | 3-4 horas | 5-6 horas |
| **Script** | 15 minutos | 10 minutos | 30 minutos |
| **Prompt Template** | 5 minutos | 3 minutos | 10 minutos |

**Ahorro promedio: 95% del tiempo** ⚡

---

## 🚀 Siguiente Proyecto

La próxima vez que inicies un proyecto:

1. Crea el repo
2. Copia el prompt template
3. Ajusta 5 variables
4. Ejecuta scripts
5. **¡Empieza a codear!**

**Todo configurado en < 5 minutos.**

---

**¿Preguntas?** Revisa `GITHUB_PROJECT_SETUP_PROMPT.md` para detalles completos.

**¿Mejoras?** PRs bienvenidos - este template está diseñado para mejorar con cada uso.

---

**Última actualización:** 2026-02-06
**Proyecto de referencia:** [Florece](https://github.com/wolfcito/florece)
**Mantenido por:** Comunidad Open Source
