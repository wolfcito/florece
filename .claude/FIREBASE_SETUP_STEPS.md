# Firebase Setup - Paso a Paso

## Eliminar Blocker: Configurar Firebase

### Estado Actual
- ✅ GEMINI_API_KEY configurado
- ❌ FIREBASE_ADMIN_CREDENTIALS tiene placeholders
- ❌ NEXT_PUBLIC_FIREBASE_* tiene placeholders

---

## Opción A: Usar Firebase Existente

Si ya tienes un proyecto Firebase:

### 1. Obtener Service Account Key

```bash
# 1. Ve a Firebase Console
open https://console.firebase.google.com

# 2. Selecciona tu proyecto "florece" (o el que uses)

# 3. Ve a: Project Settings (⚙️) → Service Accounts

# 4. Click "Generate New Private Key"

# 5. Descarga el archivo JSON → guárdalo como:
#    ~/Downloads/florece-firebase-adminsdk.json
```

### 2. Actualizar .env.local

```bash
# Opción A: Usar archivo JSON (más limpio)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/florece-firebase-adminsdk.json
FIREBASE_PROJECT_ID=tu-project-id

# Opción B: Inline JSON (copiar contenido del archivo)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_ADMIN_CREDENTIALS='{"type":"service_account","project_id":"tu-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com",...}'
```

### 3. Obtener Config del Cliente (para NEXT_PUBLIC_*)

```bash
# En Firebase Console → Project Settings → General
# Busca "Your apps" → Web app → SDK setup

# Copia los valores:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Opción B: Crear Nuevo Proyecto Firebase

### 1. Crear Proyecto

```bash
# Opción 1: Vía Web
open https://console.firebase.google.com
# Click "Add Project" → Nombre: "florece" → Continuar

# Opción 2: Vía CLI
firebase projects:create florece --display-name "Florece MVP"
```

### 2. Habilitar Servicios

```bash
# En Firebase Console, habilita:
# - Authentication (Email/Password)
# - Firestore Database (modo test para desarrollo)
# - Storage (modo test para desarrollo)
```

### 3. Configurar Firestore

```bash
# En Firestore → Crear database
# - Modo: Test mode (reglas abiertas para desarrollo)
# - Región: us-central1 o southamerica-east1
```

### 4. Configurar Storage

```bash
# En Storage → Get Started
# - Modo: Test mode
# - Bucket: automático (florece.appspot.com)
```

### 5. Obtener Credenciales

Seguir pasos de "Opción A" arriba para obtener:
- Service Account Key (JSON)
- Firebase Config (NEXT_PUBLIC_*)

---

## Opción C: Usar Firebase Emulators (Local)

Para desarrollo local sin proyecto real:

### 1. Inicializar Firebase

```bash
cd /Users/wolfcito/development/BLCKCHN/GOOD_WOLF_LABS/akawolfcito/florece

# Si no está inicializado:
firebase init

# Seleccionar:
# - Firestore
# - Storage
# - Emulators
```

### 2. Configurar Emulators

Edita `firebase.json`:
```json
{
  "emulators": {
    "auth": {"port": 9099},
    "firestore": {"port": 8080},
    "storage": {"port": 9199},
    "ui": {"enabled": true, "port": 4000}
  }
}
```

### 3. Iniciar Emulators

```bash
firebase emulators:start
```

### 4. Actualizar .env.local

```bash
# Configuración para emulators
NEXT_PUBLIC_USE_EMULATORS=true
FIREBASE_PROJECT_ID=demo-florece
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-florece

# Las demás pueden ser dummy (emulators no las validan)
NEXT_PUBLIC_FIREBASE_API_KEY=demo-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-florece.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:demo

# Para Admin SDK con emulators, no necesitas credenciales reales
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"demo-florece"}
```

---

## Verificar Configuración

### 1. Test Firebase Admin

```bash
pnpm dev

# En otra terminal:
curl http://localhost:3002/api/test-agent \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Verifica logs → si no hay errores de Firebase, está bien configurado
```

### 2. Test Firestore Write

Crea `scripts/test-firebase.ts`:
```typescript
import { db } from './src/lib/firebase/admin.js'

async function test() {
  const ref = await db.collection('test').add({ timestamp: new Date() })
  console.log('✅ Firestore write successful:', ref.id)
}

test()
```

Ejecuta:
```bash
npx tsx scripts/test-firebase.ts
```

---

## Recomendación

**Para continuar AHORA:**
→ **Opción C (Emulators)** - Más rápido, sin necesidad de proyecto real

**Para producción/demo:**
→ **Opción A o B** - Proyecto Firebase real con credenciales

---

## Siguiente Paso Después de Configurar

Una vez Firebase esté configurado:

1. ✅ Verificar que `pnpm dev` inicia sin errores
2. ✅ Test de escritura en Firestore
3. ✅ Continuar con E3 Business Tools
4. ✅ Implementar E4 Evidence Pipeline (upload/verify)

---

## ¿Dudas?

- [Firebase Console](https://console.firebase.google.com)
- [Emulators Docs](https://firebase.google.com/docs/emulator-suite)
- [Service Account Setup](https://firebase.google.com/docs/admin/setup)
