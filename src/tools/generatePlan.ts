/**
 * Tool: generatePlan
 *
 * Generate a structured 7-day action plan based on diagnostic data.
 * This is a template-based plan that can be customized by the LLM.
 */

import type { GeneratePlanInput, GeneratePlanOutput, ToolResult } from '@/types/tools';

export async function generatePlan(
  input: GeneratePlanInput,
  context: { userId: string; caseId: string }
): Promise<ToolResult<GeneratePlanOutput>> {
  // Input validation
  if (!input.productDescription || !input.targetMarket) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Product description and target market are required',
      },
    };
  }

  if (input.availableHoursPerDay <= 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Available hours per day must be greater than zero',
      },
    };
  }

  // TODO: This should call Gemini to generate a customized plan
  // For now, return a template that will be replaced with LLM-generated content

  const planId = `plan_${Date.now()}_${context.caseId}`;

  // Template plan structure - LLM will fill in specific actions
  const plan: GeneratePlanOutput = {
    planId,
    horizon: '7days',
    goals: [
      'Validate demand by talking to 10 potential customers',
      'Create a minimum viable version of the product/service',
      'Attempt to make first 3 sales',
      'Learn and iterate based on feedback',
    ],
    days: [
      {
        day: 1,
        focus: 'Research & Validation',
        actions: [
          {
            title: 'Identify and list 20 potential customers',
            description: 'Create a list of specific people or businesses who match your target market',
            estimatedHours: 2,
            priority: 'high',
          },
          {
            title: 'Interview 3 potential customers',
            description: 'Talk to 3 people from your list, understand their needs and willingness to pay',
            estimatedHours: 2,
            priority: 'high',
          },
        ],
      },
      {
        day: 2,
        focus: 'MVP Design',
        actions: [
          {
            title: 'Define MVP scope',
            description: 'List the absolute minimum features needed to solve the core problem',
            estimatedHours: 1,
            priority: 'high',
          },
          {
            title: 'Create basic pricing proposal',
            description: 'Draft a simple pricing model based on customer feedback and unit economics',
            estimatedHours: 1,
            priority: 'medium',
          },
        ],
      },
      // Days 3-7 would continue...
    ],
    totalEstimatedHours: input.availableHoursPerDay * 7,
  };

  // TODO: Store plan in Firestore (plans collection)
  // This should be done here or in a separate database write step

  return {
    success: true,
    data: plan,
  };
}
