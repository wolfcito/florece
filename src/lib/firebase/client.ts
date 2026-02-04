/**
 * Firebase Client SDK initialization
 *
 * Use this ONLY in client components.
 * For server-side operations, use admin.ts instead.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFirebaseClientConfig, useEmulators } from '@/lib/env';

let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;

/**
 * Initialize Firebase client SDK
 * Safe to call multiple times (idempotent)
 */
export function initializeFirebase() {
  if (getApps().length === 0) {
    const config = getFirebaseClientConfig();
    app = initializeApp(config);
    auth = getAuth(app);
    storage = getStorage(app);

    // Connect to emulators if enabled
    if (useEmulators()) {
      const { connectAuthEmulator } = require('firebase/auth');
      const { connectStorageEmulator } = require('firebase/storage');

      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  }

  return { app, auth, storage };
}

/**
 * Get Firebase client instances
 * Call initializeFirebase() first if not already initialized
 */
export function getFirebaseClient() {
  if (!app) {
    return initializeFirebase();
  }
  return { app, auth, storage };
}
