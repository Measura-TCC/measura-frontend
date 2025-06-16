import { measuraApi } from "./measuraApi";
import type {
  CreateEstimateData,
  UpdateEstimateData,
} from "@/core/schemas/fpa";

export interface EstimateResponse {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  project?: {
    _id: string;
    name: string;
    description: string;
    status: string;
  };
  countType:
    | "DEVELOPMENT_PROJECT"
    | "ENHANCEMENT_PROJECT"
    | "APPLICATION_PROJECT";
  applicationBoundary: string;
  countingScope: string;
  dataProcessing: number;
  performanceRequirements: number;
  heavilyUsedConfiguration: number;
  transactionRate: number;
  onlineDataEntry: number;
  endUserEfficiency: number;
  onlineUpdate: number;
  complexProcessing: number;
  reusability: number;
  installationEase: number;
  operationalEase: number;
  multipleSites: number;
  facilitateChange: number;
  distributedFunctions: number;
  totalDegreeOfInfluence: number;
  valueAdjustmentFactor: number;
  unadjustedFunctionPoints: number;
  adjustedFunctionPoints: number;
  ilfCount: number;
  eifCount: number;
  eiCount: number;
  eoCount: number;
  eqCount: number;
  productivityFactor?: number;
  notes?: string;
  status: "DRAFT" | "IN_PROGRESS" | "FINALIZED" | "ARCHIVED";
  estimatedEffortHours: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CalculationResponse {
  unadjustedFunctionPoints: number;
  valueAdjustmentFactor: number;
  adjustedFunctionPoints: number;
  estimatedEffortHours: number;
  totalDegreeOfInfluence: number;
  breakdown: {
    ilf: { count: number; points: number };
    eif: { count: number; points: number };
    ei: { count: number; points: number };
    eo: { count: number; points: number };
    eq: { count: number; points: number };
  };
}

interface EstimateWithComponents extends EstimateResponse {
  internalLogicalFiles?: unknown[];
  externalInterfaceFiles?: unknown[];
  externalInputs?: unknown[];
  externalOutputs?: unknown[];
  externalQueries?: unknown[];
}

export interface EstimateOverview {
  _id: string;
  name: string;
  description: string;
  project?: {
    _id: string;
    name: string;
    description: string;
  };
  countType:
    | "DEVELOPMENT_PROJECT"
    | "ENHANCEMENT_PROJECT"
    | "APPLICATION_PROJECT";
  status: "DRAFT" | "IN_PROGRESS" | "FINALIZED" | "ARCHIVED";
  unadjustedFunctionPoints: number;
  adjustedFunctionPoints: number;
  valueAdjustmentFactor: number;
  estimatedEffortHours: number;
  internalLogicalFiles: unknown[];
  externalInterfaceFiles: unknown[];
  externalInputs: unknown[];
  externalOutputs: unknown[];
  externalQueries: unknown[];
  totalComponents: number;
  componentCounts: {
    ilf: number;
    eif: number;
    ei: number;
    eo: number;
    eq: number;
  };
  completionPercentage: number;
  hasComponents: boolean;
  hasGSC: boolean;
  isCalculated: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export const transformToEstimateOverview = (
  estimate: EstimateResponse
): EstimateOverview => {
  const extendedEstimate = estimate as EstimateWithComponents;
  const internalLogicalFiles = extendedEstimate.internalLogicalFiles || [];
  const externalInterfaceFiles = extendedEstimate.externalInterfaceFiles || [];
  const externalInputs = extendedEstimate.externalInputs || [];
  const externalOutputs = extendedEstimate.externalOutputs || [];
  const externalQueries = extendedEstimate.externalQueries || [];

  const componentCounts = {
    ilf: internalLogicalFiles.length,
    eif: externalInterfaceFiles.length,
    ei: externalInputs.length,
    eo: externalOutputs.length,
    eq: externalQueries.length,
  };

  const totalComponents = Object.values(componentCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return {
    _id: estimate._id,
    name: estimate.name,
    description: estimate.description,
    project: estimate.project,
    countType: estimate.countType,
    status: estimate.status,
    unadjustedFunctionPoints: estimate.unadjustedFunctionPoints,
    adjustedFunctionPoints: estimate.adjustedFunctionPoints,
    valueAdjustmentFactor: estimate.valueAdjustmentFactor,
    estimatedEffortHours: estimate.estimatedEffortHours,
    internalLogicalFiles,
    externalInterfaceFiles,
    externalInputs,
    externalOutputs,
    externalQueries,
    totalComponents,
    componentCounts,
    completionPercentage: totalComponents > 0 ? 80 : 20,
    hasComponents: totalComponents > 0,
    hasGSC: estimate.valueAdjustmentFactor !== 1,
    isCalculated: estimate.adjustedFunctionPoints > 0,
    createdAt: estimate.createdAt,
    updatedAt: estimate.updatedAt,
    version: estimate.version,
  };
};

export const estimateService = {
  getEstimates: async (params?: {
    projectId?: string;
  }): Promise<EstimateResponse[]> => {
    const response = await measuraApi.get("/estimates", { params });
    return response.data;
  },

  getEstimatesOverviews: async (params?: {
    projectId?: string;
  }): Promise<EstimateOverview[]> => {
    const response = await measuraApi.get("/estimates", { params });
    return response.data.map(transformToEstimateOverview);
  },

  getEstimateOverview: async (params: {
    id: string;
  }): Promise<EstimateOverview> => {
    const response = await measuraApi.get(`/estimates/${params.id}`);
    return transformToEstimateOverview(response.data);
  },

  getEstimate: async (params: { id: string }): Promise<EstimateResponse> => {
    const response = await measuraApi.get(`/estimates/${params.id}`);
    return response.data;
  },

  createEstimate: async (
    data: CreateEstimateData
  ): Promise<EstimateResponse> => {
    const response = await measuraApi.post("/estimates", data);
    return response.data;
  },

  updateEstimate: async (params: {
    id: string;
    data: UpdateEstimateData;
  }): Promise<EstimateResponse> => {
    const response = await measuraApi.put(
      `/estimates/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteEstimate: async (params: {
    id: string;
  }): Promise<{ success: boolean }> => {
    const response = await measuraApi.delete(`/estimates/${params.id}`);
    return response.data;
  },

  createNewVersion: async (params: {
    id: string;
  }): Promise<EstimateResponse> => {
    const response = await measuraApi.post(`/estimates/${params.id}/version`);
    return response.data;
  },

  calculateFunctionPoints: async (params: {
    estimateId: string;
  }): Promise<CalculationResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/calculate`
    );
    return response.data;
  },

  recalculate: async (params: { id: string }): Promise<EstimateResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.id}/recalculate`
    );
    return response.data;
  },
};
