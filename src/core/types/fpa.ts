export type EstimateStatus = "draft" | "finalized" | "archived";

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
  finalizedEstimates: number;
  archivedEstimates: number;
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

export type RequirementSource =
  | "manual"
  | "csv"
  | "jira"
  | "github"
  | "azure_devops"
  | "clickup";

export type ComponentType = "ALI" | "AIE" | "EI" | "EO" | "EQ";

export interface ALIFpaData {
  name: string;
  description: string;
  recordElementTypes?: number;
  dataElementTypes?: number;
  primaryIntent: string;
  dataGroups?: string[];
  notes?: string;
}

export interface AIEFpaData {
  name: string;
  description: string;
  recordElementTypes?: number;
  dataElementTypes?: number;
  primaryIntent: string;
  externalSystem: string;  // Backend uses 'externalSystem' not 'externalSystemName'
  dataGroups?: string[];
  notes?: string;
}

export interface EIFpaData {
  name: string;
  description: string;
  fileTypesReferenced?: number;
  dataElementTypes?: number;
  primaryIntent: string;
  processingLogic?: string;
  validationRules?: string[];
  notes?: string;
}

export interface EOFpaData {
  name: string;
  description: string;
  fileTypesReferenced?: number;
  dataElementTypes?: number;
  primaryIntent: string;
  processingLogic?: string;
  outputFormat?: string;
  calculationFormulas?: string[];
  notes?: string;
}

export interface EQFpaData {
  name: string;
  description: string;
  fileTypesReferenced?: number;
  dataElementTypes?: number;
  primaryIntent: string;
  retrievalLogic?: string;
  outputFormat?: string;
  notes?: string;
}

export type FpaData = ALIFpaData | AIEFpaData | EIFpaData | EOFpaData | EQFpaData;

export interface RequirementWithFpaData {
  title: string;
  description?: string;
  source: RequirementSource;
  sourceReference?: string;
  componentType: ComponentType;
  fpaData: FpaData;
}

export interface Requirement {
  _id: string;
  title: string;
  description?: string;
  source: RequirementSource;
  sourceReference?: string;
  sourceMetadata?: {
    issueType?: string;
    status?: string;
    priority?: string;
    created?: string;
    updated?: string;
    externalUrl?: string;
    [key: string]: any;
  };
  componentType: ComponentType;
  componentId?: string;
  estimateId: string;
  organizationId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdjustmentFactors {
  dataCommunications: number;
  distributedDataProcessing: number;
  performance: number;
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
}
