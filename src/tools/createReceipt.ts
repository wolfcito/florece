/**
 * Tool: createReceipt
 *
 * Generate a completion certificate for verified actions.
 * Creates a summary document and optionally generates a visual certificate.
 */

import type { CreateReceiptInput, CreateReceiptOutput, ToolResult } from '@/types/tools';
import { getFirebaseAdmin } from '@/lib/firebase/admin';

export async function createReceipt(
  input: CreateReceiptInput,
  context: { userId: string; caseId: string }
): Promise<ToolResult<CreateReceiptOutput>> {
  // Input validation
  if (!input.caseId || !input.userId || !input.planId) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Case ID, user ID, and plan ID are required',
      },
    };
  }

  try {
    const { db } = getFirebaseAdmin();

    // Get total actions for this plan
    const actionsSnapshot = await db
      .collection('actions')
      .where('planId', '==', input.planId)
      .get();

    const totalActions = actionsSnapshot.size;
    const completedActions = input.completedActionIds.length;
    const completionRate = totalActions > 0 ? completedActions / totalActions : 0;

    // Create receipt document
    const receiptRef = db.collection('receipts').doc();
    const receiptData = {
      caseId: input.caseId,
      userId: input.userId,
      planId: input.planId,
      completedActions,
      totalActions,
      generatedAt: new Date(),
      certificateUrl: null, // TODO: Generate visual certificate
    };

    await receiptRef.set(receiptData);

    // Generate congratulatory message
    let message = '';
    if (completionRate === 1) {
      message = '🎉 Amazing! You completed all actions in your 7-day plan!';
    } else if (completionRate >= 0.8) {
      message = '🌟 Great job! You completed most of your plan!';
    } else if (completionRate >= 0.5) {
      message = '👏 Good progress! You\'re halfway there!';
    } else {
      message = '💪 Every step counts! Keep going!';
    }

    return {
      success: true,
      data: {
        receiptId: receiptRef.id,
        completedActions,
        totalActions,
        completionRate,
        message,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create receipt',
      },
    };
  }
}
