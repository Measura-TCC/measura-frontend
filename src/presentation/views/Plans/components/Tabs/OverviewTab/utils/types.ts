import { MeasurementPlan, Objective, Question, Metric } from "@/core/types/plans";

export type PlanStep = 1 | 2 | 3 | 4 | 5;

export interface StepData {
  planBasics?: {
    name: string;
    description: string;
    owner: string;
    type: string;
  };
  objectives?: Objective[];
  questions?: Question[];
  metrics?: Metric[];
  collectionSetup?: boolean;
}

export interface GoalForm {
  purpose: string;
  issue: string;
  object: string;
  viewpoint: string;
  context: string;
}

export interface MeasurementPlanFormData {
  planName: string;
  associatedProject: string;
  planResponsible: string;
}


export interface LegacyObjective {
  id: string;
  name: string;
}

export interface LegacyQuestion {
  id: string;
  name: string;
}

export interface LegacyMetric {
  id: string;
  name: string;
  unit: string;
}