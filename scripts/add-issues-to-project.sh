#!/bin/bash

# Script para agregar todos los issues al GitHub Project
#
# Uso:
#   1. Crea tu proyecto en GitHub
#   2. Obtén el número del proyecto desde la URL (ej: si la URL es
#      https://github.com/users/wolfcito/projects/5 el número es 5)
#   3. Ejecuta: ./scripts/add-issues-to-project.sh [NUMERO_PROYECTO]
#
# Ejemplo: ./scripts/add-issues-to-project.sh 5

if [ -z "$1" ]; then
  echo "❌ Error: Debes proporcionar el número del proyecto"
  echo ""
  echo "Uso: $0 [NUMERO_PROYECTO]"
  echo ""
  echo "Para obtener el número del proyecto:"
  echo "1. Ve a tu proyecto en GitHub"
  echo "2. Mira la URL: https://github.com/users/wolfcito/projects/X"
  echo "3. El número es X"
  exit 1
fi

PROJECT_NUMBER=$1
REPO="wolfcito/florece"

echo "🚀 Agregando issues al proyecto #$PROJECT_NUMBER..."
echo ""

# Obtener todos los issues del repositorio
ISSUES=$(gh issue list --repo $REPO --limit 100 --json number --jq '.[].number')

COUNT=0
for issue in $ISSUES; do
  echo "📌 Agregando issue #$issue..."
  gh issue edit $issue --repo $REPO --add-project "wolfcito/$PROJECT_NUMBER" 2>/dev/null || \
  gh project item-add $PROJECT_NUMBER --owner wolfcito --url "https://github.com/$REPO/issues/$issue" 2>/dev/null
  COUNT=$((COUNT + 1))
done

echo ""
echo "✅ Agregados $COUNT issues al proyecto"
echo ""
echo "🎯 Ver proyecto: https://github.com/users/wolfcito/projects/$PROJECT_NUMBER"
