export type PlanStep = 1 | 2 | 3 | 4 | 5;

export interface StepData {
  planBasics?: {
    name: string;
    description: string;
    type: string;
    owner: string;
  };
  goals?: unknown[];
  questions?: unknown[];
  metrics?: unknown[];
  collectionSetup?: boolean;
}

export interface GoalForm {
  purpose: string;
  issue: string;
  object: string;
  viewpoint: string;
  context: string;
}

export interface Objective {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  name: string;
}

export interface Metric {
  id: string;
  name: string;
  unit: string;
}