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
      {
        day: 3,
        focus: 'Build MVP',
        actions: [
          {
            title: 'Create MVP prototype',
            description: 'Build the simplest version possible - focus on solving the core problem',
            estimatedHours: 3,
            priority: 'high',
          },
          {
            title: 'Test MVP with 2 customers',
            description: 'Show your prototype to 2 people from your list and get feedback',
            estimatedHours: 1,
            priority: 'high',
          },
        ],
      },
      {
        day: 4,
        focus: 'First Sales Attempt',
        actions: [
          {
            title: 'Prepare sales pitch',
            description: 'Create a simple 1-minute pitch explaining your product and asking for a sale',
            estimatedHours: 1,
            priority: 'high',
          },
          {
            title: 'Attempt first 3 sales',
            description: 'Reach out to 3 potential customers and try to close your first sales',
            estimatedHours: 3,
            priority: 'high',
          },
        ],
      },
      {
        day: 5,
        focus: 'Learn & Iterate',
        actions: [
          {
            title: 'Analyze feedback from first sales attempts',
            description: 'Review what worked, what didn\'t, and what objections you received',
            estimatedHours: 1,
            priority: 'high',
          },
          {
            title: 'Make quick improvements',
            description: 'Adjust your product, pitch, or pricing based on customer feedback',
            estimatedHours: 2,
            priority: 'high',
          },
        ],
      },
      {
        day: 6,
        focus: 'Scale Attempts',
        actions: [
          {
            title: 'Reach out to 10 more prospects',
            description: 'Contact 10 new potential customers with your improved pitch',
            estimatedHours: 2,
            priority: 'high',
          },
          {
            title: 'Document your process',
            description: 'Write down what works so you can repeat it or teach someone else',
            estimatedHours: 1,
            priority: 'medium',
          },
        ],
      },
      {
        day: 7,
        focus: 'Decide Next Steps',
        actions: [
          {
            title: 'Review results and metrics',
            description: 'Count how many sales you made, revenue generated, and lessons learned',
            estimatedHours: 1,
            priority: 'high',
          },
          {
            title: 'Make go/no-go decision',
            description: 'Decide if you should continue with this idea, pivot, or try something else',
            estimatedHours: 1,
            priority: 'high',
          },
          {
            title: 'Plan next 7 days if continuing',
            description: 'If moving forward, create a plan for week 2 based on what you learned',
            estimatedHours: 1,
            priority: 'medium',
          },
        ],
      },
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
