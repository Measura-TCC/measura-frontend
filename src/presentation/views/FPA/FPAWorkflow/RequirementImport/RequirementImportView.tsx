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
  organizationId?: string;
  projectId?: string;
  estimateId?: string;
}

export const RequirementImportView = ({
  onProceed,
  organizationId,
  projectId,
  estimateId,
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
        return <JiraImportForm requirements={requirements} addRequirements={addRequirements} organizationId={organizationId} projectId={projectId} estimateId={estimateId} />;
      case "github":
        return <GitHubImportForm requirements={requirements} addRequirements={addRequirements} organizationId={organizationId} projectId={projectId} estimateId={estimateId} />;
      case "azure_devops":
        return <AzureDevOpsImportForm requirements={requirements} addRequirements={addRequirements} organizationId={organizationId} projectId={projectId} estimateId={estimateId} />;
      case "clickup":
        return <ClickUpImportForm requirements={requirements} addRequirements={addRequirements} organizationId={organizationId} projectId={projectId} estimateId={estimateId} />;
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
          <div className="mt-6 space-y-4">
            {/* Requirements Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("requirementImport.importSuccess", {
                    count: requirements.length,
                  })}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        {t("requirementImport.requirementTitle")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        {t("requirementImport.description")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        {t("requirementImport.source")}
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                        {t("actions.edit")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {requirements.map((req, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {req.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-md">
                          <div className="line-clamp-2">{req.description || '-'}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {req.source}
                          </span>
                          {req.sourceReference && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              {req.sourceReference}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeRequirement(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            {t("actions.remove", { defaultValue: "Remove" })}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Proceed Button */}
            <div className="p-6 bg-indigo-50 border-2 border-indigo-300 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-indigo-700">
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
