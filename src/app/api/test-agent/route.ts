/**
 * POST /api/test-agent
 *
 * DEVELOPMENT ONLY - Test endpoint without auth
 * DO NOT DEPLOY TO PRODUCTION
 *
 * Simple test endpoint to verify orchestrator works without Firebase Auth.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runAgent } from '@/agent/orchestrator';

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'Test endpoint disabled in production' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { message, caseId = 'test-case-123', userId = 'test-user-123' } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: message' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing agent with message:', message);

    // Run agent orchestration without auth
    const result = await runAgent({
      message,
      context: { caseId, userId },
    });

    return NextResponse.json({
      success: true,
      response: result.response,
      toolCallsExecuted: result.toolCallsExecuted,
      agentRunId: result.agentRunId,
      status: result.status,
    });
  } catch (error) {
    console.error('Error in /api/test-agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test endpoint for agent orchestrator (POST only)',
    example: {
      method: 'POST',
      body: {
        message: 'Quiero vender tamales a $50, me cuestan $20, vendo 100/mes',
        caseId: 'optional-case-id',
        userId: 'optional-user-id',
      },
    },
  });
}
