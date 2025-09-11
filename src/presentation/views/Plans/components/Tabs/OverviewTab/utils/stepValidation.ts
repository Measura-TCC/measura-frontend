import type { PlanStep, StepData } from "./types";

export const canNavigateToStep = (
  step: PlanStep,
  stepData: StepData,
  selectedObjectives: string[],
  selectedQuestionsPerObjective: Record<string, string[]>,
  selectedMetricsPerQuestion: Record<string, string[]>
): boolean => {
  if (step === 1) return true;
  if (step === 2) return !!stepData.planBasics;
  if (step === 3) return selectedObjectives.length > 0;
  if (step === 4) return Object.values(selectedQuestionsPerObjective).some(questions => questions.length > 0);
  if (step === 5) return Object.values(selectedMetricsPerQuestion).some(metrics => metrics.length > 0);
  return false;
};