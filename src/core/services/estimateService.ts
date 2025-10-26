import { measuraApi } from "./measuraApi";
import { getOrganizationState } from "../utils/organizationUtils";
import type {
  CreateEstimateData,
  UpdateEstimateData,
} from "@/core/schemas/fpa";
import type {
  Requirement,
  RequirementWithFpaData,
} from "@/core/types/fpa";

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
  productivityFactor: number;
  workingHoursPerDay: number;
  averageDailyWorkingHours: number;
  hourlyRateBRL?: number;
  teamSize?: number;
  internalLogicalFiles: string[];
  externalInterfaceFiles: string[];
  externalInputs: string[];
  externalOutputs: string[];
  externalQueries: string[];
  generalSystemCharacteristics: {
    values: number[];
    totalInfluenceFactor: number;
    valueAdjustmentFactor: number;
  };
  unadjustedFunctionPoints: number;
  valueAdjustmentFactor: number;
  adjustedFunctionPoints: number;
  estimatedEffortHours: number;
  estimatedDuration: string;
  estimatedTotalCost: number;
  estimatedCostPerFunctionPoint: number;
  estimatedCostPerPerson: number;
  estimatedDurationDays?: number;
  estimatedDurationMonths?: number;
  estimatedDurationWeeks?: number;
  documentReferences: string[];
  status: "DRAFT" | "IN_PROGRESS" | "FINALIZED" | "ARCHIVED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  __v?: number;
}

export interface CalculationResponse {
  message: string;
  calculatedData: {
    unadjustedFunctionPoints: number;
    adjustedFunctionPoints: number;
    estimatedEffortHours: number;
  };
}

export interface FunctionPointDistributionItem {
  name: string;
  value: number;
  color: string;
  abbreviation: string;
}

export interface ComplexityDistributionItem {
  complexity: string;
  count: number;
  color: string;
}

export interface GSCRadarItem {
  characteristic: string;
  value: number;
  fullMark: number;
}

export interface CostBreakdownItem {
  category: string;
  amount: number;
  color: string;
  unit: string;
}

export interface EffortBreakdownItem {
  phase: string;
  hours: number;
  percentage: number;
}

export interface TimelineDataItem extends EffortBreakdownItem {
  color: string;
}

export interface ProductivityMetricItem {
  metric: string;
  value: number;
  benchmark?: number;
  status?: string;
}

export interface EstimateOverviewResponse {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  status: string;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  project: {
    _id: string;
    name: string;
    description: string;
    organizationId?: string;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
  };

  configuration: {
    countType: string;
    applicationBoundary: string;
    countingScope: string;
    productivityFactor: number;
    workingHoursPerDay: number;
    averageDailyWorkingHours: number;
    hourlyRateBRL: number;
    teamSize: number;
  };

  components: {
    detailed: {
      internalLogicalFiles: string[];
      externalInterfaceFiles: string[];
      externalInputs: string[];
      externalOutputs: string[];
      externalQueries: string[];
    };
    summaryByType: {
      ALI: number;
      AIE: number;
      EI: number;
      EO: number;
      EQ: number;
    };
    componentComplexitySummary: {
      low: number;
      average: number;
      high: number;
    };
  };

  functionPoints: {
    unadjusted: number;
    adjusted: number;
  };

  generalSystemCharacteristics: {
    values: number[];
    totalInfluenceFactor: number;
    valueAdjustmentFactor: number;
  };

  effortEstimation: {
    effort: {
      estimatedEffortHours: number;
      hoursPerPerson: number;
    };
    duration: {
      estimatedDuration: string;
      estimatedWorkingDays: number;
    };
  };

  costEstimation: {
    estimatedTotalCost: number;
    estimatedCostPerFunctionPoint: number;
    estimatedCostPerPerson: number;
  };

  documentReferences: string[];

  chartData: {
    functionPointDistribution: FunctionPointDistributionItem[];
    complexityDistribution: ComplexityDistributionItem[];
    gscRadarData: GSCRadarItem[];
    costBreakdown: CostBreakdownItem[];
    effortBreakdown: EffortBreakdownItem[];
    timelineData: TimelineDataItem[];
    productivityMetrics: ProductivityMetricItem[];
  };
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
  estimate: EstimateResponse | any
): EstimateOverview => {
  // Extract data from estimate response
  const data = estimate;

  const internalLogicalFiles = data.internalLogicalFiles || [];
  const externalInterfaceFiles = data.externalInterfaceFiles || [];
  const externalInputs = data.externalInputs || [];
  const externalOutputs = data.externalOutputs || [];
  const externalQueries = data.externalQueries || [];

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
    _id: data._id,
    name: data.name,
    description: data.description,
    project: data.project,
    countType: data.countType,
    status: data.status,
    unadjustedFunctionPoints: data.unadjustedFunctionPoints,
    adjustedFunctionPoints: data.adjustedFunctionPoints,
    valueAdjustmentFactor: data.valueAdjustmentFactor,
    estimatedEffortHours: data.estimatedEffortHours,
    internalLogicalFiles,
    externalInterfaceFiles,
    externalInputs,
    externalOutputs,
    externalQueries,
    totalComponents,
    componentCounts,
    completionPercentage: totalComponents > 0 ? 80 : 20,
    hasComponents: totalComponents > 0,
    hasGSC:
      data.generalSystemCharacteristics &&
      data.generalSystemCharacteristics.values &&
      data.generalSystemCharacteristics.values.length > 0,
    isCalculated: data.adjustedFunctionPoints > 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    version: data.version,
  };
};

export const estimateService = {
  getEstimates: async (params?: {
    projectId?: string;
  }): Promise<EstimateResponse[]> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/estimates/${activeOrganizationId}`, { params });
    return response.data;
  },

  getEstimatesOverviews: async (params?: {
    projectId?: string;
  }): Promise<EstimateOverview[]> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/estimates/${activeOrganizationId}`, { params });
    return response.data.map(transformToEstimateOverview);
  },

  getEstimateOverview: async (params: {
    id: string;
  }): Promise<EstimateOverviewResponse> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/estimates/${activeOrganizationId}/${params.id}/overview`);
    return response.data;
  },

  getEstimate: async (params: { id: string }): Promise<EstimateResponse> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/estimates/${activeOrganizationId}/${params.id}`);
    return response.data;
  },

  createEstimate: async (
    data: CreateEstimateData
  ): Promise<EstimateResponse> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.post(`/estimates/${activeOrganizationId}`, data);
    return response.data;
  },

  updateEstimateStatus: async (
    estimateId: string,
    status: string
  ): Promise<EstimateResponse> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.patch(`/estimates/${activeOrganizationId}/${estimateId}/status`, { status });
    return response.data;
  },

  updateEstimate: async (params: {
    id: string;
    data: UpdateEstimateData;
  }): Promise<EstimateResponse> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.put(
      `/estimates/${activeOrganizationId}/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteEstimate: async (params: {
    id: string;
  }): Promise<{ success: boolean }> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.delete(`/estimates/${activeOrganizationId}/${params.id}`);
    return response.data;
  },

  createNewVersion: async (params: {
    id: string;
  }): Promise<EstimateResponse> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.post(`/estimates/${activeOrganizationId}/${params.id}/version`);
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

  // Requirements management
  getRequirements: async (params: {
    estimateId: string;
  }): Promise<Requirement[]> => {
    const response = await measuraApi.get(
      `/estimates/${params.estimateId}/requirements`
    );
    return response.data;
  },

  getRequirement: async (params: {
    estimateId: string;
    requirementId: string;
  }): Promise<Requirement> => {
    const response = await measuraApi.get(
      `/estimates/${params.estimateId}/requirements/${params.requirementId}`
    );
    return response.data;
  },

  updateRequirement: async (params: {
    estimateId: string;
    requirementId: string;
    data: Partial<RequirementWithFpaData>;
  }): Promise<Requirement> => {
    const response = await measuraApi.put(
      `/estimates/${params.estimateId}/requirements/${params.requirementId}`,
      params.data
    );
    return response.data;
  },

  deleteRequirement: async (params: {
    estimateId: string;
    requirementId: string;
  }): Promise<void> => {
    await measuraApi.delete(
      `/estimates/${params.estimateId}/requirements/${params.requirementId}`
    );
  },
};
