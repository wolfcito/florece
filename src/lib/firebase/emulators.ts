/**
 * Firebase Emulator configuration
 *
 * Helper utilities for connecting to Firebase emulators during development.
 */

import { getServerEnv, isDevelopment } from '@/lib/env';

export const EMULATOR_PORTS = {
  auth: 9099,
  firestore: 8080,
  storage: 9199,
  functions: 5001,
} as const;

/**
 * Check if emulators should be used
 * Only returns true in development mode with emulators enabled
 */
export function shouldUseEmulators(): boolean {
  if (!isDevelopment()) return false;

  const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';
  return useEmulators;
}

/**
 * Get Firestore emulator host string
 */
export function getFirestoreEmulatorHost(): string | undefined {
  if (!shouldUseEmulators()) return undefined;
  return `localhost:${EMULATOR_PORTS.firestore}`;
}

/**
 * Configure Firebase Admin to use emulators
 * Call this before initializing Firebase Admin in development
 */
export function configureAdminEmulators() {
  if (!shouldUseEmulators()) return;

  // Set environment variables for Firebase Admin to connect to emulators
  process.env.FIRESTORE_EMULATOR_HOST = getFirestoreEmulatorHost();
  process.env.FIREBASE_AUTH_EMULATOR_HOST = `localhost:${EMULATOR_PORTS.auth}`;
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = `localhost:${EMULATOR_PORTS.storage}`;

  console.log('[Emulators] Firebase Admin configured for local emulators');
}

/**
 * Get emulator connection details for client
 */
export function getClientEmulatorConfig() {
  return {
    auth: `http://localhost:${EMULATOR_PORTS.auth}`,
    firestore: `localhost:${EMULATOR_PORTS.firestore}`,
    storage: `localhost:${EMULATOR_PORTS.storage}`,
  };
}
