"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/primitives";
import { integrationService } from "@/core/services/integrationService";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import { ImportedRequirementsPreview } from "../components/ImportedRequirementsPreview";
import type { Requirement } from "@/core/types/fpa";
import type { AzureDevOpsProject, ImportResultResponse } from "@/core/types/integrations";

interface AzureDevOpsImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'azure_devops'; sourceReference?: string }>) => void;
  organizationId?: string;
  projectId?: string;
  estimateId?: string;
}

type ViewMode = 'form' | 'preview';

export const AzureDevOpsImportForm = ({ requirements, addRequirements, organizationId, projectId, estimateId }: AzureDevOpsImportFormProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { isAzureDevOpsConfigured, organization } = useIntegrationStatus();
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [projects, setProjects] = useState<AzureDevOpsProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [wiql, setWiql] = useState<string>("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResultResponse | null>(null);

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
    if (!organization || !projectId) {
      setError("Missing organization or project information");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      // Always call the real API with preview mode
      const result = await integrationService.importFromAzureDevOps({
        organizationId: organization._id,
        projectId,
        estimateId, // Optional - can be undefined
        project: selectedProject,
        wiql,
        preview: true, // Preview mode - fetch without saving
      });
      setImportResult(result);
      setViewMode('preview');
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import requirements from Azure DevOps");
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmImport = (selectedRequirements: any[]) => {
    setIsAdding(true);
    try {
      const formattedRequirements = selectedRequirements.map(req => ({
        title: req.title,
        description: req.description,
        source: 'azure_devops' as const,
        sourceReference: req.sourceReference,
      }));
      addRequirements(formattedRequirements);

      setViewMode('form');
      setImportResult(null);
    } catch (err: any) {
      setError("Failed to add requirements");
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancelImport = () => {
    setViewMode('form');
    setImportResult(null);
  };

  if (!isAzureDevOpsConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-default">Azure DevOps Import</h3>
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

  if (viewMode === 'preview' && importResult) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-default">Azure DevOps Import - Review</h3>
        <ImportedRequirementsPreview
          requirements={importResult.data.requirements}
          imported={importResult.data.imported}
          skipped={importResult.data.skipped}
          failed={importResult.data.failed}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
          isAdding={isAdding}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-default">Azure DevOps Import</h3>

      {isLoadingProjects ? (
        <div className="text-sm text-secondary">Loading Azure DevOps projects...</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-default mb-1">
              {t("importForms.azureDevops.selectProject")}
            </label>
            <select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-default rounded-md"
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
            <label className="block text-sm font-medium text-default mb-1">
              {t("importForms.azureDevops.wiql")}
            </label>
            <textarea
              rows={4}
              value={wiql}
              onChange={(e) => setWiql(e.target.value)}
              placeholder="SELECT [System.Id] FROM workitems WHERE [System.WorkItemType] = 'User Story'"
              className="w-full px-3 py-2 border border-border bg-background text-default rounded-md font-mono text-sm"
              disabled={isImporting}
            />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-secondary">
                {t("importForms.azureDevops.commonQueries")}:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setWiql(`SELECT [System.Id] FROM workitems WHERE [System.TeamProject] = '${selectedProject}'`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-default rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  disabled={isImporting}
                >
                  All work items
                </button>
                <button
                  type="button"
                  onClick={() => setWiql(`SELECT [System.Id] FROM workitems WHERE [System.WorkItemType] = 'User Story'`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-default rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  disabled={isImporting}
                >
                  User Stories
                </button>
                <button
                  type="button"
                  onClick={() => setWiql(`SELECT [System.Id] FROM workitems WHERE [System.State] = 'Active'`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-default rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  disabled={isImporting}
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

          <Button
            onClick={handleImport}
            variant="primary"
            disabled={isImporting || !wiql || !projectId}
          >
            {isImporting ? t("requirementImport.importing") : t("requirementImport.addPreview")}
          </Button>
        </>
      )}
    </div>
  );
};
