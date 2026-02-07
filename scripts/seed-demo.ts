#!/usr/bin/env tsx
/**
 * Seed Demo Data
 *
 * Creates consistent demo data for reproducible demos:
 * - User: Sofía (demo@florece.app)
 * - Case: La tienda de Sofía
 * - Plan: 7-day plan with actions
 * - Some actions marked as completed
 *
 * Usage:
 *   pnpm seed-demo
 *   pnpm seed-demo --reset (clears all data first)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { initializeFirebaseAdmin } from '../src/lib/firebase/admin';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseClient } from '../src/lib/firebase/client';

const DEMO_USER = {
  email: 'demo@florece.app',
  password: 'demo123456',
  displayName: 'Sofía',
};

const DEMO_CASE = {
  id: 'case_sofia_tienda',
  userId: '', // Will be filled with actual user ID
  productDescription: 'Tamales de pollo caseros estilo Oaxaca',
  targetMarket: 'Oficinas en zona centro de la ciudad',
  availableHoursPerDay: 4,
  initialBudget: 2000,
  createdAt: new Date(),
  status: 'active',
};

const DEMO_PLAN = {
  id: 'plan_sofia_week1',
  caseId: 'case_sofia_tienda',
  userId: '',
  horizon: '7days',
  goals: [
    'Validar demanda hablando con 10 oficinas potenciales',
    'Crear receta estandarizada y calcular costos',
    'Hacer primeras 3 ventas de prueba',
    'Obtener feedback y ajustar producto',
  ],
  totalEstimatedHours: 28,
  createdAt: new Date(),
};

const DEMO_ACTIONS = [
  {
    id: 'action_1',
    planId: 'plan_sofia_week1',
    caseId: 'case_sofia_tienda',
    userId: '',
    day: 1,
    title: 'Identificar 20 oficinas objetivo',
    description:
      'Hacer lista de oficinas cercanas con al menos 15 empleados. Anotar nombre, dirección y horario de oficina.',
    estimatedHours: 2,
    priority: 'high',
    completed: true,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'action_2',
    planId: 'plan_sofia_week1',
    caseId: 'case_sofia_tienda',
    userId: '',
    day: 1,
    title: 'Llamar a 5 oficinas para validar interés',
    description:
      'Contactar a 5 oficinas de la lista. Preguntar: ¿Compran comida para sus empleados? ¿Qué días? ¿Cuántas personas?',
    estimatedHours: 2,
    priority: 'high',
    completed: true,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'action_3',
    planId: 'plan_sofia_week1',
    caseId: 'case_sofia_tienda',
    userId: '',
    day: 2,
    title: 'Estandarizar receta y calcular costos',
    description:
      'Documentar receta exacta con cantidades. Calcular costo de ingredientes por tamal. Definir precio de venta.',
    estimatedHours: 3,
    priority: 'high',
    completed: true,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 'action_4',
    planId: 'plan_sofia_week1',
    caseId: 'case_sofia_tienda',
    userId: '',
    day: 3,
    title: 'Preparar lote de prueba (20 tamales)',
    description:
      'Hacer primer lote siguiendo receta estandarizada. Medir tiempo de preparación. Tomar foto del resultado.',
    estimatedHours: 4,
    priority: 'high',
    completed: false,
  },
  {
    id: 'action_5',
    planId: 'plan_sofia_week1',
    caseId: 'case_sofia_tienda',
    userId: '',
    day: 3,
    title: 'Visitar 3 oficinas con muestras gratis',
    description:
      'Llevar 6 tamales a 3 oficinas diferentes. Pedir feedback honesto. Preguntar si comprarían y a qué precio.',
    estimatedHours: 2,
    priority: 'high',
    completed: false,
  },
];

async function createDemoUser() {
  console.log('📝 Creating demo user...');

  try {
    const { auth } = getFirebaseClient();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      DEMO_USER.email,
      DEMO_USER.password
    );

    console.log(`✅ User created: ${userCredential.user.uid}`);
    return userCredential.user.uid;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  User already exists, using mock user ID...');
      return 'demo_user_sofia';
    } else if (error.code === 'auth/operation-not-allowed') {
      console.log('⚠️  Email/Password auth not enabled in Firebase Console');
      console.log('   Please enable it at: Firebase Console → Authentication → Sign-in method');
      console.log('   Using mock user ID for now...');
      return 'demo_user_sofia';
    }
    throw error;
  }
}

async function seedData(reset: boolean = false) {
  console.log('🌱 Seeding demo data...\n');

  const { db } = initializeFirebaseAdmin();

  // Reset if requested
  if (reset) {
    console.log('🗑️  Resetting data...');
    const batch = db.batch();

    // Delete all demo collections
    const casesSnapshot = await db
      .collection('cases')
      .where('id', '==', DEMO_CASE.id)
      .get();
    casesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    const plansSnapshot = await db
      .collection('plans')
      .where('id', '==', DEMO_PLAN.id)
      .get();
    plansSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    const actionsSnapshot = await db
      .collection('actions')
      .where('planId', '==', DEMO_PLAN.id)
      .get();
    actionsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
    console.log('✅ Data reset complete\n');
  }

  // Create demo user
  const userId = await createDemoUser();

  // Update IDs with actual user ID
  DEMO_CASE.userId = userId;
  DEMO_PLAN.userId = userId;
  DEMO_ACTIONS.forEach((action) => {
    action.userId = userId;
  });

  console.log('\n📦 Creating case...');
  await db.collection('cases').doc(DEMO_CASE.id).set(DEMO_CASE);
  console.log(`✅ Case created: ${DEMO_CASE.id}`);

  console.log('\n📋 Creating plan...');
  await db.collection('plans').doc(DEMO_PLAN.id).set(DEMO_PLAN);
  console.log(`✅ Plan created: ${DEMO_PLAN.id}`);

  console.log('\n✏️  Creating actions...');
  const batch = db.batch();
  DEMO_ACTIONS.forEach((action) => {
    const actionRef = db.collection('actions').doc(action.id);
    batch.set(actionRef, action);
  });
  await batch.commit();
  console.log(`✅ ${DEMO_ACTIONS.length} actions created`);

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Demo data seeded successfully!\n');
  console.log('Demo User:');
  console.log(`  Email: ${DEMO_USER.email}`);
  console.log(`  Password: ${DEMO_USER.password}`);
  console.log(`  User ID: ${userId}\n`);
  console.log('Demo Case:');
  console.log(`  ID: ${DEMO_CASE.id}`);
  console.log(`  Product: ${DEMO_CASE.productDescription}\n`);
  console.log('Demo Plan:');
  console.log(`  ID: ${DEMO_PLAN.id}`);
  console.log(`  Days: 7`);
  console.log(`  Actions: ${DEMO_ACTIONS.length} (${DEMO_ACTIONS.filter((a) => a.completed).length} completed)\n`);
  console.log('Ready for demo! 🚀');
  console.log('='.repeat(50));
}

// Parse CLI arguments
const args = process.argv.slice(2);
const reset = args.includes('--reset');

// Run
seedData(reset)
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
