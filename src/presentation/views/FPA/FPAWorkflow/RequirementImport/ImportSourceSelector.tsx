"use client";

import { useTranslation } from "react-i18next";
import type { RequirementSource } from "@/core/types/fpa";
import { useIntegrationStatus } from "./hooks/useIntegrationStatus";
import { AzureDevOpsIcon, ClickUpIcon } from "@/presentation/assets/icons";

interface ImportSourceSelectorProps {
  selectedSource: RequirementSource | null;
  onSelectSource: (source: RequirementSource) => void;
}

const sourceIcons: Record<RequirementSource, React.ReactNode> = {
  manual: (
    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  csv: (
    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  jira: (
    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="#2684FF">
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1 1 0 0 0-1-1zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1a1 1 0 0 0-1-1z"/>
    </svg>
  ),
  github: (
    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  ),
  azure_devops: <AzureDevOpsIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
  clickup: <ClickUpIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
};

export const ImportSourceSelector = ({
  selectedSource,
  onSelectSource,
}: ImportSourceSelectorProps) => {
  const { t } = useTranslation("fpa");
  const { isJiraConfigured, isGitHubConfigured, isClickUpConfigured, isAzureDevOpsConfigured } = useIntegrationStatus();

  const sources: { id: RequirementSource; label: string; configured?: boolean }[] = [
    { id: "manual", label: t("requirementImport.sources.manual"), configured: true },
    { id: "csv", label: t("requirementImport.sources.csv"), configured: true },
    { id: "jira", label: t("requirementImport.sources.jira"), configured: isJiraConfigured },
    { id: "github", label: t("requirementImport.sources.github"), configured: isGitHubConfigured },
    { id: "azure_devops", label: t("requirementImport.sources.azure_devops"), configured: isAzureDevOpsConfigured },
    { id: "clickup", label: t("requirementImport.sources.clickup"), configured: isClickUpConfigured },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t("requirementImport.selectSource")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sources.map((source) => (
          <div key={source.id} className="relative">
            <button
              onClick={() => onSelectSource(source.id)}
              className={`w-full p-2 sm:p-3 md:p-4 border-2 rounded-lg text-center transition-all hover:shadow-md cursor-pointer ${
                selectedSource === source.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              } ${!source.configured ? "opacity-60" : ""}`}
              title={!source.configured ? t("requirementImport.notConfigured") : ""}
            >
              <div className="flex justify-center mb-1 sm:mb-2">{sourceIcons[source.id]}</div>
              <div className="text-xs sm:text-sm font-medium text-default">
                {source.label}
              </div>
            </button>
            {!source.configured && (
              <div className="absolute top-1 right-1">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full" title={t("requirementImport.requiresConfiguration")}>
                  !
                </span>
              </div>
            )}
            {source.configured && source.id !== "manual" && source.id !== "csv" && (
              <div className="absolute top-1 right-1">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full" title={t("requirementImport.configured")}>
                  ✓
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
