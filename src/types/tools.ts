/**
 * Type definitions for agent tools
 */

// computeUnitEconomics
export interface ComputeUnitEconomicsInput {
  productType: string;
  estimatedCost: number;
  proposedPrice: number;
  monthlyVolume: number;
}

export interface ComputeUnitEconomicsOutput {
  margin: number;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  breakEvenUnits: number;
  recommendation: string;
}

// generatePlan
export interface GeneratePlanInput {
  caseId: string;
  productDescription: string;
  targetMarket: string;
  availableHoursPerDay: number;
  budget: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface GeneratePlanOutput {
  planId: string;
  horizon: '7days';
  goals: string[];
  days: Array<{
    day: number;
    focus: string;
    actions: Array<{
      title: string;
      description: string;
      estimatedHours: number;
      priority: 'high' | 'medium' | 'low';
    }>;
  }>;
  totalEstimatedHours: number;
}

// createActions
export interface CreateActionsInput {
  planId: string;
  caseId: string;
  days: Array<{
    day: number;
    actions: Array<{
      title: string;
      description: string;
      estimatedHours: number;
    }>;
  }>;
}

export interface CreateActionsOutput {
  actionIds: string[];
  count: number;
}

// verifyEvidence
export interface VerifyEvidenceInput {
  actionId: string;
  evidenceId: string;
  fileUrl: string;
  fileType: 'image' | 'audio' | 'document';
  actionDescription: string;
}

export interface VerifyEvidenceOutput {
  verified: boolean;
  confidence: number;
  reasoning: string;
  suggestions?: string[];
}

// createReceipt
export interface CreateReceiptInput {
  caseId: string;
  userId: string;
  planId: string;
  completedActionIds: string[];
}

export interface CreateReceiptOutput {
  receiptId: string;
  completedActions: number;
  totalActions: number;
  completionRate: number;
  certificateUrl?: string;
  message: string;
}

// recommendSuppliers
export interface RecommendSuppliersInput {
  productType: string;
  location: string;
  materials: string[];
  budget: number;
}

export interface RecommendSuppliersOutput {
  suppliers: Array<{
    name: string;
    type: 'manufacturer' | 'wholesaler' | 'platform';
    website?: string;
    estimatedCost: number;
    notes: string;
  }>;
}

// publishVenture
export interface PublishVentureInput {
  caseId: string;
  productName: string;
  description: string;
  imageUrls: string[];
}

export interface PublishVentureOutput {
  publishedUrl: string;
  shareableText: string;
  qrCode?: string;
}

// Generic tool result wrapper
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: 'INVALID_INPUT' | 'DATABASE_ERROR' | 'EXTERNAL_SERVICE_ERROR' | 'UNKNOWN';
    message: string;
  };
}
