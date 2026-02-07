# M2 (UI & Evidence) - Análisis de Issues

**Fecha:** 2026-02-06
**Milestone:** M2: UI & Evidence (10 issues abiertos)

## 📊 Estado de Implementación

### ✅ Infraestructura Completa (No son issues)

**Firebase Setup:**
- ✅ `src/lib/firebase/client.ts` - Cliente Firebase completamente configurado
- ✅ `src/lib/firebase/admin.ts` - Admin Firebase completamente configurado
- ✅ `src/lib/firebase/emulators.ts` - Configuración de emuladores
- ✅ Soporte para Auth, Storage, Firestore
- ✅ Emuladores para desarrollo local

**Next.js Base:**
- ✅ App Router configurado
- ✅ Layout básico con Tailwind CSS
- ✅ TypeScript configurado
- ✅ Metadata básica

**Estado:** La infraestructura está lista, falta toda la UI.

---

### 🟡 Parcialmente Implementados (1 issue)

#### 1. US-E5-08: Navegación y layout
**Issue:** #13
**Archivos:** `src/app/layout.tsx`
**Estado:** 🟡 **30% COMPLETO**

**Implementado:**
- ✅ Layout base con Next.js App Router
- ✅ Fonts (Geist Sans, Geist Mono)
- ✅ Metadata básica
- ✅ CSS global configurado

**Pendiente:**
- ❌ Navegación móvil
- ❌ Header/Footer
- ❌ Menú principal
- ❌ Breadcrumbs
- ❌ Estados activos de navegación

**Nota:** Solo existe el layout boilerplate de Next.js, no hay navegación real.

---

### 🟡 Infraestructura Lista, UI Faltante (1 issue)

#### 2. US-E6-01: Login con Firebase Auth
**Issue:** #14
**Archivos:** `src/lib/firebase/client.ts`, `src/lib/firebase/admin.ts`
**Estado:** 🟡 **50% COMPLETO**

**Implementado:**
- ✅ Firebase Client SDK configurado
- ✅ Firebase Admin SDK configurado
- ✅ Auth instance disponible
- ✅ Soporte para emuladores
- ✅ Token verification en admin.ts

**Pendiente:**
- ❌ UI de login (formulario, botones)
- ❌ Sign in con email/password
- ❌ Sign in con Google (opcional)
- ❌ Manejo de estados (loading, error, success)
- ❌ Redirect después de login
- ❌ Persistencia de sesión

**Bloqueador:** Necesita componente UI (#6 Landing page o página /login)

---

### ❌ Sin Implementar - UI Components (7 issues)

#### 3. US-E5-01: Landing page
**Issue:** #6
**Archivos:** `src/app/page.tsx`
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P0 (Bloqueador para todo M2)

**Actual:**
- Solo tiene el boilerplate de Next.js ("To get started, edit page.tsx")
- No hay branding de Florece
- No hay call-to-action
- No hay flujo hacia diagnóstico

**Pendiente:**
- ❌ Hero section con propuesta de valor
- ❌ Explicación del proceso de 7 días
- ❌ CTA para empezar diagnóstico
- ❌ Mobile-first design
- ❌ Audio-first UX (si aplica en landing)

**Bloquea:** Todo el flujo de usuario

#### 4. US-E5-02: Flujo de diagnóstico (5Q)
**Issue:** #7
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P0

**Pendiente:**
- ❌ Componente de pregunta con audio
- ❌ 5 preguntas del diagnóstico
- ❌ Grabación de respuestas de voz
- ❌ Progreso (1/5, 2/5, etc.)
- ❌ Validación de respuestas
- ❌ Envío a agente para generar plan

**Archivos sugeridos:**
- `src/app/diagnostic/page.tsx`
- `src/components/DiagnosticQuestion.tsx`
- `src/components/AudioRecorder.tsx`

#### 5. US-E5-03: Grabador de voz
**Issue:** #8
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**
**Prioridad:** P0 (Crítico para audio-first)

**Pendiente:**
- ❌ Componente grabador reutilizable
- ❌ Botón grabar/pausar/detener
- ❌ Visualización de onda de audio
- ❌ Timer de grabación
- ❌ Preview antes de enviar
- ❌ Envío a Firebase Storage
- ❌ Permisos de micrófono

**Archivos sugeridos:**
- `src/components/VoiceRecorder.tsx`
- `src/hooks/useAudioRecorder.ts`

#### 6. US-E5-04: Vista del plan
**Issue:** #9
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**

**Pendiente:**
- ❌ Mostrar plan de 7 días generado
- ❌ Vista de días con acciones
- ❌ Progreso del plan
- ❌ Navegación entre días
- ❌ Mobile-friendly

**Archivos sugeridos:**
- `src/app/plan/[planId]/page.tsx`
- `src/components/PlanView.tsx`
- `src/components/DayCard.tsx`

#### 7. US-E5-05: Detalle de acción
**Issue:** #10
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**

**Pendiente:**
- ❌ Vista de acción individual
- ❌ Título, descripción, tiempo estimado
- ❌ Botón para subir evidencia
- ❌ Estado (pendiente/en progreso/completo)
- ❌ Audio instrucciones (si aplica)

**Archivos sugeridos:**
- `src/app/action/[actionId]/page.tsx`
- `src/components/ActionDetail.tsx`

#### 8. US-E5-06: Componente de upload de evidencia
**Issue:** #11
**Archivos:** Ninguno (no existe), API parcial en `src/app/api/upload-evidence/route.ts`
**Estado:** ❌ **SIN IMPLEMENTAR**

**Implementado (API):**
- 🟡 API route `/api/upload-evidence` parcialmente implementado
- ✅ Validación de inputs
- ✅ Verificación de auth
- ✅ Creación de documento en Firestore
- ❌ TODO: Signed URL generation (2 TODOs en route.ts)

**Pendiente (UI):**
- ❌ Componente de upload (drag & drop)
- ❌ Soporte para imagen/audio/documento
- ❌ Preview de archivo
- ❌ Barra de progreso
- ❌ Integración con API route
- ❌ Manejo de errores

**Archivos sugeridos:**
- `src/components/EvidenceUpload.tsx`
- `src/hooks/useFileUpload.ts`

#### 9. US-E5-07: Vista de recibo
**Issue:** #12
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**

**Pendiente:**
- ❌ Mostrar recibo de completación
- ❌ Resumen de logros
- ❌ Estadísticas del journey
- ❌ Botón para compartir
- ❌ Descargar como PDF (opcional)

**Archivos sugeridos:**
- `src/app/receipt/[receiptId]/page.tsx`
- `src/components/Receipt.tsx`

#### 10. US-E6-02: Proteger rutas privadas
**Issue:** #15
**Archivos:** Ninguno (no existe)
**Estado:** ❌ **SIN IMPLEMENTAR**

**Pendiente:**
- ❌ Middleware de autenticación
- ❌ Redirect a /login si no autenticado
- ❌ Protected route wrapper
- ❌ Server-side auth check
- ❌ Client-side auth state

**Archivos sugeridos:**
- `src/middleware.ts` (Next.js middleware)
- `src/components/ProtectedRoute.tsx`
- `src/hooks/useAuth.ts`

**Bloqueado por:** #14 (Login UI)

---

## 📈 Resumen por Épica

### E5: User Interface (8 stories)
| Issue | Story | Estado | Progreso |
|-------|-------|--------|----------|
| #6 | US-E5-01: Landing page | ❌ Sin implementar | 0% |
| #7 | US-E5-02: Diagnóstico 5Q | ❌ Sin implementar | 0% |
| #8 | US-E5-03: Grabador voz | ❌ Sin implementar | 0% |
| #9 | US-E5-04: Vista plan | ❌ Sin implementar | 0% |
| #10 | US-E5-05: Detalle acción | ❌ Sin implementar | 0% |
| #11 | US-E5-06: Upload evidencia | ❌ UI 0%, API 70% | 35% |
| #12 | US-E5-07: Vista recibo | ❌ Sin implementar | 0% |
| #13 | US-E5-08: Navegación | 🟡 Layout básico | 30% |

**Estado:** 0/8 completo (0%)
**Progreso promedio:** ~8%

### E6: Authentication (2 stories)
| Issue | Story | Estado | Progreso |
|-------|-------|--------|----------|
| #14 | US-E6-01: Login Firebase | 🟡 SDK listo, UI falta | 50% |
| #15 | US-E6-02: Proteger rutas | ❌ Sin implementar | 0% |

**Estado:** 0/2 completo (0%)
**Progreso promedio:** 25%

---

## 🎯 Dependencias y Bloqueadores

### Cadena Crítica de M2:

```
#6 (Landing) → #7 (Diagnóstico) → Agent Core (M1) → #9 (Plan)
                                                    ↓
                                               #10 (Acción)
                                                    ↓
                                               #11 (Upload)
                                                    ↓
                                               #12 (Recibo)
```

**Bloqueadores:**
1. **#6 (Landing)** bloquea el inicio del flujo
2. **M1 (Agent Core)** bloquea la generación del plan
3. **#14 (Login UI)** bloquea #15 (Proteger rutas)
4. **#8 (Grabador)** es componente compartido para #7 y #11

---

## 📊 Métricas M2

| Métrica | Valor |
|---------|-------|
| Total issues | 10 |
| Completados | 0 (0%) |
| Parcialmente implementados | 2 (20%) |
| Sin implementar | 8 (80%) |
| Infraestructura lista | ✅ Firebase + Next.js |
| Componentes UI | 0/8 |
| Listos para cerrar | 0 |

**Estado general:** ❌ Sin comenzar (0% completo)

**Observación:** Toda la infraestructura (Firebase, Next.js, API routes) está lista, pero falta el 100% de los componentes de UI.

---

## 🚀 Plan de Acción Sugerido

### Fase 1: Fundación UI (Crítico)
1. **#6** - Implementar Landing page
   - Hero section
   - CTA "Empezar diagnóstico"
   - Mobile-first design
2. **#8** - Implementar Grabador de voz
   - Componente reutilizable
   - Permisos de micrófono
   - Integración con Storage

**Duración estimada:** 1-2 sprints

### Fase 2: Flujo de Diagnóstico
1. **#7** - Implementar Diagnóstico 5Q
   - 5 preguntas con audio
   - Usar componente grabador (#8)
   - Envío a agent core
2. **#14** - Implementar Login UI
   - Formulario de login
   - Integración con Firebase Auth
   - Manejo de estados

**Duración estimada:** 1 sprint
**Bloqueado por:** M1 Agent Core para procesar diagnóstico

### Fase 3: Plan y Acciones
1. **#9** - Implementar Vista del plan
2. **#10** - Implementar Detalle de acción
3. **#11** - Implementar Upload de evidencia (UI)
   - Completar TODOs en API route
   - Componente de upload
4. **#13** - Mejorar Navegación y layout

**Duración estimada:** 1-2 sprints

### Fase 4: Cierre y Seguridad
1. **#12** - Implementar Vista de recibo
2. **#15** - Implementar Protección de rutas
3. Testing E2E del flujo completo

**Duración estimada:** 1 sprint

---

## 💡 Recomendaciones

### 1. Prioridad Inmediata
**Antes de comenzar M2 UI:**
- ✅ Completar M1 Agent Core (especialmente E1: Gemini Integration)
- ✅ Sin agent funcionando, el flujo de M2 no tiene propósito

**Orden sugerido:**
1. M1 E1 → M1 E2 → M1 E3 (completar)
2. M2 E5 (UI básica: Landing, Diagnóstico, Grabador)
3. M2 E6 (Auth)
4. M2 E5 (resto de UI)

### 2. Quick Wins Posibles
**No hay issues para cerrar inmediatamente en M2.**

Pero podríamos:
- Considerar cerrar #13 si el layout básico es suficiente (probablemente no)
- Documentar que la infraestructura está 100% lista

### 3. Desbloquear M2
**Para empezar a trabajar en M2:**
1. Definir diseño visual (Figma, wireframes)
2. Decidir audio-first approach (¿todo con voz o híbrido?)
3. Implementar design system básico
4. Crear componentes reutilizables primero (#8 Grabador)

---

## 📝 Notas Importantes

### Dependencia de M1
M2 **no puede completarse** sin M1 Agent Core porque:
- Diagnóstico (#7) necesita enviar respuestas al agente
- Vista del plan (#9) necesita plan generado por agente
- Detalle de acción (#10) viene del plan generado
- Recibo (#12) es generado por agent tools

**Conclusión:** M1 es bloqueador absoluto de M2.

### Audio-First Challenge
El concepto "audio-first" está presente en:
- #7 (Diagnóstico con respuestas de voz)
- #8 (Grabador de voz)
- #11 (Evidencia puede ser audio)

**Decisión pendiente:** ¿Qué tanto es audio vs. texto?

### Mobile-First
Todo M2 debe ser mobile-first porque:
- Target audience: emprendedores en Latam
- Uso en movimiento
- Accesibilidad

---

## 🎯 Estado Final

| Aspecto | Estado |
|---------|--------|
| Infraestructura | ✅ 100% |
| Backend (API routes) | 🟡 70% |
| Frontend (UI) | ❌ 0% |
| Auth setup | 🟡 50% |
| Listos para cerrar | 0 issues |

**Siguiente paso:** Esperar a que M1 avance significativamente antes de invertir en M2 UI.

**Alternativa:** Implementar UI de Landing (#6) y Diagnóstico (#7) con datos mock para validar UX, pero sin integración real hasta que M1 esté listo.
