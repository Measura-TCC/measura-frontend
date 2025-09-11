import { useTranslation } from "react-i18next";
import type { PlanStep } from "../utils/types";
import { steps } from "../utils/stepData";

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

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div
          key={step.number}
          className="flex flex-col items-center flex-1"
        >
          <button
            onClick={() => onStepClick(step.number as PlanStep)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep === step.number
                ? "bg-primary text-white"
                : canNavigateToStep(step.number as PlanStep)
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-gray-200 text-gray-400"
            }`}
            disabled={!canNavigateToStep(step.number as PlanStep)}
          >
            {step.number}
          </button>
          <div className="text-xs text-center mt-1 max-w-20">
            {t(step.titleKey)}
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-gray-200 mt-4 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
};