export type EstimateStatus = "completed" | "in_progress" | "draft";

export interface Estimate {
  id: string;
  name: string;
  description?: string;
  totalPoints: number;
  createdAt: Date;
  updatedAt?: Date;
  status: EstimateStatus;
}

export interface FunctionPointItem {
  id: string;
  estimateId: string;
  type: FunctionType;
  complexity: ComplexityLevel;
  points: number;
  description?: string;
}

export type FunctionType = "EI" | "EO" | "EQ" | "ILF" | "EIF";

export type ComplexityLevel = "simple" | "average" | "complex";

export interface FunctionTypeInfo {
  value: FunctionType;
  label: string;
  description: string;
  points: {
    simple: number;
    average: number;
    complex: number;
  };
}

export interface ComplexityInfo {
  value: ComplexityLevel;
  label: string;
  description: string;
}

export interface CreateEstimateRequest {
  name: string;
  description?: string;
}

export interface UpdateEstimateRequest {
  id: string;
  name?: string;
  description?: string;
  status?: EstimateStatus;
}

export interface EstimateFormData {
  name: string;
  description?: string;
}

export interface FPAStatistics {
  totalEstimates: number;
  completedEstimates: number;
  inProgressEstimates: number;
  draftEstimates: number;
  totalFunctionPoints: number;
  averagePoints: number;
}

export const FPA_PERMISSIONS = {
  CREATE_ESTIMATE: "create_estimate",
  EDIT_ESTIMATE: "edit_estimate",
  DELETE_ESTIMATE: "delete_estimate",
  VIEW_ESTIMATES: "view_estimates",
} as const;
