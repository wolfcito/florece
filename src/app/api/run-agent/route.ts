/**
 * POST /api/run-agent
 *
 * Trigger agent orchestration with user message.
 * This endpoint proxies to the Cloud Run agent service or runs the agent directly.
 *
 * Request Body:
 * {
 *   message: string;           // User's message or voice transcript
 *   caseId: string;            // Current case/session ID
 *   sessionId?: string;        // Optional session for multi-turn conversation
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   response: string;          // Agent's text response (for audio TTS)
 *   toolCallsExecuted: number; // Number of tools executed
 *   agentRunId: string;        // ID of agent_run document for debugging
 *   error?: string;
 * }
 *
 * Auth: Requires Firebase Auth token in Authorization header
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { runAgent } from '@/agent/orchestrator';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const userId = await verifyAuthToken(authHeader);

    // Parse request body
    const body = await request.json();
    const { message, caseId, sessionId } = body;

    if (!message || !caseId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: message, caseId' },
        { status: 400 }
      );
    }

    // Run agent orchestration
    const result = await runAgent({
      message,
      context: { caseId, userId, sessionId },
    });

    return NextResponse.json({
      success: true,
      response: result.response,
      toolCallsExecuted: result.toolCallsExecuted,
      agentRunId: result.agentRunId,
    });
  } catch (error) {
    console.error('Error in /api/run-agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
