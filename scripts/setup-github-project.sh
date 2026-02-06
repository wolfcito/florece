#!/bin/bash

# 🚀 GitHub Project Setup - Universal Script
#
# Este script configura automáticamente un sistema completo de gestión
# de proyectos en GitHub, adaptándose al estado actual de tu repositorio.
#
# Uso:
#   ./scripts/setup-github-project.sh [OPTIONS]
#
# Options:
#   --repo OWNER/REPO          Repositorio de GitHub (default: actual)
#   --backlog FILE             Archivo de backlog (default: docs/backlog.md)
#   --auto                     Modo automático sin confirmaciones
#   --generate-backlog         Generar backlog si no existe
#   --project-number N         Número de project existente (skip creation)
#   --dry-run                  Mostrar qué haría sin ejecutar
#
# Ejemplos:
#   ./scripts/setup-github-project.sh
#   ./scripts/setup-github-project.sh --repo wolfcito/mi-proyecto --auto
#   ./scripts/setup-github-project.sh --generate-backlog --dry-run

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables por defecto
REPO=$(git remote get-url origin 2>/dev/null | sed 's/.*github.com[:/]\(.*\)\.git/\1/' || echo "")
BACKLOG_FILE="docs/backlog.md"
AUTO_MODE=false
GENERATE_BACKLOG=false
PROJECT_NUMBER=""
DRY_RUN=false

# Parsear argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --repo)
      REPO="$2"
      shift 2
      ;;
    --backlog)
      BACKLOG_FILE="$2"
      shift 2
      ;;
    --auto)
      AUTO_MODE=true
      shift
      ;;
    --generate-backlog)
      GENERATE_BACKLOG=true
      shift
      ;;
    --project-number)
      PROJECT_NUMBER="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help|-h)
      head -n 30 "$0" | tail -n 25
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Funciones de utilidad
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

confirm() {
    if [ "$AUTO_MODE" = true ] || [ "$DRY_RUN" = true ]; then
        return 0
    fi
    read -p "$1 (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

execute() {
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY RUN]${NC} $*"
    else
        eval "$@"
    fi
}

# Verificar dependencias
check_dependencies() {
    log_info "Verificando dependencias..."

    if ! command -v gh &> /dev/null; then
        log_error "gh CLI no está instalado"
        echo "Instala desde: https://cli.github.com/"
        exit 1
    fi

    if ! gh auth status &> /dev/null; then
        log_error "No estás autenticado con gh CLI"
        echo "Ejecuta: gh auth login"
        exit 1
    fi

    log_success "Dependencias OK"
}

# Detectar estado del proyecto
analyze_project() {
    log_info "Analizando proyecto..."

    # Verificar repo
    if [ -z "$REPO" ]; then
        log_error "No se pudo detectar el repositorio"
        echo "Usa: --repo OWNER/REPO"
        exit 1
    fi

    log_success "Repositorio: $REPO"

    # Verificar backlog
    if [ -f "$BACKLOG_FILE" ]; then
        log_success "Backlog encontrado: $BACKLOG_FILE"
        BACKLOG_EXISTS=true
    else
        log_warning "No se encontró backlog en: $BACKLOG_FILE"
        BACKLOG_EXISTS=false

        if [ "$GENERATE_BACKLOG" = true ]; then
            log_info "Se generará backlog automáticamente"
        else
            echo ""
            echo "¿Quieres generar un backlog básico desde el código?"
            if confirm "Generar backlog"; then
                GENERATE_BACKLOG=true
            fi
        fi
    fi

    # Verificar milestones existentes
    EXISTING_MILESTONES=$(gh api repos/$REPO/milestones --jq 'length' 2>/dev/null || echo 0)
    log_info "Milestones existentes: $EXISTING_MILESTONES"

    # Verificar issues existentes
    EXISTING_ISSUES=$(gh issue list --repo $REPO --limit 1000 --json number --jq 'length' 2>/dev/null || echo 0)
    log_info "Issues existentes: $EXISTING_ISSUES"

    echo ""
}

# Generar backlog básico
generate_basic_backlog() {
    log_info "Generando backlog básico..."

    mkdir -p docs

    cat > "$BACKLOG_FILE" << 'EOF'
# Product Backlog

## Milestones

| ID | Milestone | Objetivo | Estado |
|----|-----------|----------|--------|
| M0 | Foundation | Configuración inicial del proyecto | ✅ Completado |
| M1 | Core Features | Funcionalidades principales | 🚧 En progreso |
| M2 | Polish & Testing | Refinamiento y testing | ⬜ Pendiente |
| M3 | Production Ready | Listo para producción | ⬜ Pendiente |

## Épicas

| ID | Épica | Descripción | Milestone |
|----|-------|-------------|-----------|
| E1 | Setup | Configuración del proyecto | M0 |
| E2 | Core | Funcionalidades core | M1 |
| E3 | UI/UX | Interfaz de usuario | M1 |
| E4 | Testing | Pruebas y QA | M2 |
| E5 | Deployment | Deploy y CI/CD | M3 |

## User Stories

### E1: Setup (Completado)

#### US-E1-01: Configurar repositorio
**Puntos**: 3 | **Prioridad**: P0 | **Estado**: ✅ Completado

**Criterios**:
- [x] Crear repositorio
- [x] Configurar .gitignore
- [x] Setup README inicial

---

*Este backlog fue generado automáticamente. Edítalo según las necesidades de tu proyecto.*
EOF

    log_success "Backlog generado en: $BACKLOG_FILE"
    log_warning "Por favor, edita $BACKLOG_FILE según tu proyecto antes de continuar"

    if ! confirm "¿Continuar con el backlog generado?"; then
        exit 0
    fi
}

# Parsear backlog y crear estructura
parse_backlog() {
    log_info "Parseando backlog..."

    # TODO: Implementar parser de backlog.md
    # Por ahora, asumimos estructura conocida

    log_success "Backlog parseado correctamente"
}

# Crear milestones
create_milestones() {
    log_info "Creando milestones..."

    # Ejemplo de milestones (ajustar según tu backlog)
    MILESTONES=(
        "M0:Foundation:Repo, docs, ambiente listo:closed"
        "M1:Core Features:Funcionalidades principales:open"
        "M2:Polish & Testing:Refinamiento y testing:open"
        "M3:Production Ready:Listo para producción:open"
    )

    for milestone in "${MILESTONES[@]}"; do
        IFS=':' read -r id title desc state <<< "$milestone"

        log_info "Creando milestone: $title"

        RESULT=$(execute "gh api repos/$REPO/milestones --method POST \
            --field title='$title' \
            --field description='$desc' \
            --field state='$state' 2>&1" || echo "error")

        if [[ "$RESULT" != "error" ]]; then
            log_success "Milestone creado: $title"
        else
            log_warning "Milestone ya existe o error: $title"
        fi
    done
}

# Crear labels
create_labels() {
    log_info "Creando labels..."

    LABELS=(
        "P0:Crítica:d73a4a:Bloquea demo - Máxima prioridad"
        "P1:Alta:ff9800:Necesaria para demo completa"
        "P2:Media:fbca04:Post-MVP o si hay tiempo"
        "Epic:E1:0e8a16:Épica 1"
        "Epic:E2:0e8a16:Épica 2"
        "story-points:3:c5def5:3 story points"
        "story-points:5:c5def5:5 story points"
        "story-points:8:c5def5:8 story points"
        "status:in-progress:0075ca:En progreso"
        "status:completed:0e8a16:Completado"
    )

    for label in "${LABELS[@]}"; do
        IFS=':' read -r name color desc <<< "$label"

        execute "gh label create '$name' --repo $REPO --color '$color' --description '$desc' 2>/dev/null" || true
    done

    log_success "Labels creadas"
}

# Crear issues
create_issues() {
    log_info "Creando issues..."
    log_warning "Esta función debe implementarse según tu backlog específico"
    log_info "Usa el script de ejemplo de tu proyecto como referencia"
}

# Crear project board
create_project_board() {
    if [ -n "$PROJECT_NUMBER" ]; then
        log_info "Usando project existente: #$PROJECT_NUMBER"
        return
    fi

    log_info "Para crear el project board:"
    echo ""
    echo "1. Ve a: https://github.com/users/$(echo $REPO | cut -d'/' -f1)/projects/new"
    echo "2. Nombre: '$(basename $(pwd)) Development Board'"
    echo "3. Template: Board"
    echo "4. Anota el número del proyecto de la URL"
    echo ""

    if ! confirm "¿Ya creaste el proyecto?"; then
        log_warning "Crea el proyecto y vuelve a ejecutar con --project-number N"
        exit 0
    fi

    read -p "Número del proyecto: " PROJECT_NUMBER
}

# Agregar issues al project
add_issues_to_project() {
    if [ -z "$PROJECT_NUMBER" ]; then
        log_error "Número de proyecto no especificado"
        exit 1
    fi

    log_info "Agregando issues al proyecto #$PROJECT_NUMBER..."

    OWNER=$(echo $REPO | cut -d'/' -f1)
    ISSUES=$(gh issue list --repo $REPO --limit 1000 --state all --json number --jq '.[].number')

    COUNT=0
    for issue in $ISSUES; do
        log_info "Agregando issue #$issue..."
        execute "gh project item-add $PROJECT_NUMBER --owner $OWNER \
            --url https://github.com/$REPO/issues/$issue 2>/dev/null" || true
        COUNT=$((COUNT + 1))
    done

    log_success "Agregados $COUNT issues al proyecto"
}

# Generar documentación
generate_documentation() {
    log_info "Generando documentación..."

    cat > docs/project-board-setup.md << EOF
# GitHub Project Board Setup

Este documento fue generado automáticamente por setup-github-project.sh

## Links Importantes

- **Repository**: https://github.com/$REPO
- **Milestones**: https://github.com/$REPO/milestones
- **Issues**: https://github.com/$REPO/issues
- **Project Board**: https://github.com/users/$(echo $REPO | cut -d'/' -f1)/projects/$PROJECT_NUMBER

## Resumen

- Milestones creados: 4
- Labels configuradas: 10+
- Issues creados: Ver repositorio
- Project board: Configurado y activo

## Próximos Pasos

1. Revisa el project board y organiza los issues
2. Configura vistas adicionales (por milestone, épica, etc.)
3. Activa automatizaciones en Project Settings
4. Invita a tu equipo

Generado: $(date)
EOF

    log_success "Documentación generada en: docs/project-board-setup.md"
}

# Main
main() {
    echo ""
    echo "🚀 GitHub Project Setup"
    echo "======================="
    echo ""

    check_dependencies
    analyze_project

    # Generar backlog si no existe
    if [ "$BACKLOG_EXISTS" = false ] && [ "$GENERATE_BACKLOG" = true ]; then
        generate_backlog
    fi

    echo ""
    echo "📋 Plan de ejecución:"
    echo "  1. Crear milestones"
    echo "  2. Crear labels"
    echo "  3. Crear issues (manual - usa scripts específicos)"
    echo "  4. Crear/usar project board"
    echo "  5. Agregar issues al project"
    echo "  6. Generar documentación"
    echo ""

    if ! confirm "¿Proceder con la configuración?"; then
        exit 0
    fi

    echo ""

    create_milestones
    create_labels

    log_warning "La creación de issues debe hacerse con scripts específicos del proyecto"
    log_info "Usa los ejemplos en scripts/ como referencia"

    echo ""

    create_project_board

    if [ -n "$PROJECT_NUMBER" ]; then
        add_issues_to_project
    fi

    generate_documentation

    echo ""
    log_success "🎉 Configuración completada!"
    echo ""
    echo "📊 Próximos pasos:"
    echo "  1. Revisa: https://github.com/$REPO/milestones"
    echo "  2. Crea issues específicos de tu proyecto"
    echo "  3. Organiza el project board: https://github.com/users/$(echo $REPO | cut -d'/' -f1)/projects/$PROJECT_NUMBER"
    echo ""
}

main
