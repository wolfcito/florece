/**
 * POST /api/receipts
 *
 * Generate a completion receipt for a plan.
 * Summarizes completed actions and creates a certificate.
 *
 * Request Body:
 * {
 *   caseId: string;            // Case ID
 *   planId: string;            // Plan ID
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   receiptId: string;         // Created receipt document ID
 *   completedActions: number;  // Number of verified actions
 *   totalActions: number;      // Total actions in plan
 *   completionRate: number;    // 0-1 completion percentage
 *   certificateUrl?: string;   // Optional certificate image/PDF
 *   message: string;           // Congratulatory message
 *   error?: string;
 * }
 *
 * GET /api/receipts?caseId=xxx
 *
 * Retrieve all receipts for a case.
 *
 * Query Params:
 * - caseId: string (required)
 *
 * Response:
 * {
 *   success: boolean;
 *   receipts: Array<Receipt>;
 *   error?: string;
 * }
 *
 * Auth: Requires Firebase Auth token in Authorization header
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getFirebaseAdmin } from '@/lib/firebase/admin';
import { createReceipt } from '@/tools/createReceipt';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const userId = await verifyAuthToken(authHeader);

    // Parse request body
    const body = await request.json();
    const { caseId, planId } = body;

    if (!caseId || !planId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: caseId, planId' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();

    // Get all verified actions for this plan
    const actionsSnapshot = await db
      .collection('actions')
      .where('planId', '==', planId)
      .where('status', '==', 'verified')
      .get();

    const completedActionIds = actionsSnapshot.docs.map((doc: any) => doc.id);

    // Create receipt
    const result = await createReceipt(
      {
        caseId,
        userId,
        planId,
        completedActionIds,
      },
      { userId, caseId }
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ...result.data,
    });
  } catch (error) {
    console.error('Error in POST /api/receipts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const userId = await verifyAuthToken(authHeader);

    // Parse query params
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');

    if (!caseId) {
      return NextResponse.json(
        { success: false, error: 'Missing required query param: caseId' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();

    // Fetch receipts for this case
    const receiptsSnapshot = await db
      .collection('receipts')
      .where('caseId', '==', caseId)
      .where('userId', '==', userId)
      .orderBy('generatedAt', 'desc')
      .get();

    const receipts = receiptsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      receipts,
    });
  } catch (error) {
    console.error('Error in GET /api/receipts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
