/**
 * Tool: computeUnitEconomics
 *
 * Calculate basic unit economics for a product/service.
 * Pure computation - no external API calls or database access.
 */

import type {
  ComputeUnitEconomicsInput,
  ComputeUnitEconomicsOutput,
  ToolResult,
} from '@/types/tools';

export async function computeUnitEconomics(
  input: ComputeUnitEconomicsInput,
  _context: { userId: string; caseId: string }
): Promise<ToolResult<ComputeUnitEconomicsOutput>> {
  // Input validation
  if (input.estimatedCost < 0 || input.proposedPrice < 0 || input.monthlyVolume < 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Cost, price, and volume must be non-negative',
      },
    };
  }

  if (input.proposedPrice === 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Proposed price must be greater than zero',
      },
    };
  }

  // Calculations
  const margin = (input.proposedPrice - input.estimatedCost) / input.proposedPrice;
  const monthlyRevenue = input.proposedPrice * input.monthlyVolume;
  const monthlyCost = input.estimatedCost * input.monthlyVolume;
  const monthlyProfit = monthlyRevenue - monthlyCost;
  const breakEvenUnits = input.estimatedCost > 0 ? input.estimatedCost / (input.proposedPrice - input.estimatedCost) : 0;

  // Generate recommendation
  let recommendation = '';
  if (margin < 0) {
    recommendation = 'Negative margin - you are losing money on each sale. Increase price or reduce costs.';
  } else if (margin < 0.2) {
    recommendation = 'Low margin (under 20%) - consider increasing price or finding ways to reduce costs.';
  } else if (margin < 0.4) {
    recommendation = 'Healthy margin (20-40%) - good foundation for a sustainable business.';
  } else {
    recommendation = 'Strong margin (40%+) - excellent profitability potential!';
  }

  return {
    success: true,
    data: {
      margin,
      monthlyRevenue,
      monthlyCost,
      monthlyProfit,
      breakEvenUnits,
      recommendation,
    },
  };
}
