"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRequirements, useRequirementActions } from "@/core/hooks/fpa";
import { Button } from "@/presentation/components/primitives";
import { DynamicFPAForm } from "./DynamicFPAForm";

interface RequirementSpecificationViewProps {
  onProceed: () => void;
  onBack: () => void;
  estimateId: string;
}

export const RequirementSpecificationView = ({
  onProceed,
  onBack,
  estimateId,
}: RequirementSpecificationViewProps) => {
  const { t } = useTranslation("fpa");
  const { requirements } = useRequirements({ estimateId });
  const { updateRequirement } = useRequirementActions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const classifiedRequirements = requirements?.filter((r) => r.componentType) || [];
  const currentRequirement = classifiedRequirements[currentIndex];

  const handleSave = async (data: Record<string, unknown>) => {
    if (currentRequirement) {
      await updateRequirement({
        estimateId,
        requirementId: currentRequirement._id,
        data: data as any,
      });

      if (currentIndex < classifiedRequirements.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onProceed();
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex < classifiedRequirements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onProceed();
    }
  };

  if (!currentRequirement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {t("requirementSpecification.allCompleted")}
        </p>
        <Button onClick={onProceed} variant="primary" className="mt-4">
          {t("requirementSpecification.proceedToGSC")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("requirementSpecification.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {t("requirementSpecification.subtitle")}
        </p>
        <p className="mt-2 text-sm font-medium text-gray-700">
          {t("requirementSpecification.progress", {
            completed: currentIndex + 1,
            total: classifiedRequirements.length,
          })}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("requirementSpecification.requirementDetails")}
          </h3>
          <p className="text-gray-900 font-medium">{currentRequirement.title}</p>
          <p className="text-sm text-gray-600 mt-1">
            {currentRequirement.description}
          </p>
          <p className="text-sm text-indigo-600 mt-2">
            Tipo: {currentRequirement.componentType}
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {t("requirementSpecification.fpaFields")}
          </h4>
          <DynamicFPAForm
            componentType={currentRequirement.componentType!}
            initialData={undefined}
            onSubmit={handleSave}
            onCancel={onBack}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="secondary">
          {t("requirementSpecification.back")}
        </Button>
        <Button onClick={handleSkip} variant="secondary">
          {t("requirementSpecification.skip")}
        </Button>
      </div>
    </div>
  );
};
