# M3 (Demo E2E) - Análisis de Issues

**Fecha:** 2026-02-06
**Milestone:** M3: Demo E2E (4 issues abiertos)

## 📊 Estado de Implementación

### ❌ Sin Implementar - TODOS (4 issues)

#### 1. US-E7-01: Seed data para demo
**Issue:** #16
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P1 (Alta)
**Puntos:** 3

**Pendiente:**
- ❌ Crear script `scripts/seed-demo.ts`
- ❌ Crear usuario "Sofía" de ejemplo
- ❌ Crear caso "La tienda de Sofía"
- ❌ Pre-cargar diagnóstico completado
- ❌ Función de reset a estado inicial
- ❌ Configuración para usar emuladores de Firebase

**Propósito:** Tener datos consistentes para demos y testing.

**Bloqueado por:**
- M1 (Agent Core) - necesita crear casos
- M2 (UI) - necesita completar flujo

---

#### 2. US-E7-02: Script de demo automatizado
**Issue:** #17
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P1 (Alta)
**Puntos:** 3

**Pendiente:**
- ❌ Crear script `scripts/run-demo.sh`
- ❌ Instrucciones paso a paso
- ❌ Verificación de cada paso
- ❌ Timing: demo completa en < 3 minutos
- ❌ Repetibilidad: 3 veces sin errores

**Criterios de Aceptación:**
```bash
# Debe poder ejecutarse:
./scripts/run-demo.sh

# Y mostrar:
# [1/7] Seed data... ✓
# [2/7] Start server... ✓
# [3/7] Open browser... ✓
# [4/7] Login as Sofía... ✓
# [5/7] Show diagnostic... ✓
# [6/7] Show plan... ✓
# [7/7] Complete action... ✓
# Demo completed in 2m 45s
```

**Bloqueado por:** M1 + M2 completos

---

#### 3. US-E7-03: Tests unitarios de tools
**Issue:** #18
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P1 (Alta)
**Puntos:** 5

**Actual:**
- `package.json` tiene: `"test": "echo \"No tests configured yet\" && exit 0"`
- No hay framework de testing instalado
- No hay directorio `__tests__` o `tests/`
- No hay coverage configurado

**Pendiente:**
- ❌ Instalar framework de testing (Vitest recomendado)
- ❌ Configurar test runner
- ❌ Crear `src/tools/__tests__/computeUnitEconomics.test.ts`
- ❌ Crear tests para generatePlan
- ❌ Crear tests para createActions (con Firebase mock)
- ❌ Tests para createReceipt, publishVenture, recommendSuppliers
- ❌ Tests para verifyEvidence
- ❌ Coverage > 80% en carpeta `tools/`

**Ejemplos de tests necesarios:**
```typescript
// src/tools/__tests__/computeUnitEconomics.test.ts
describe('computeUnitEconomics', () => {
  it('should calculate margin correctly', async () => {
    const result = await computeUnitEconomics({
      estimatedCost: 10,
      proposedPrice: 20,
      monthlyVolume: 100
    }, mockContext);

    expect(result.success).toBe(true);
    expect(result.data.margin).toBe(0.5); // 50%
  });

  it('should reject negative values', async () => {
    const result = await computeUnitEconomics({
      estimatedCost: -10,
      proposedPrice: 20,
      monthlyVolume: 100
    }, mockContext);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe('INVALID_INPUT');
  });
});
```

**Bloqueado por:** Nada (puede implementarse ahora)

**Quick Win Potencial:** Este issue puede cerrarse independientemente de M1/M2.

---

#### 4. US-E7-04: Test E2E del happy path
**Issue:** #19
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P1 (Alta)
**Puntos:** 8

**Actual:**
- No hay framework E2E instalado (Playwright/Cypress)
- No hay directorio `e2e/`
- No hay CI configurado

**Pendiente:**
- ❌ Instalar Playwright o Cypress
- ❌ Configurar test runner E2E
- ❌ Crear `e2e/happy-path.spec.ts`
- ❌ Test del flujo completo:
  1. Login
  2. Diagnóstico (5Q)
  3. Ver plan generado
  4. Abrir acción
  5. Subir evidencia
  6. Ver recibo
- ❌ Screenshots en cada paso
- ❌ Configurar en CI (GitHub Actions)
- ❌ Ejecutar antes de merge a main

**Ejemplo de test E2E:**
```typescript
// e2e/happy-path.spec.ts
import { test, expect } from '@playwright/test';

test('happy path: Sofia completes first action', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'sofia@example.com');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/diagnostic');
  await page.screenshot({ path: 'e2e/screenshots/01-login.png' });

  // 2. Diagnostic
  await page.click('button:has-text("Empezar")');
  // ... responder 5 preguntas
  await expect(page).toHaveURL('/plan');
  await page.screenshot({ path: 'e2e/screenshots/02-diagnostic.png' });

  // 3. View plan
  await expect(page.locator('h1')).toContainText('Tu Plan de 7 Días');

  // ... continúa flujo completo
});
```

**Bloqueado por:** M1 + M2 completos

---

## 📈 Resumen General

### Estado de M3
| Métrica | Valor |
|---------|-------|
| Total issues | 4 |
| Completados | 0 (0%) |
| Parcialmente implementados | 0 (0%) |
| Sin implementar | 4 (100%) |
| Puntos totales | 19 |
| Puntos completados | 0 |
| Infraestructura lista | ❌ No |

**Estado general:** ❌ Sin comenzar (0% completo)

---

## 🎯 Dependencias y Bloqueadores

### Cadena de Dependencias

```
M1 (Agent Core) + M2 (UI) → M3 (Demo E2E)
                                ↓
                           #16 (Seed data)
                                ↓
                           #17 (Demo script)
                                ↓
                           #19 (E2E test)

Independiente:
                           #18 (Unit tests) ← Puede hacerse ya
```

**Bloqueadores:**
- **#16** - Necesita M1 + M2 funcionando
- **#17** - Necesita M1 + M2 funcionando + #16
- **#18** - ✅ NO tiene bloqueadores (puede implementarse ahora)
- **#19** - Necesita M1 + M2 funcionando

---

## 🚀 Plan de Acción Sugerido

### Fase 1: Tests Unitarios (AHORA)
**Issue #18 puede implementarse inmediatamente.**

**Pasos:**
1. Instalar Vitest
   ```bash
   pnpm add -D vitest @vitest/ui
   ```
2. Configurar `vitest.config.ts`
3. Crear tests para `computeUnitEconomics` (ya completo)
4. Crear tests para `createActions` (con Firebase mock)
5. Alcanzar >80% coverage en `tools/`
6. Actualizar `package.json`:
   ```json
   "test": "vitest",
   "test:ui": "vitest --ui",
   "test:coverage": "vitest --coverage"
   ```
7. **Cerrar issue #18** ✅

**Duración estimada:** 1 sprint
**Valor:** Alta - tests previenen regresiones

### Fase 2: Seed Data (Después de M1+M2)
**Issue #16**

1. Crear `scripts/seed-demo.ts`
2. Usar Firebase Admin para crear datos
3. Script debe funcionar con emuladores
4. Datos de Sofía predefinidos
5. **Cerrar issue #16** ✅

**Duración estimada:** 2-3 días

### Fase 3: Demo Script (Después de M1+M2)
**Issue #17**

1. Crear `scripts/run-demo.sh`
2. Secuencia automatizada
3. Verificaciones en cada paso
4. Timing < 3 minutos
5. **Cerrar issue #17** ✅

**Duración estimada:** 2-3 días

### Fase 4: E2E Tests (Después de M1+M2)
**Issue #19**

1. Instalar Playwright
2. Configurar E2E suite
3. Implementar happy path test
4. Screenshots automáticos
5. Configurar GitHub Actions
6. **Cerrar issue #19** ✅

**Duración estimada:** 1 sprint

---

## 💡 Recomendaciones

### Quick Win Inmediato: Issue #18

**Este issue puede cerrarse AHORA sin esperar M1/M2.**

**Beneficios:**
- ✅ Tests previenen bugs en tools ya implementados
- ✅ Da sensación de progreso en M3
- ✅ Establece cultura de testing
- ✅ Útil inmediatamente (2 tools ya completos)

**Propuesta:**
1. Implementar tests unitarios para:
   - `computeUnitEconomics` (ya completo)
   - `createActions` (ya completo)
   - Otros tools conforme se implementen
2. Cerrar #18 cuando coverage >80%

### Orden Recomendado
1. **Ahora:** #18 (Unit tests) ← Quick win
2. **Después de M1:** Continuar tests para tools de M1
3. **Después de M1+M2:** #16, #17, #19

### No Esperar a Demo para Testing
- Tests unitarios (#18) se benefician de implementación temprana
- Cada tool nuevo debe tener tests antes de merge
- E2E (#19) sí debe esperar a M1+M2

---

## 📊 Comparación de Milestones

| Milestone | Issues | Completos | Parciales | Sin implementar | Progreso |
|-----------|--------|-----------|-----------|-----------------|----------|
| M0 Foundation | - | ✅ 100% | - | - | ✅ Completo |
| M1 Agent Core | 18 | 2 (11%) | 9 (50%) | 7 (39%) | 🟡 En progreso |
| M2 UI & Evidence | 10 | 0 (0%) | 2 (20%) | 8 (80%) | ❌ Sin comenzar |
| **M3 Demo E2E** | **4** | **0 (0%)** | **0 (0%)** | **4 (100%)** | ❌ **Sin comenzar** |

**Observación:** M3 es el último milestone y depende completamente de M1+M2.

---

## 🎯 Estado Final de M3

### Issues Listos para Cerrar: **0**
### Issues que PUEDEN implementarse ahora: **1** (#18)

**Recomendación principal:**
1. ✅ **Implementar #18 (Unit tests) inmediatamente** - No tiene bloqueadores
2. ⏸️ Pausar #16, #17, #19 hasta que M1+M2 estén listos
3. 🎯 Enfocarse en completar M1 (Gemini Integration)

---

## 📝 Notas Importantes

### M3 es el Milestone Final
- Representa la "Definition of Done" del MVP
- Happy path debe funcionar end-to-end
- Demo debe ser reproducible
- Tests aseguran calidad

### Dependencia Total de M1+M2
Sin Agent Core funcionando y UI implementada:
- Seed data no tiene sentido (no hay flujo)
- Demo script no puede correr (no hay qué demostrar)
- E2E test falla (no hay happy path)

### Única Excepción: Tests Unitarios
Issue #18 es independiente y valioso por sí solo.

---

## 🚀 Acción Inmediata Recomendada

**Propuesta:**
1. Implementar issue #18 (Unit tests) ahora
2. Cerrar #18 cuando esté completo
3. Actualizar M3: 3/4 open, 1/4 closed (25% completo)
4. Continuar enfoque en M1 Agent Core

**Alternativa:**
- Dejar M3 completamente para el final
- Enfocarse 100% en M1 → M2 → M3 en orden

---

## 📄 Archivos a Crear (cuando corresponda)

### Para #18 (Unit Tests)
```
src/tools/__tests__/
├── computeUnitEconomics.test.ts  ← Ahora
├── createActions.test.ts          ← Ahora
├── generatePlan.test.ts           ← Después de M1
├── createReceipt.test.ts          ← Después de M1
├── publishVenture.test.ts         ← Después de M1
├── recommendSuppliers.test.ts     ← Después de M1
└── verifyEvidence.test.ts         ← Después de M1

vitest.config.ts                   ← Ahora
```

### Para #16 (Seed Data)
```
scripts/
├── seed-demo.ts                   ← Después de M1+M2
└── data/
    └── sofia-case.json
```

### Para #17 (Demo Script)
```
scripts/
└── run-demo.sh                    ← Después de M1+M2
```

### Para #19 (E2E Tests)
```
e2e/
├── happy-path.spec.ts             ← Después de M1+M2
└── screenshots/
    ├── 01-login.png
    ├── 02-diagnostic.png
    └── ...

playwright.config.ts               ← Después de M1+M2
```

---

**Siguiente paso:** ¿Implementamos #18 (Unit tests) ahora o continuamos enfocados en M1?
