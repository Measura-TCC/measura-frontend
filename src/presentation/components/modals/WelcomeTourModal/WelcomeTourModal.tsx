"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import {
  LightningBoltIcon,
  BuildingIcon,
  DocumentIcon,
  CheckIcon,
  UserIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@/presentation/assets/icons";
import { canManageOrganization } from "@/core/utils/permissions";

interface WelcomeTourModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
  userRole?: string;
}

interface TourStep {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descriptionKey: string;
}

const managerTourSteps: TourStep[] = [
  {
    icon: LightningBoltIcon,
    titleKey: "tour.welcome.title",
    descriptionKey: "tour.welcome.description",
  },
  {
    icon: BuildingIcon,
    titleKey: "tour.managerStep1.title",
    descriptionKey: "tour.managerStep1.description",
  },
  {
    icon: DocumentIcon,
    titleKey: "tour.managerStep2.title",
    descriptionKey: "tour.managerStep2.description",
  },
  {
    icon: CheckIcon,
    titleKey: "tour.managerStep3.title",
    descriptionKey: "tour.managerStep3.description",
  },
];

const userTourSteps: TourStep[] = [
  {
    icon: LightningBoltIcon,
    titleKey: "tour.welcome.title",
    descriptionKey: "tour.welcome.description",
  },
  {
    icon: UserIcon,
    titleKey: "tour.userStep1.title",
    descriptionKey: "tour.userStep1.description",
  },
  {
    icon: DocumentIcon,
    titleKey: "tour.userStep2.title",
    descriptionKey: "tour.userStep2.description",
  },
  {
    icon: CheckIcon,
    titleKey: "tour.userStep3.title",
    descriptionKey: "tour.userStep3.description",
  },
];

export const WelcomeTourModal = ({
  isOpen,
  onComplete,
  onSkip,
  userRole,
}: WelcomeTourModalProps) => {
  const { t } = useTranslation("onboarding");
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  const tourSteps = canManageOrganization(userRole)
    ? managerTourSteps
    : userTourSteps;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen || !mounted) return null;

  const currentStepData = tourSteps[currentStep];
  const IconComponent = currentStepData.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return createPortal(
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-white">
            {t(currentStepData.titleKey)}
          </h2>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm cursor-pointer"
          >
            {t("tour.buttons.skip")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-12 h-12 text-primary" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              {t(currentStepData.descriptionKey)}
            </p>

            <div className="flex gap-2 mt-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-primary"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {t("tour.buttons.previous")}
          </Button>

          <Button variant="primary" onClick={handleNext}>
            {isLastStep ? t("tour.buttons.start") : t("tour.buttons.next")}
            {!isLastStep && <ArrowRightIcon className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
