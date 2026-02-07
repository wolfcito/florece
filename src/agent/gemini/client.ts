/**
 * Gemini API Client
 *
 * Handles communication with Google Gemini (Vertex AI or direct API).
 * SERVER-SIDE ONLY - never import in client components.
 */

import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { getServerEnv } from '@/lib/env';

export interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GeminiFunctionCall {
  name: string;
  args: Record<string, any>;
}

export interface GeminiResponse {
  content: string;
  functionCalls?: GeminiFunctionCall[];
  finishReason: 'stop' | 'function_call' | 'max_tokens' | 'error';
}

let genAI: GoogleGenerativeAI | null = null;

/**
 * Initialize Gemini client
 * Supports both Vertex AI and direct API key access
 */
export function initializeGeminiClient(): GoogleGenerativeAI {
  if (genAI) {
    return genAI;
  }

  const apiKey = getServerEnv('GEMINI_API_KEY', undefined);
  const vertexProjectId = getServerEnv('VERTEX_PROJECT_ID', undefined);

  if (!apiKey && !vertexProjectId) {
    throw new Error('Must set either GEMINI_API_KEY or VERTEX_PROJECT_ID');
  }

  // For MVP, use direct API key approach
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
  }

  // TODO: Add Vertex AI support if needed
  throw new Error('Only GEMINI_API_KEY is supported for now. Vertex AI coming soon.');
}

/**
 * Send a message to Gemini with function calling enabled
 *
 * @param messages - Conversation history
 * @param tools - Available function definitions
 * @param systemPrompt - System instructions
 * @returns Gemini response with optional function calls
 */
export async function sendMessage(
  messages: GeminiMessage[],
  tools: any[],
  systemPrompt: string
): Promise<GeminiResponse> {
  try {
    const genAI = initializeGeminiClient();

    // Configure model with system prompt and tools
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Fast and cost-effective for MVP
      systemInstruction: systemPrompt,
      tools: tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({ history });

    // Send last message
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;

    // Parse function calls if any
    const functionCalls = response.functionCalls()?.map((fc: any) => ({
      name: fc.name,
      args: fc.args as Record<string, any>,
    }));

    // Get text content
    const content = response.text() || '';

    return {
      content,
      functionCalls,
      finishReason: functionCalls && functionCalls.length > 0 ? 'function_call' : 'stop',
    };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return {
      content: '',
      finishReason: 'error',
    };
  }
}

/**
 * Send function call results back to Gemini
 *
 * @param messages - Conversation history including the function call request
 * @param functionResults - Array of function results to send back
 * @param tools - Available function definitions (must match original call)
 * @param systemPrompt - System instructions (must match original call)
 * @returns Gemini response after processing function results
 */
export async function sendFunctionResults(
  messages: GeminiMessage[],
  functionResults: Array<{ name: string; response: any }>,
  tools: any[],
  systemPrompt: string
): Promise<GeminiResponse> {
  try {
    const genAI = initializeGeminiClient();

    // Configure model with same settings as original call
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
      tools: tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
    });

    // Convert messages to Gemini format
    const history = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({ history });

    // Format function results as Gemini expects
    const functionResponseParts = functionResults.map((result) => ({
      functionResponse: {
        name: result.name,
        response: result.response,
      },
    }));

    // Send function results to continue conversation
    const result = await chat.sendMessage(functionResponseParts);
    const response = result.response;

    // Parse any new function calls
    const newFunctionCalls = response.functionCalls()?.map((fc: any) => ({
      name: fc.name,
      args: fc.args as Record<string, any>,
    }));

    // Get text content
    const content = response.text() || '';

    return {
      content,
      functionCalls: newFunctionCalls,
      finishReason: newFunctionCalls && newFunctionCalls.length > 0 ? 'function_call' : 'stop',
    };
  } catch (error) {
    console.error('Error in sendFunctionResults:', error);
    return {
      content: '',
      finishReason: 'error',
    };
  }
}
