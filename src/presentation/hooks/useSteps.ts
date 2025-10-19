import { useState, useCallback } from "react";

export interface UseStepsOptions<T extends number> {
  initialStep: T;
  totalSteps: number;
  canNavigateTo?: (targetStep: T) => boolean;
}

export interface UseStepsReturn<T extends number> {
  currentStep: T;
  setStep: (step: T) => void;
  nextStep: () => void;
  prevStep: () => void;
  isActive: (step: T) => boolean;
  isCompleted: (step: T) => boolean;
  canGoTo: (step: T) => boolean;
}

export function useSteps<T extends number>(
  options: UseStepsOptions<T>
): UseStepsReturn<T> {
  const { initialStep, totalSteps, canNavigateTo } = options;
  const [currentStep, setCurrentStep] = useState<T>(initialStep);

  const setStep = useCallback(
    (step: T) => {
      if (canNavigateTo && !canNavigateTo(step)) {
        return;
      }
      setCurrentStep(step);
    },
    [canNavigateTo]
  );

  const nextStep = useCallback(() => {
    const next = (currentStep + 1) as T;
    if (next <= totalSteps) {
      setStep(next);
    }
  }, [currentStep, totalSteps, setStep]);

  const prevStep = useCallback(() => {
    const prev = (currentStep - 1) as T;
    if (prev >= 1) {
      setStep(prev);
    }
  }, [currentStep, setStep]);

  const isActive = useCallback((step: T) => step === currentStep, [currentStep]);

  const isCompleted = useCallback((step: T) => step < currentStep, [currentStep]);

  const canGoTo = useCallback(
    (step: T) => {
      if (canNavigateTo) {
        return canNavigateTo(step);
      }
      return true;
    },
    [canNavigateTo]
  );

  return {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    isActive,
    isCompleted,
    canGoTo,
  };
}
