# Firebase Setup Instructions

Este documento describe los pasos necesarios para configurar Firebase para Florece.

## Estado Actual

✅ Base de datos creada: `florecer-app-db`
✅ Reglas de Firestore: En test mode (allow all)
✅ Código actualizado para usar `florecer-app-db`
⚠️ Email/Password auth: **No habilitado**
⚠️ Usuario demo: **No creado**

## Pasos Requeridos

### 1. Habilitar Email/Password Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona el proyecto: `florecer-app-86f31`
3. Ve a **Authentication** → **Sign-in method**
4. Click en **Email/Password**
5. **Enable** el toggle
6. Click **Save**

### 2. Crear Usuario Demo Manualmente

Ya que el script automático está teniendo problemas, crea el usuario manualmente:

1. En Firebase Console → **Authentication** → **Users**
2. Click **Add user**
3. Ingresa:
   - **Email**: `demo@florece.app`
   - **Password**: `demo123456`
4. Click **Add user**
5. **Copia el User UID** (lo necesitarás para el seed data)

### 3. Seed Data Manual (Alternativa)

Si el script `pnpm seed-demo` no funciona, puedes crear los datos manualmente en Firestore:

#### Opción A: Usar Firebase Console

1. Ve a **Firestore Database** → **florecer-app-db**
2. Crea las siguientes colecciones y documentos:

**Collection: `cases`**
- Document ID: `case_sofia_tienda`
- Fields:
  ```
  userId: [USER_UID_FROM_STEP_2]
  productDescription: "Tamales de pollo caseros estilo Oaxaca"
  targetMarket: "Oficinas en zona centro de la ciudad"
  availableHoursPerDay: 4
  initialBudget: 2000
  createdAt: [timestamp]
  status: "active"
  ```

**Collection: `plans`**
- Document ID: `plan_sofia_week1`
- Fields:
  ```
  caseId: "case_sofia_tienda"
  userId: [USER_UID_FROM_STEP_2]
  horizon: "7days"
  goals: ["Validar demanda...", "Crear receta...", ...]
  totalEstimatedHours: 28
  createdAt: [timestamp]
  ```

**Collection: `actions`**
- Create 5 documents (action_1, action_2, action_3, action_4, action_5)
- See `scripts/seed-demo.ts` for exact structure

#### Opción B: Verificar Permisos de Admin SDK

El script está usando Firebase Admin SDK. Verifica que:

1. El archivo de credenciales existe:
   ```
   config/florecer-app-86f31-firebase-adminsdk-fbsvc-881bd2c7a1.json
   ```

2. La variable de entorno está correcta en `.env.local`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/Users/wolfcito/.../florece/config/florecer-app-86f31-firebase-adminsdk-fbsvc-881bd2c7a1.json
   ```

3. Las reglas de Firestore permiten escritura desde Admin SDK (deberían, pero verifica)

### 4. Verificar Configuración

Después de completar los pasos, verifica:

```bash
# 1. Servidor corriendo
pnpm dev

# 2. Navega a http://localhost:3000/login

# 3. Login con:
# Email: demo@florece.app
# Password: demo123456

# 4. Deberías ver redirect a /diagnostic
```

## Solución Rápida para Demo

Si necesitas hacer el demo YA y no tienes tiempo para el seed:

1. ✅ Habilita Email/Password auth (paso 1)
2. ✅ Crea usuario demo (paso 2)
3. ✅ Abre la app: http://localhost:3000
4. ✅ Signup/Login con el usuario demo
5. ✅ Usa la app normalmente - el usuario creará su propio caso/plan

La app funciona perfectamente sin seed data, solo que no tendrás
datos pre-cargados para el demo.

## Estado del Proyecto

**MVP Funcional**: ✅ SÍ

Todas las features funcionan:
- Landing page ✅
- Login/Signup ✅
- Auth middleware ✅
- Diagnostic flow ✅
- Voice recorder ✅
- Plan generation ✅
- Action tracking ✅
- Evidence upload ✅
- Receipt view ✅

**Pendiente para seed automático**:
- Configuración de Firebase Auth ⚠️
- Permisos de Admin SDK para escritura ⚠️

## Contacto

Si sigues teniendo problemas, revisa:
- Las reglas de Firestore en Firebase Console
- Los logs del servidor (`pnpm dev`)
- El archivo `.env.local`

---

Wolfcito 🐾 @akawolfcito
