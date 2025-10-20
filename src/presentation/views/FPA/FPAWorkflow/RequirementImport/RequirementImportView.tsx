"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { RequirementSource } from "@/core/types/fpa";
import { useRequirementsStore } from "@/core/hooks/fpa/useRequirementsStore";
import { ImportSourceSelector } from "./ImportSourceSelector";
import { ManualRequirementForm } from "./forms/ManualRequirementForm";
import { CSVImportForm } from "./forms/CSVImportForm";
import { JiraImportForm } from "./forms/JiraImportForm";
import { GitHubImportForm } from "./forms/GitHubImportForm";
import { AzureDevOpsImportForm } from "./forms/AzureDevOpsImportForm";
import { ClickUpImportForm } from "./forms/ClickUpImportForm";
import { RequirementClassificationTable } from "./RequirementClassificationTable";
import { Button } from "@/presentation/components/primitives";

interface RequirementImportViewProps {
  onProceed: () => void;
}

export const RequirementImportView = ({
  onProceed,
}: RequirementImportViewProps) => {
  const { t } = useTranslation("fpa");
  const requirements = useRequirementsStore((state) => state.requirements);
  const substep = useRequirementsStore((state) => state.substep);
  const setSubstep = useRequirementsStore((state) => state.setSubstep);
  const addRequirement = useRequirementsStore((state) => state.addRequirement);
  const addRequirements = useRequirementsStore((state) => state.addRequirements);
  const removeRequirement = useRequirementsStore((state) => state.removeRequirement);

  const [selectedSource, setSelectedSource] = useState<RequirementSource | null>("manual");

  const handleProceedToClassification = () => {
    setSubstep("classification");
  };

  const handleBackToImport = () => {
    setSubstep("import");
  };

  const renderImportForm = () => {
    switch (selectedSource) {
      case "manual":
        return <ManualRequirementForm requirements={requirements} addRequirement={addRequirement} addRequirements={addRequirements} removeRequirement={removeRequirement} />;
      case "csv":
        return <CSVImportForm requirements={requirements} addRequirements={addRequirements} />;
      case "jira":
        return <JiraImportForm requirements={requirements} addRequirements={addRequirements} />;
      case "github":
        return <GitHubImportForm requirements={requirements} addRequirements={addRequirements} />;
      case "azure_devops":
        return <AzureDevOpsImportForm requirements={requirements} addRequirements={addRequirements} />;
      case "clickup":
        return <ClickUpImportForm requirements={requirements} addRequirements={addRequirements} />;
      default:
        return null;
    }
  };

  // Import substep
  if (substep === "import") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("requirementImport.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {t("requirementImport.subtitle")}
          </p>
        </div>

        <ImportSourceSelector
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
        />

        <div className="border-t border-gray-200 pt-6">
          {renderImportForm()}
        </div>

        {requirements.length > 0 && (
          <div className="mt-6 p-6 bg-indigo-50 border-2 border-indigo-300 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-base font-semibold text-indigo-900">
                  {t("requirementImport.importSuccess", {
                    count: requirements.length,
                  })}
                </p>
                <p className="text-sm text-indigo-700 mt-1">
                  {t("requirementImport.proceedDescription")}
                </p>
              </div>
              <Button
                onClick={handleProceedToClassification}
                variant="primary"
                className="px-6 py-3 text-base font-semibold whitespace-normal text-center shrink-0"
              >
                {t("requirementImport.nextToClassification")}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Classification substep
  if (substep === "classification") {
    const classified = requirements.filter((r) => r.componentType).length;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("requirementImport.classifyTitle")}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t("requirementImport.classifySubtitle")}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {t("requirementClassification.requirementsClassified", {
                classified,
                total: requirements.length,
              })}
            </p>
          </div>
          <Button
            onClick={handleBackToImport}
            variant="secondary"
            className="px-4 py-2 whitespace-normal text-center shrink-0"
          >
            {t("requirementImport.backToImport")}
          </Button>
        </div>

        <RequirementClassificationTable onProceed={onProceed} onBack={handleBackToImport} />
      </div>
    );
  }

  return null;
};
