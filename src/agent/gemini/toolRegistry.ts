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
import { generatePlan } from '@/tools/generatePlan';
import { createReceipt } from '@/tools/createReceipt';
import { recommendSuppliers } from '@/tools/recommendSuppliers';
import { publishVenture } from '@/tools/publishVenture';
import { verifyEvidence } from '@/tools/verifyEvidence';

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

  generatePlan: {
    name: 'generatePlan',
    description: 'Generate a structured 7-day action plan for a new business venture based on product description, target market, and available time. Returns a complete plan with daily actions, goals, and time estimates.',
    parameters: {
      type: 'object',
      properties: {
        productDescription: {
          type: 'string',
          description: 'Description of the product or service the user wants to create',
        },
        targetMarket: {
          type: 'string',
          description: 'Description of the target customer or market segment',
        },
        availableHoursPerDay: {
          type: 'number',
          description: 'How many hours per day the user can dedicate to this venture',
        },
      },
      required: ['productDescription', 'targetMarket', 'availableHoursPerDay'],
    },
    handler: generatePlan,
    requiresAuth: true,
  },

  createReceipt: {
    name: 'createReceipt',
    description: 'Generate a completion certificate/receipt summarizing completed actions and progress. Creates a motivational message based on completion rate.',
    parameters: {
      type: 'object',
      properties: {
        caseId: {
          type: 'string',
          description: 'ID of the user case/venture',
        },
        userId: {
          type: 'string',
          description: 'ID of the user',
        },
        planId: {
          type: 'string',
          description: 'ID of the plan to create receipt for',
        },
        completedActionIds: {
          type: 'array',
          description: 'Array of action IDs that have been completed',
          items: {
            type: 'string',
          },
        },
      },
      required: ['caseId', 'userId', 'planId', 'completedActionIds'],
    },
    handler: createReceipt,
    requiresAuth: true,
  },

  recommendSuppliers: {
    name: 'recommendSuppliers',
    description: 'Recommend suppliers, platforms, or resources based on product type, location, and budget. Useful for finding materials, tools, or services needed for the venture.',
    parameters: {
      type: 'object',
      properties: {
        productType: {
          type: 'string',
          description: 'Type of product or service (e.g., "physical product", "digital service")',
        },
        location: {
          type: 'string',
          description: 'User location or target market location',
        },
        budget: {
          type: 'number',
          description: 'Available budget for sourcing/supplies',
        },
      },
      required: ['productType', 'location', 'budget'],
    },
    handler: recommendSuppliers,
    requiresAuth: true,
  },

  publishVenture: {
    name: 'publishVenture',
    description: 'Create a public shareable page for the venture. Generates URL and social media copy for sharing the business idea.',
    parameters: {
      type: 'object',
      properties: {
        caseId: {
          type: 'string',
          description: 'ID of the case/venture to publish',
        },
        productName: {
          type: 'string',
          description: 'Name of the product or venture',
        },
        description: {
          type: 'string',
          description: 'Short description of the venture',
        },
      },
      required: ['caseId', 'productName', 'description'],
    },
    handler: publishVenture,
    requiresAuth: true,
  },

  verifyEvidence: {
    name: 'verifyEvidence',
    description: 'Verify uploaded evidence (image, audio, or document) using Gemini Vision/Audio analysis. Analyzes if the evidence matches the action requirements and returns verification result with confidence score.',
    parameters: {
      type: 'object',
      properties: {
        actionId: {
          type: 'string',
          description: 'ID of the action being verified',
        },
        evidenceId: {
          type: 'string',
          description: 'ID of the evidence document',
        },
        fileUrl: {
          type: 'string',
          description: 'Firebase Storage URL of the uploaded file (gs://bucket/path format)',
        },
        fileType: {
          type: 'string',
          description: 'Type of file: image, audio, or document',
          enum: ['image', 'audio', 'document'],
        },
        actionDescription: {
          type: 'string',
          description: 'Description of what the action requires as evidence',
        },
      },
      required: ['actionId', 'evidenceId', 'fileUrl', 'fileType', 'actionDescription'],
    },
    handler: verifyEvidence,
    requiresAuth: true,
  },
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
