/**
 * Test Firebase Admin SDK connection
 * Run: npx tsx scripts/test-firebase.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { getFirebaseAdmin } from '../src/lib/firebase/admin.js';

async function testFirebase() {
  console.log('🔥 Testing Firebase Admin SDK...\n');

  try {
    // Initialize Firebase Admin
    const { db, storage, auth } = getFirebaseAdmin();
    console.log('✅ Firebase Admin initialized');

    // Test 1: Firestore write
    console.log('\n📝 Testing Firestore write...');
    const testRef = await db.collection('_test').add({
      message: 'Firebase Admin SDK test',
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Firestore write successful: ${testRef.id}`);

    // Test 2: Firestore read
    console.log('\n📖 Testing Firestore read...');
    const doc = await testRef.get();
    const data = doc.data();
    console.log('✅ Firestore read successful:', data);

    // Test 3: Clean up
    console.log('\n🧹 Cleaning up test data...');
    await testRef.delete();
    console.log('✅ Test document deleted');

    // Test 4: Storage bucket info
    console.log('\n📦 Testing Storage access...');
    const bucket = storage.bucket();
    console.log(`✅ Storage bucket: ${bucket.name}`);

    console.log('\n✅ All Firebase tests passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Firebase test failed:', error);
    process.exit(1);
  }
}

testFirebase();
