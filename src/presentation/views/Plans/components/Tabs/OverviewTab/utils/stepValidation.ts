import type { StepData } from "./types";

export const canNavigateToStep = (currentStep: number, targetStep: number, stepData: StepData): boolean => {
  // Always allow going to previous steps
  if (targetStep <= currentStep) {
    return true;
  }

  // Don't allow skipping steps - can only go to the next immediate step
  if (targetStep > currentStep + 1) {
    return false;
  }

  // Validate each step's requirements
  switch (targetStep) {
    case 2:
      // Can go to step 2 if step 1 has basic plan info
      return !!(stepData.planBasics?.name && stepData.planBasics?.owner);

    case 3:
      // Can go to step 3 if we have at least one objective
      return !!(stepData.objectives && stepData.objectives.length > 0);

    case 4:
      // Can go to step 4 if objectives have questions
      return !!(stepData.objectives && stepData.objectives.some(obj => obj.questions?.length > 0));

    case 5:
      // Can go to step 5 if we have metrics for questions
      return !!(stepData.questions && stepData.questions.some(q => q.metrics?.length > 0));

    default:
      return true;
  }
};