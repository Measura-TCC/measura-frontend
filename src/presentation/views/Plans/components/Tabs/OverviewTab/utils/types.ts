export interface PlanStep {
  step: number;
  title: string;
  description: string;
  isCompleted?: boolean;
}

export interface StepData {
  planBasics?: {
    name: string;
    description: string;
    owner: string;
    type: string;
  };
  objectives?: any[];
  questions?: any[];
  metrics?: any[];
}

export interface Objective {
  objectiveTitle: string;
  objectiveDescription: string;
  questions: any[];
}

export interface Question {
  questionTitle: string;
  questionDescription: string;
  metrics: any[];
}

export interface Metric {
  metricTitle: string;
  metricDescription: string;
  metricType: string;
}