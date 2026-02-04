/**
 * Core domain types for Florece
 */

export type CaseStatus = 'active' | 'completed';
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'verified';
export type EvidenceVerificationStatus = 'pending' | 'approved' | 'rejected';
export type FileType = 'image' | 'audio' | 'document';
export type EventType = 'diagnostic' | 'plan_created' | 'action_completed';
export type AgentRunStatus = 'running' | 'completed' | 'failed';
export type Urgency = 'low' | 'medium' | 'high';
export type Priority = 'high' | 'medium' | 'low';

export interface Case {
  id: string;
  userId: string;
  createdAt: Date;
  answers: Record<string, any>;
  status: CaseStatus;
}

export interface Product {
  id: string;
  caseId: string;
  name: string;
  description: string;
  targetMarket: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  caseId: string;
  date: Date;
  type: EventType;
  data: Record<string, any>;
}

export interface Plan {
  id: string;
  caseId: string;
  productId: string;
  createdAt: Date;
  horizon: '7days';
  goals: string[];
  unitEconomics: {
    cost: number;
    price: number;
    margin: number;
  };
}

export interface Action {
  id: string;
  planId: string;
  caseId: string;
  day: number;
  title: string;
  description: string;
  status: ActionStatus;
  createdAt: Date;
  estimatedHours?: number;
  priority?: Priority;
}

export interface Evidence {
  id: string;
  actionId: string;
  caseId: string;
  userId: string;
  fileUrl: string;
  fileType: FileType;
  uploadedAt: Date;
  verificationStatus: EvidenceVerificationStatus;
  verificationNotes?: string;
}

export interface Receipt {
  id: string;
  caseId: string;
  userId: string;
  planId: string;
  completedActions: number;
  totalActions: number;
  generatedAt: Date;
  certificateUrl?: string;
}

export interface AgentRun {
  id: string;
  caseId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  toolCalls: Array<{
    tool: string;
    input: any;
    output: any;
    timestamp: Date;
  }>;
  status: AgentRunStatus;
  error?: string;
}
