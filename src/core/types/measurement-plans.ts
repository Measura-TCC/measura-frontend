export interface GoalForm {
  goal?: string;
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

export interface MeasurementPlan {
  id?: string;
  planName: string;
  associatedProject: string;
  planResponsible: string;
  objectives: any[];
  createdAt?: string;
  updatedAt?: string;
}