import React from "react";

export interface Step {
  number: number;
  label: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  canNavigateTo?: (step: number) => boolean;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  canNavigateTo,
  className = "",
}: StepperProps) {

  const isStepCompleted = (stepNumber: number) => stepNumber < currentStep;
  const isStepActive = (stepNumber: number) => stepNumber === currentStep;
  const canNavigate = (stepNumber: number) => {
    if (!canNavigateTo) return true;
    return canNavigateTo(stepNumber);
  };

  const handleStepClick = (stepNumber: number) => {
    if (onStepClick && canNavigate(stepNumber)) {
      onStepClick(stepNumber);
    }
  };

  const getStepClasses = (stepNumber: number) => {
    const isActive = isStepActive(stepNumber);
    const isCompleted = isStepCompleted(stepNumber);
    const isClickable = canNavigate(stepNumber) && onStepClick;

    let baseClasses = "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all";

    if (isCompleted || isActive) {
      baseClasses += " bg-primary border-primary text-white";
    } else if (isClickable) {
      baseClasses += " border-primary/50 text-primary/70 bg-primary/10";
    } else {
      baseClasses += " border-gray-300 text-gray-400 bg-gray-100";
    }

    if (isActive) {
      baseClasses += " ring-4 ring-primary/20";
    }

    if (isClickable) {
      baseClasses += " cursor-pointer hover:scale-110 hover:shadow-md";
    } else if (!isClickable && onStepClick) {
      baseClasses += " cursor-not-allowed opacity-60";
    }

    return baseClasses;
  };

  const getLabelClasses = (stepNumber: number) => {
    const isActive = isStepActive(stepNumber);
    const isClickable = canNavigate(stepNumber);

    if (isActive) {
      return "text-primary";
    } else if (isClickable) {
      return "text-primary/70";
    } else {
      return "text-gray-400";
    }
  };

  return (
    <>
      <div className={`block md:hidden ${className}`}>
        <div className="grid grid-cols-3 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                onClick={() => handleStepClick(step.number)}
                className={getStepClasses(step.number)}
                title={
                  !canNavigate(step.number) && onStepClick
                    ? "Complete the previous step to unlock"
                    : ""
                }
              >
                <span className="text-xs font-medium">
                  {isStepCompleted(step.number) ? "✓" : step.number}
                </span>
              </div>
              <p className={`text-[10px] font-medium text-center leading-tight mt-1 ${getLabelClasses(step.number)}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className={`hidden md:flex items-center justify-between ${className}`}>
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                onClick={() => handleStepClick(step.number)}
                className={getStepClasses(step.number)}
                title={
                  !canNavigate(step.number) && onStepClick
                    ? "Complete the previous step to unlock"
                    : ""
                }
              >
                {isStepCompleted(step.number) ? "✓" : step.number}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isStepCompleted(step.number) ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <p className={`text-xs font-medium ${getLabelClasses(step.number)}`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
