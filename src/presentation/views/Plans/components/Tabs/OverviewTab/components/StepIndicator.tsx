import { Stepper } from "@/presentation/components/primitives";

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
  const steps = Array.from({ length: totalSteps }, (_, index) => ({
    number: index + 1,
    label: stepTitles[index] || `Step ${index + 1}`
  }));

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      className="mb-6"
    />
  );
};
