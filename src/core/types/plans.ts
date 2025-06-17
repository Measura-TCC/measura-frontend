export type PlanStatus = "active" | "completed" | "draft" | "scheduled";
export type PlanType = "measurement" | "estimation" | "quality" | "performance";
export type PlanTab = "overview" | "plans" | "templates" | "gqm";

export interface Plan {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  startDate: Date;
  endDate: Date;
  status: PlanStatus;
  owner: string;
  progress: number;
  goalsCount: number;
  metricsCount: number;
  gqmPhase?: GQMPhase;
}

export interface PlanFormData {
  name: string;
  description: string;
  type: PlanType;
  owner: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  type: PlanType;
  owner: string;
}

export interface UpdatePlanRequest {
  id: string;
  name?: string;
  description?: string;
  status?: PlanStatus;
  progress?: number;
  gqmPhase?: GQMPhase;
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  estimatedDuration: number;
  goalsCount: number;
  metricsCount: number;
}

export interface PlansStatistics {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  draftPlans: number;
  averageProgress: number;
  totalGoals: number;
  totalMetrics: number;
}

export type GQMPhase =
  | "planning"
  | "definition"
  | "data_collection"
  | "interpretation"
  | "completed";

export interface GQMGoal {
  id: string;
  planId: string;
  purpose: string;
  issue: string;
  object: string;
  viewpoint: string;
  context: string;
  status: "draft" | "active" | "completed";
}

export interface GQMQuestion {
  id: string;
  goalId: string;
  question: string;
  rationale: string;
  priority: "high" | "medium" | "low";
  status: "draft" | "active" | "answered";
}

export interface GQMMetric {
  id: string;
  questionId: string;
  name: string;
  description: string;
  type: "objective" | "subjective";
  scale: string;
  unit: string;
  measurementMethod: string;
  collectionFrequency: string;
  responsible: string;
  status: "planned" | "collecting" | "completed";
}

export interface GQMData {
  goals: GQMGoal[];
  questions: GQMQuestion[];
  metrics: GQMMetric[];
}

export const PLAN_PERMISSIONS = {
  CREATE_PLAN: "create_plan",
  EDIT_PLAN: "edit_plan",
  DELETE_PLAN: "delete_plan",
  VIEW_PLANS: "view_plans",
  MANAGE_GQM: "manage_gqm",
} as const;
