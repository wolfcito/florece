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
import { computeUnitEconomics } from '@/tools/computeUnitEconomics';
import { createActions } from '@/tools/createActions';

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
  computeUnitEconomics: {
    name: 'computeUnitEconomics',
    description: 'Calculate basic unit economics (margin, revenue, profit, break-even) for a product or service. Helps entrepreneurs understand if their pricing is viable.',
    parameters: {
      type: 'object',
      properties: {
        productType: {
          type: 'string',
          description: 'Type of product or service being analyzed',
        },
        estimatedCost: {
          type: 'number',
          description: 'Estimated cost per unit (materials, labor, etc.)',
        },
        proposedPrice: {
          type: 'number',
          description: 'Proposed selling price per unit',
        },
        monthlyVolume: {
          type: 'number',
          description: 'Expected monthly sales volume in units',
        },
      },
      required: ['productType', 'estimatedCost', 'proposedPrice', 'monthlyVolume'],
    },
    handler: computeUnitEconomics,
    requiresAuth: true,
  },

  createActions: {
    name: 'createActions',
    description: 'Convert a 7-day business plan into trackable action items in Firestore. Creates discrete tasks the user can complete and mark as done.',
    parameters: {
      type: 'object',
      properties: {
        planId: {
          type: 'string',
          description: 'ID of the plan to create actions for',
        },
        caseId: {
          type: 'string',
          description: 'ID of the user case (business idea)',
        },
        days: {
          type: 'array',
          description: 'Array of days with their actions',
          items: {
            type: 'object',
            properties: {
              day: {
                type: 'number',
                description: 'Day number (1-7)',
              },
              actions: {
                type: 'array',
                description: 'Actions for this day',
                items: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Action title',
                    },
                    description: {
                      type: 'string',
                      description: 'Detailed action description',
                    },
                    estimatedHours: {
                      type: 'number',
                      description: 'Estimated hours to complete',
                    },
                  },
                  required: ['title', 'description', 'estimatedHours'],
                },
              },
            },
            required: ['day', 'actions'],
          },
        },
      },
      required: ['planId', 'caseId', 'days'],
    },
    handler: createActions,
    requiresAuth: true,
  },

  // TODO: Register remaining tools as they're completed
  // - generatePlan (Issue #28 - partial)
  // - createReceipt (Issue #30 - partial)
  // - publishVenture (Issue #31 - partial)
  // - recommendSuppliers (Issue #32 - partial)
  // - verifyEvidence (Issues #3, #4 - not started)
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
