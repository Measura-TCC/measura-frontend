export enum MeasurementPlanStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export enum ExportFormat {
  PDF = "pdf",
  DOCX = "docx",
}

export type PlanTab = "newPlan" | "createdPlans";

export interface Measurement {
  measurementEntity: string;
  measurementAcronym: string;
  measurementProperties: string;
  measurementUnit: string;
  measurementScale: string;
  measurementProcedure: string;
  measurementFrequency: string;
  measurementResponsible?: string;
}

export interface Metric {
  metricName: string;
  metricDescription: string;
  metricMnemonic: string;
  metricFormula: string;
  metricControlRange: [number, number];
  analysisProcedure: string;
  analysisFrequency: string;
  analysisResponsible?: string;
  measurements: Measurement[];
}

export interface Question {
  questionText: string;
  metrics: Metric[];
}

export interface Objective {
  objectiveTitle: string;
  questions: Question[];
}

export interface MeasurementPlan {
  planName: string;
  associatedProject: string;
  planResponsible: string;
  objectives: Objective[];
}

export interface CreateMeasurementPlanDto {
  planName: string;
  associatedProject: string;
  planResponsible: string;
  objectives?: CreateObjectiveDto[];
}

export interface CreateObjectiveDto {
  objectiveTitle: string;
  questions?: CreateQuestionDto[];
}

export interface CreateQuestionDto {
  questionText: string;
  metrics?: CreateMetricDto[];
}

export interface CreateMetricDto {
  metricName: string;
  metricDescription: string;
  metricMnemonic: string;
  metricFormula: string;
  metricControlRange: [number, number];
  analysisProcedure: string;
  analysisFrequency: string;
  analysisResponsible?: string;
  measurements: CreateMeasurementDto[];
}

export interface CreateMeasurementDto {
  measurementEntity: string;
  measurementAcronym: string;
  measurementProperties: string;
  measurementUnit: string;
  measurementScale: string;
  measurementProcedure: string;
  measurementFrequency: string;
  measurementResponsible?: string;
}

export interface MeasurementPlanSummaryDto {
  id: string;
  planName: string;
  associatedProject: string;
  planResponsible: string;
  status: MeasurementPlanStatus;
  createdAt: Date;
  updatedAt: Date;
  objectivesCount: number;
  questionsCount: number;
  metricsCount: number;
  measurementsCount: number;
  progress: number;
}

export interface MeasurementPlanResponseDto extends MeasurementPlanSummaryDto {
  organizationId: string;
  createdBy: string;
  objectives: Objective[];
}

export interface UpdateMeasurementPlanDto {
  planName?: string;
  associatedProject?: string;
  planResponsible?: string;
  status?: MeasurementPlanStatus;
  objectives?: CreateObjectiveDto[];
}

export interface ExportMeasurementPlanDto {
  format: ExportFormat;
  options?: {
    includeDetails?: boolean;
    includeMeasurements?: boolean;
    includeAnalysis?: boolean;
  };
}

export interface ExportResponseDto {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}

export interface PlansStatistics {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  draftPlans: number;
  averageProgress: number;
  totalObjectives: number;
  totalQuestions: number;
  totalMetrics: number;
  totalMeasurements: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrganizationObjective {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface PredefinedMeasurement {
  measurementEntity: string;
  measurementAcronym: string;
  measurementProperties: string;
  measurementUnit: string;
  measurementScale: string;
  measurementProcedure: string;
  measurementFrequency: string;
  measurementResponsible?: string;
}

export const PLAN_PERMISSIONS = {
  CREATE_PLAN: "create_plan",
  EDIT_PLAN: "edit_plan",
  DELETE_PLAN: "delete_plan",
  VIEW_PLANS: "view_plans",
  EXPORT_PLAN: "export_plan",
} as const;