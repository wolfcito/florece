/**
 * Tool: createActions
 *
 * Convert a plan into discrete Firestore action documents.
 * This creates trackable action items that users can mark as complete.
 */

import type { CreateActionsInput, CreateActionsOutput, ToolResult } from '@/types/tools';
import { getFirebaseAdmin } from '@/lib/firebase/admin';

export async function createActions(
  input: CreateActionsInput,
  context: { userId: string; caseId: string }
): Promise<ToolResult<CreateActionsOutput>> {
  // Input validation
  if (!input.planId || !input.caseId || !input.days || input.days.length === 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Plan ID, case ID, and days with actions are required',
      },
    };
  }

  try {
    const { db } = getFirebaseAdmin();
    const actionsCollection = db.collection('actions');
    const actionIds: string[] = [];

    // Create a batch write for better performance
    const batch = db.batch();

    for (const day of input.days) {
      for (const action of day.actions) {
        const actionRef = actionsCollection.doc();
        const actionData = {
          planId: input.planId,
          caseId: input.caseId,
          day: day.day,
          title: action.title,
          description: action.description,
          status: 'pending',
          createdAt: new Date(),
          estimatedHours: action.estimatedHours,
        };

        batch.set(actionRef, actionData);
        actionIds.push(actionRef.id);
      }
    }

    // Commit all actions at once
    await batch.commit();

    return {
      success: true,
      data: {
        actionIds,
        count: actionIds.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create actions',
      },
    };
  }
}
