import { useTranslation } from "react-i18next";
import type { PlanStep } from "../utils/types";
import { steps as stepData } from "../utils/stepData";
import { Stepper } from "@/presentation/components/primitives";

interface StepIndicatorProps {
  currentStep: PlanStep;
  canNavigateToStep: (step: PlanStep) => boolean;
  onStepClick: (step: PlanStep) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  canNavigateToStep,
  onStepClick,
}) => {
  const { t } = useTranslation("plans");

  const steps = stepData.map(step => ({
    number: step.number,
    label: t(step.titleKey)
  }));

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      onStepClick={(step) => onStepClick(step as PlanStep)}
      canNavigateTo={(step) => canNavigateToStep(step as PlanStep)}
    />
  );
};
