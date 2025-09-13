import type { PlanStep, StepData } from "./types";
import type { Objective } from "@/core/types/plans";
import type { MeasurementPlanFormData, GoalForm } from "./types";

export const canNavigateToStep = (
  step: PlanStep,
  stepData: StepData,
  selectedObjectives: Objective[],
  measurementPlanForm: MeasurementPlanFormData,
  goalForm: GoalForm
): boolean => {
  if (step === 1) return true;
  
  if (step === 2) {
    // Step 2 requires basic plan info to be filled
    return !!(measurementPlanForm.associatedProject && measurementPlanForm.planResponsible && 
              goalForm.purpose && goalForm.issue && goalForm.viewpoint && goalForm.context);
  }
  
  if (step === 3) {
    // Step 3 requires at least one objective to be selected
    return selectedObjectives.length > 0;
  }
  
  if (step === 4) {
    // Step 4 requires at least one question to be added to any objective
    return selectedObjectives.some(obj => obj.questions.length > 0);
  }
  
  if (step === 5) {
    // Step 5 requires at least one metric with measurements to be added to any question
    return selectedObjectives.some(obj => 
      obj.questions.some(question => 
        question.metrics.length > 0 && 
        question.metrics.some(metric => metric.measurements.length > 0)
      )
    );
  }
  
  return false;
};