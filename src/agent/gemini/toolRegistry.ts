/**
 * Tool Registry
 *
 * Central registry of all tools available to the agent.
 * Each tool has:
 * - JSON Schema for Gemini function calling
 * - Handler function for execution
 * - Metadata (name, description, permissions)
 */

import type { ToolResult } from '@/types/tools';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: any; // JSON Schema
  handler: (input: any, context: { userId: string; caseId: string }) => Promise<ToolResult<any>>;
  requiresAuth: boolean;
}

/**
 * Tool registry
 * Import tool handlers here once implemented
 */
export const toolRegistry: Record<string, ToolDefinition> = {
  // TODO: Register tools as they're implemented
  // computeUnitEconomics: {
  //   name: 'computeUnitEconomics',
  //   description: 'Calculate unit economics for a product',
  //   parameters: { /* JSON Schema */ },
  //   handler: computeUnitEconomics,
  //   requiresAuth: true,
  // },
};

/**
 * Get tool definition by name
 */
export function getTool(name: string): ToolDefinition | undefined {
  return toolRegistry[name];
}

/**
 * Get all tool definitions for Gemini function calling
 */
export function getAllTools(): ToolDefinition[] {
  return Object.values(toolRegistry);
}

/**
 * Format tools for Gemini API
 */
export function formatToolsForGemini(): any[] {
  return getAllTools().map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
}

/**
 * Execute a tool by name
 */
export async function executeTool(
  toolName: string,
  input: any,
  context: { userId: string; caseId: string }
): Promise<ToolResult<any>> {
  const tool = getTool(toolName);

  if (!tool) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: `Unknown tool: ${toolName}`,
      },
    };
  }

  try {
    return await tool.handler(input, context);
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNKNOWN',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
