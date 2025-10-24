"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/primitives";
import { integrationService } from "@/core/services/integrationService";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import type { Requirement } from "@/core/types/fpa";
import type { AzureDevOpsProject } from "@/core/types/integrations";

interface AzureDevOpsImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'azure_devops' }>) => void;
}

export const AzureDevOpsImportForm = ({ requirements, addRequirements }: AzureDevOpsImportFormProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { isAzureDevOpsConfigured, organization } = useIntegrationStatus();
  const [projects, setProjects] = useState<AzureDevOpsProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [wiql, setWiql] = useState<string>("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAzureDevOpsConfigured && organization) {
      loadProjects();
    }
  }, [isAzureDevOpsConfigured, organization]);

  const loadProjects = async () => {
    if (!organization) return;

    setIsLoadingProjects(true);
    try {
      const response = await integrationService.listAzureDevOpsProjects(organization._id);
      setProjects(response.projects);
      if (response.projects.length > 0) {
        setSelectedProject(response.projects[0].name);
        setWiql(`SELECT [System.Id] FROM workitems WHERE [System.TeamProject] = '${response.projects[0].name}'`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load Azure DevOps projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleProjectChange = (projectName: string) => {
    setSelectedProject(projectName);
    setWiql(`SELECT [System.Id] FROM workitems WHERE [System.TeamProject] = '${projectName}'`);
  };

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);

    try {
      const mockRequirements = [
        {
          title: `[Azure DevOps] Sample work item from ${selectedProject}`,
          description: `WIQL: ${wiql}. This is a preview. Full Azure DevOps import will be available after estimate creation.`,
          source: "azure_devops" as const,
        },
      ];

      addRequirements(mockRequirements);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import requirements");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isAzureDevOpsConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Azure DevOps Import</h3>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 p-4 rounded-md">
          <p className="font-medium">{t("requirementImport.integrationNotConfigured")}</p>
          <p className="text-sm mt-1">
            {t("requirementImport.configureInOrgSettings")}{" "}
            <button
              onClick={() => router.push("/organization?tab=integrations")}
              className="underline hover:text-yellow-800 dark:hover:text-yellow-200 font-medium"
            >
              {t("requirementImport.goToSettings")}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Azure DevOps Import</h3>

      {isLoadingProjects ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading Azure DevOps projects...</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("importForms.azureDevops.selectProject")}
            </label>
            <select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              disabled={isImporting}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("importForms.azureDevops.wiql")}
            </label>
            <textarea
              rows={4}
              value={wiql}
              onChange={(e) => setWiql(e.target.value)}
              placeholder="SELECT [System.Id] FROM workitems WHERE [System.WorkItemType] = 'User Story'"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md font-mono text-sm"
              disabled={isImporting}
            />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("importForms.azureDevops.commonQueries")}:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setWiql(`SELECT [System.Id] FROM workitems WHERE [System.TeamProject] = '${selectedProject}'`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  All work items
                </button>
                <button
                  type="button"
                  onClick={() => setWiql(`SELECT [System.Id] FROM workitems WHERE [System.WorkItemType] = 'User Story'`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  User Stories
                </button>
                <button
                  type="button"
                  onClick={() => setWiql(`SELECT [System.Id] FROM workitems WHERE [System.State] = 'Active'`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Active items
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-3 rounded-md text-sm">
            <p className="font-medium">Preview Mode</p>
            <p className="mt-1">During estimate creation, requirements are stored temporarily. Full import from Azure DevOps will be available after the estimate is created.</p>
          </div>

          <Button
            onClick={handleImport}
            variant="primary"
            disabled={isImporting || !wiql}
          >
            {isImporting ? t("requirementImport.importing") : t("requirementImport.addPreview")}
          </Button>
        </>
      )}
    </div>
  );
};
