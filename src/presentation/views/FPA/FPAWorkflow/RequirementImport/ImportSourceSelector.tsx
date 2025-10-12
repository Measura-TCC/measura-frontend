"use client";

import { useTranslation } from "react-i18next";
import type { RequirementSource } from "@/core/types/fpa";

interface ImportSourceSelectorProps {
  selectedSource: RequirementSource | null;
  onSelectSource: (source: RequirementSource) => void;
}

export const ImportSourceSelector = ({
  selectedSource,
  onSelectSource,
}: ImportSourceSelectorProps) => {
  const { t } = useTranslation("fpa");

  const sources: { id: RequirementSource; label: string; icon: string }[] = [
    { id: "manual", label: t("requirementImport.sources.manual"), icon: "✏️" },
    { id: "csv", label: t("requirementImport.sources.csv"), icon: "📄" },
    { id: "jira", label: t("requirementImport.sources.jira"), icon: "🔷" },
    { id: "github", label: t("requirementImport.sources.github"), icon: "🐙" },
    {
      id: "azure_devops",
      label: t("requirementImport.sources.azure_devops"),
      icon: "🔵",
    },
    {
      id: "clickup",
      label: t("requirementImport.sources.clickup"),
      icon: "✅",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("requirementImport.selectSource")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => onSelectSource(source.id)}
            className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-md ${
              selectedSource === source.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <div className="text-3xl mb-2">{source.icon}</div>
            <div className="text-sm font-medium text-gray-900">
              {source.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
