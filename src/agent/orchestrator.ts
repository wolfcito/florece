/**
 * Agent Orchestrator
 *
 * Manages agent execution flow:
 * 1. Receives user input or triggers
 * 2. Calls Gemini with function calling
 * 3. Executes tools as requested by LLM
 * 4. Returns results to LLM for next step
 * 5. Logs execution to agent_runs collection
 */

import type { AgentRun } from '@/types/domain';
import { sendMessage, sendFunctionResults, type GeminiMessage } from '@/agent/gemini/client';
import { formatToolsForGemini, executeTool as executeToolFromRegistry } from '@/agent/gemini/toolRegistry';
import { SYSTEM_PROMPT } from '@/agent/gemini/prompts';
import { getFirebaseAdmin } from '@/lib/firebase/admin';

export interface AgentContext {
  caseId: string;
  userId: string;
  sessionId?: string;
}

export interface AgentInput {
  message: string;
  context: AgentContext;
}

export interface AgentOutput {
  response: string;
  toolCallsExecuted: number;
  status: 'success' | 'partial' | 'error';
  agentRunId: string;
}

/**
 * Main agent orchestration function
 *
 * @param input - User message and context
 * @returns Agent response with execution details
 */
export async function runAgent(input: AgentInput): Promise<AgentOutput> {
  const MAX_ITERATIONS = 10; // Prevent infinite loops
  const toolCalls: AgentRun['toolCalls'] = [];
  const messages: GeminiMessage[] = [];
  let agentRunId = '';
  let iterationCount = 0;

  try {
    // 1. Create agent_run document in Firestore
    agentRunId = await logAgentRun(input.context, 'running', [], undefined);

    // 2. Initialize conversation with user message
    messages.push({
      role: 'user',
      content: input.message,
    });

    // 3. Get available tools
    const tools = formatToolsForGemini();

    // 4. Agent loop: Keep calling Gemini until it returns a final response
    while (iterationCount < MAX_ITERATIONS) {
      iterationCount++;

      // Call Gemini
      const response = await sendMessage(messages, tools, SYSTEM_PROMPT);

      // Check for errors
      if (response.finishReason === 'error') {
        throw new Error('Gemini API error');
      }

      // Add Gemini's response to conversation
      messages.push({
        role: 'model',
        content: response.content,
      });

      // If no function calls, we're done
      if (!response.functionCalls || response.functionCalls.length === 0) {
        // Update agent_run with success
        await updateAgentRun(agentRunId, 'completed', toolCalls, undefined);

        return {
          response: response.content,
          toolCallsExecuted: toolCalls.length,
          status: 'success',
          agentRunId,
        };
      }

      // 5. Execute all function calls
      const functionResults = [];
      for (const functionCall of response.functionCalls) {
        const result = await executeToolCall(
          functionCall.name,
          functionCall.args,
          input.context
        );

        // Log tool execution
        toolCalls.push({
          tool: functionCall.name,
          input: functionCall.args,
          output: result,
          timestamp: new Date(),
        });

        functionResults.push({
          name: functionCall.name,
          response: result,
        });
      }

      // 6. Send function results back to Gemini to continue conversation
      const continuationResponse = await sendFunctionResults(
        messages,
        functionResults,
        tools,
        SYSTEM_PROMPT
      );

      // Check for errors in continuation
      if (continuationResponse.finishReason === 'error') {
        throw new Error('Gemini API error during function result processing');
      }

      // Add continuation response to conversation
      messages.push({
        role: 'model',
        content: continuationResponse.content,
      });

      // If no more function calls, we're done
      if (!continuationResponse.functionCalls || continuationResponse.functionCalls.length === 0) {
        // Update agent_run with success
        await updateAgentRun(agentRunId, 'completed', toolCalls, undefined);

        return {
          response: continuationResponse.content,
          toolCallsExecuted: toolCalls.length,
          status: 'success',
          agentRunId,
        };
      }

      // Otherwise, loop continues with new function calls
    }

    // Max iterations reached
    await updateAgentRun(agentRunId, 'partial', toolCalls, 'Max iterations reached');

    return {
      response: messages[messages.length - 1]?.content || 'Processing incomplete',
      toolCallsExecuted: toolCalls.length,
      status: 'partial',
      agentRunId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Update agent_run with error
    if (agentRunId) {
      await updateAgentRun(agentRunId, 'failed', toolCalls, errorMessage);
    }

    return {
      response: 'I encountered an error while processing your request. Please try again.',
      toolCallsExecuted: toolCalls.length,
      status: 'error',
      agentRunId,
    };
  }
}

/**
 * Process a single tool call from Gemini
 */
async function executeToolCall(
  toolName: string,
  toolInput: any,
  context: AgentContext
): Promise<any> {
  try {
    // Execute tool via registry (handles validation and execution)
    const result = await executeToolFromRegistry(toolName, toolInput, {
      userId: context.userId,
      caseId: context.caseId,
    });

    return result;
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);

    // Return error in ToolResult format
    return {
      success: false,
      error: {
        code: 'UNKNOWN',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Log agent execution to Firestore
 */
async function logAgentRun(
  context: AgentContext,
  status: AgentRun['status'],
  toolCalls: AgentRun['toolCalls'],
  error?: string
): Promise<string> {
  try {
    const { db } = getFirebaseAdmin();
    const agentRunsCollection = db.collection('agent_runs');

    const agentRunData: Omit<AgentRun, 'id'> = {
      caseId: context.caseId,
      userId: context.userId,
      startedAt: new Date(),
      status,
      toolCalls,
      ...(error && { error }),
    };

    const docRef = await agentRunsCollection.add(agentRunData);
    return docRef.id;
  } catch (error) {
    console.error('Error logging agent run:', error);
    // Return empty ID on error (non-critical failure)
    return '';
  }
}

/**
 * Update existing agent run in Firestore
 */
async function updateAgentRun(
  agentRunId: string,
  status: AgentRun['status'],
  toolCalls: AgentRun['toolCalls'],
  error?: string
): Promise<void> {
  if (!agentRunId) return;

  try {
    const { db } = getFirebaseAdmin();
    const agentRunRef = db.collection('agent_runs').doc(agentRunId);

    await agentRunRef.update({
      status,
      toolCalls,
      completedAt: new Date(),
      ...(error && { error }),
    });
  } catch (error) {
    console.error('Error updating agent run:', error);
    // Non-critical failure, don't throw
  }
}
