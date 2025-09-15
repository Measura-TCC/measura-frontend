import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles = [],
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              {stepTitles[index] && (
                <span className="text-xs text-secondary mt-1 text-center max-w-16">
                  {stepTitles[index]}
                </span>
              )}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`
                  flex-1 h-0.5 mx-2
                  ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};