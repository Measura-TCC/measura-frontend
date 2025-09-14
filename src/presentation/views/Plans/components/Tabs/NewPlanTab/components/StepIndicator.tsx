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
          <div className="flex items-center w-full">
            <div
              onClick={() => onStepClick(step.number as PlanStep)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                currentStep >= step.number
                  ? "bg-primary border-primary text-white"
                  : canNavigateToStep(step.number as PlanStep)
                  ? "border-primary/50 text-primary/70 bg-primary/10"
                  : "border-gray-300 text-gray-400 bg-gray-100"
              } ${
                currentStep === step.number
                  ? "ring-4 ring-primary/20"
                  : ""
              } ${
                canNavigateToStep(step.number as PlanStep)
                  ? "cursor-pointer hover:scale-110 hover:shadow-md"
                  : "cursor-not-allowed opacity-60"
              }`}
              title={
                !canNavigateToStep(step.number as PlanStep)
                  ? t("workflow.completeStepToUnlock")
                  : ""
              }
            >
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.number
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />
            )}
          </div>
          <div className="mt-2 text-center">
            <p
              className={`text-xs font-medium ${
                currentStep === step.number
                  ? "text-primary"
                  : canNavigateToStep(step.number as PlanStep)
                  ? "text-primary/70"
                  : "text-gray-400"
              }`}
            >
              {t(step.titleKey)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};