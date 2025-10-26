"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import { ConfigureJiraModal } from "./ConfigureJiraModal";
import { ConfigureGitHubModal } from "./ConfigureGitHubModal";
import { ConfigureClickUpModal } from "./ConfigureClickUpModal";
import { ConfigureAzureDevOpsModal } from "./ConfigureAzureDevOpsModal";
import { AzureDevOpsIcon, ClickUpIcon } from "@/presentation/assets/icons";
import type { Organization } from "@/core/services/organization/organizationService";

interface IntegrationsTabProps {
  organization: Organization | null;
  onRefresh: () => void;
}

type IntegrationType = "jira" | "github" | "clickup" | "azureDevops";

export const IntegrationsTab = ({
  organization,
  onRefresh,
}: IntegrationsTabProps) => {
  const { t } = useTranslation("organization");
  const [activeModal, setActiveModal] = useState<IntegrationType | null>(null);

  const integrations = [
    {
      id: "jira" as IntegrationType,
      name: "Jira",
      description: t("integrations.jira.description"),
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#2684FF">
          <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1 1 0 0 0-1-1zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1a1 1 0 0 0-1-1z" />
        </svg>
      ),
      config: organization?.integrations?.jira,
    },
    {
      id: "github" as IntegrationType,
      name: "GitHub",
      description: t("integrations.github.description"),
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
          />
        </svg>
      ),
      config: organization?.integrations?.github,
    },
    {
      id: "clickup" as IntegrationType,
      name: "ClickUp",
      description: t("integrations.clickup.description"),
      icon: <ClickUpIcon className="w-10 h-10" />,
      config: organization?.integrations?.clickup,
    },
    {
      id: "azureDevops" as IntegrationType,
      name: "Azure DevOps",
      description: t("integrations.azureDevops.description"),
      icon: <AzureDevOpsIcon className="w-10 h-10" />,
      config: organization?.integrations?.azureDevops,
    },
  ];

  const handleSuccess = () => {
    setActiveModal(null);
    onRefresh();
  };

  if (!organization) {
    return (
      <div className="p-6">
        <p className="text-gray-500 dark:text-gray-400">
          {t("integrations.loadingOrganization")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("integrations.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {t("integrations.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const isConfigured = integration.config && integration.config.enabled;

          return (
            <div
              key={integration.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{integration.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  {isConfigured ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ● {t("integrations.configured")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      x {t("integrations.notConfigured")}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setActiveModal(integration.id)}
                  variant={isConfigured ? "secondary" : "primary"}
                  className="text-sm"
                >
                  {isConfigured
                    ? t("integrations.edit")
                    : t("integrations.configure")}
                </Button>
              </div>

              {isConfigured && integration.config?.configuredAt && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {t("integrations.configuredAt", {
                    date: new Date(
                      integration.config.configuredAt
                    ).toLocaleDateString(),
                  })}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <ConfigureJiraModal
        isOpen={activeModal === "jira"}
        onClose={() => setActiveModal(null)}
        organizationId={organization._id}
        existingConfig={organization.integrations?.jira}
        onSuccess={handleSuccess}
      />

      <ConfigureGitHubModal
        isOpen={activeModal === "github"}
        onClose={() => setActiveModal(null)}
        organizationId={organization._id}
        existingConfig={organization.integrations?.github}
        onSuccess={handleSuccess}
      />

      <ConfigureClickUpModal
        isOpen={activeModal === "clickup"}
        onClose={() => setActiveModal(null)}
        organizationId={organization._id}
        existingConfig={organization.integrations?.clickup}
        onSuccess={handleSuccess}
      />

      <ConfigureAzureDevOpsModal
        isOpen={activeModal === "azureDevops"}
        onClose={() => setActiveModal(null)}
        organizationId={organization._id}
        existingConfig={organization.integrations?.azureDevops}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
