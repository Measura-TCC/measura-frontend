// Frontend-only types for the measurement plan creation workflow
export type PlanStep = 1 | 2 | 3 | 4 | 5;

export interface Measurement {
  measurementEntity: string;
  measurementAcronym: string;
  measurementProperties: string;
  measurementUnit: string;
  measurementScale: string;
  measurementProcedure: string;
  measurementFrequency: string;
  measurementResponsible: string;
}

export interface Metric {
  metricName: string;
  metricDescription?: string;
  metricMnemonic?: string;
  metricFormula?: string;
  metricControlRange?: number[];
  analysisProcedure?: string;
  analysisFrequency?: string;
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