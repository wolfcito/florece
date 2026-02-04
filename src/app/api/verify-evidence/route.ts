/**
 * POST /api/verify-evidence
 *
 * Verify uploaded evidence using Gemini Vision/Audio.
 * Updates evidence document with verification result.
 *
 * Request Body:
 * {
 *   evidenceId: string;        // Evidence document ID
 *   actionId: string;          // Associated action ID
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   verified: boolean;         // Whether evidence is accepted
 *   confidence: number;        // 0-1 confidence score
 *   reasoning: string;         // Explanation of decision
 *   suggestions?: string[];    // Improvement suggestions if rejected
 *   error?: string;
 * }
 *
 * Auth: Requires Firebase Auth token in Authorization header
 *
 * Flow:
 * 1. Verify auth and fetch evidence + action documents
 * 2. Call verifyEvidence tool with file URL and action description
 * 3. Update evidence document with verification result
 * 4. If verified, update action status to 'verified'
 * 5. Return verification result to client
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getFirebaseAdmin } from '@/lib/firebase/admin';
import { verifyEvidence } from '@/tools/verifyEvidence';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const userId = await verifyAuthToken(authHeader);

    // Parse request body
    const body = await request.json();
    const { evidenceId, actionId } = body;

    if (!evidenceId || !actionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: evidenceId, actionId' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();

    // Fetch evidence document
    const evidenceDoc = await db.collection('evidence').doc(evidenceId).get();
    if (!evidenceDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Evidence not found' },
        { status: 404 }
      );
    }

    const evidenceData = evidenceDoc.data()!;

    // Verify ownership
    if (evidenceData.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Fetch action document
    const actionDoc = await db.collection('actions').doc(actionId).get();
    if (!actionDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Action not found' },
        { status: 404 }
      );
    }

    const actionData = actionDoc.data()!;

    // Run verification tool
    const result = await verifyEvidence(
      {
        actionId,
        evidenceId,
        fileUrl: evidenceData.fileUrl,
        fileType: evidenceData.fileType,
        actionDescription: actionData.description,
      },
      { userId, caseId: evidenceData.caseId }
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    // Update evidence document
    await evidenceDoc.ref.update({
      verificationStatus: result.data!.verified ? 'approved' : 'rejected',
      verificationNotes: result.data!.reasoning,
    });

    // If verified, update action status
    if (result.data!.verified) {
      await actionDoc.ref.update({
        status: 'verified',
      });
    }

    return NextResponse.json({
      success: true,
      ...result.data,
    });
  } catch (error) {
    console.error('Error in /api/verify-evidence:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
