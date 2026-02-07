/**
 * Typed environment variable accessor
 *
 * Validates and provides type-safe access to environment variables.
 * Server-side only variables are NOT exported to the client.
 */

interface ServerEnv {
  // Firebase Admin (server-only)
  FIREBASE_PROJECT_ID: string;
  FIREBASE_ADMIN_CREDENTIALS?: string; // JSON string
  GOOGLE_APPLICATION_CREDENTIALS?: string; // Path to service account key

  // Gemini / Vertex AI (server-only)
  GEMINI_API_KEY?: string;
  VERTEX_PROJECT_ID?: string;
  VERTEX_LOCATION?: string;

  // Agent Service (server-only)
  AGENT_SERVICE_URL: string;
}

interface ClientEnv {
  // Firebase Client (public)
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;

  // Feature flags (public)
  NEXT_PUBLIC_USE_EMULATORS?: string; // "true" | "false"
}

/**
 * Get a server-side environment variable
 * Throws if the variable is not set and no default is provided
 */
export function getServerEnv<K extends keyof ServerEnv>(
  key: K,
  defaultValue?: ServerEnv[K]
): ServerEnv[K] {
  if (typeof window !== 'undefined') {
    throw new Error(`getServerEnv("${key}") called on client side`);
  }

  const value = process.env[key] as ServerEnv[K] | undefined;

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required server environment variable: ${key}`);
  }

  return value;
}

/**
 * Get a client-side environment variable
 * Throws if the variable is not set and no default is provided
 */
export function getClientEnv<K extends keyof ClientEnv>(
  key: K,
  defaultValue?: ClientEnv[K]
): ClientEnv[K] {
  const value = process.env[key] as ClientEnv[K] | undefined;

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required client environment variable: ${key}`);
  }

  return value;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if Firebase emulators should be used
 */
export function useEmulators(): boolean {
  return process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';
}

/**
 * Get all Firebase client config as an object
 *
 * Uses static process.env references so Next.js/Turbopack can inline
 * the values at compile time. Dynamic access (process.env[key]) does NOT
 * work for NEXT_PUBLIC_* variables on the client side.
 */
export function getFirebaseClientConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error(
      'Missing Firebase client environment variables. ' +
      'Ensure NEXT_PUBLIC_FIREBASE_* vars are set in .env.local'
    );
  }

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}
