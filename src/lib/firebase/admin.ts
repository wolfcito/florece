/**
 * Firebase Admin SDK initialization
 *
 * Use this ONLY in server-side code (API routes, Cloud Run).
 * NEVER import this in client components.
 */

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getServerEnv, isDevelopment } from '@/lib/env';

let adminApp: App;
let db: Firestore;
let storage: Storage;
let auth: Auth;

/**
 * Initialize Firebase Admin SDK
 * Safe to call multiple times (idempotent)
 */
export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    const projectId = getServerEnv('FIREBASE_PROJECT_ID');
    const credentialsJson = process.env.FIREBASE_ADMIN_CREDENTIALS;

    if (credentialsJson) {
      // Use credentials from environment variable (JSON string)
      const credentials = JSON.parse(credentialsJson);
      adminApp = initializeApp({
        credential: cert(credentials),
        projectId,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Use credentials from file path (typical in Cloud Run)
      adminApp = initializeApp({
        projectId,
      });
    } else if (isDevelopment()) {
      // Development mode: use emulators (no credentials needed)
      adminApp = initializeApp({
        projectId,
      });
    } else {
      throw new Error(
        'Missing Firebase Admin credentials. Set FIREBASE_ADMIN_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS'
      );
    }

    // Use default database
    db = getFirestore(adminApp);
    storage = getStorage(adminApp);
    auth = getAuth(adminApp);

    // Set Firestore settings
    db.settings({
      ignoreUndefinedProperties: true,
    });
  }

  return { adminApp, db, storage, auth };
}

/**
 * Get Firebase Admin instances
 * Call initializeFirebaseAdmin() first if not already initialized
 */
export function getFirebaseAdmin() {
  if (!adminApp) {
    return initializeFirebaseAdmin();
  }
  return { adminApp, db, storage, auth };
}

/**
 * Helper: Get authenticated user ID from Authorization header
 */
export async function verifyAuthToken(authHeader: string | null): Promise<string> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7);
  const { auth } = getFirebaseAdmin();
  const decodedToken = await auth.verifyIdToken(token);

  return decodedToken.uid;
}
