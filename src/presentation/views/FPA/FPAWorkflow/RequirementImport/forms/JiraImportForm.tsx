"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button, Table } from "@/presentation/components/primitives";
import { Pagination } from "@/presentation/components/primitives/Pagination/Pagination";
import { usePagination } from "@/core/hooks/usePagination";
import { integrationService } from "@/core/services/integrationService";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import { ImportedRequirementsPreview } from "../components/ImportedRequirementsPreview";
import type { Requirement } from "@/core/types/fpa";
import type { JiraProject, ImportResultResponse } from "@/core/types/integrations";

interface JiraImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'jira'; sourceReference?: string }>) => void;
  removeRequirement?: (requirementId: string) => void;
  organizationId?: string;
  projectId?: string;
  estimateId?: string;
}

type ViewMode = 'form' | 'preview';

export const JiraImportForm = ({ requirements, addRequirements, removeRequirement, organizationId, projectId, estimateId }: JiraImportFormProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { isJiraConfigured, organization } = useIntegrationStatus();
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [jql, setJql] = useState<string>("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResultResponse | null>(null);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedRequirements,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({ data: requirements, initialItemsPerPage: 5 });

  useEffect(() => {
    if (isJiraConfigured && organization) {
      loadProjects();
    }
  }, [isJiraConfigured, organization]);

  const loadProjects = async () => {
    if (!organization) return;

    setIsLoadingProjects(true);
    try {
      const response = await integrationService.listJiraProjects(organization._id);
      setProjects(response.projects);
      if (response.projects.length > 0) {
        setSelectedProject(response.projects[0].key);
        setJql(`project = ${response.projects[0].key}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load Jira projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleProjectChange = (projectKey: string) => {
    setSelectedProject(projectKey);
    setJql(`project = ${projectKey}`);
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
      const result = await integrationService.importFromJira({
        organizationId: organization._id,
        projectId,
        estimateId, // Optional - can be undefined
        jql,
        preview: true, // Preview mode - fetch without saving
      });
      setImportResult(result);
      setViewMode('preview');
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import requirements from Jira");
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
        source: 'jira' as const,
        sourceReference: req.sourceReference,
      }));
      addRequirements(formattedRequirements);

      // Reset to form view
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

  if (!isJiraConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-default">Jira Cloud Import</h3>
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
        <h3 className="text-lg font-semibold text-default">Jira Cloud Import - Review</h3>
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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-default">Jira Cloud Import</h3>

        {isLoadingProjects ? (
          <div className="text-sm text-secondary">Loading Jira projects...</div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("importForms.jira.selectProject")}
              </label>
              <select
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background text-default rounded-md"
                disabled={isImporting}
              >
                {projects.map((project) => (
                  <option key={project.key} value={project.key}>
                    {project.key} - {project.name}
                  </option>
                ))}
              </select>
              {projects.length === 0 && (
                <p className="text-xs text-secondary mt-1">
                  {t("importForms.emptyStates.noProjects", { integration: "Jira" })}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-default mb-1">
                  {t("importForms.jira.jql")}
                </label>
                <textarea
                  rows={3}
                  value={jql}
                  onChange={(e) => setJql(e.target.value)}
                  placeholder="project = PROJ AND status = 'To Do'"
                  className="w-full px-3 py-2 border border-border bg-background text-default rounded-md"
                  disabled={isImporting}
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-secondary">
                    {t("importForms.jira.commonFilters")}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setJql(`project = ${selectedProject}`)}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-default rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      disabled={isImporting}
                    >
                      All issues
                    </button>
                    <button
                      type="button"
                      onClick={() => setJql(`project = ${selectedProject} AND status = 'To Do'`)}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-default rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      disabled={isImporting}
                    >
                      Open issues
                    </button>
                    <button
                      type="button"
                      onClick={() => setJql(`project = ${selectedProject} AND type = Story`)}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-default rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      disabled={isImporting}
                    >
                      Stories only
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleImport}
                variant="primary"
                disabled={isImporting || !jql || !projectId || projects.length === 0}
                className="md:self-end"
              >
                {isImporting ? t("requirementImport.importing") : t("importForms.preview.importRequirements")}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </>
        )}
      </div>

      {requirements.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("requirementImport.allRequirements", "All Requirements")} ({requirements.length})
            </h4>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap hidden sm:inline">
                {t("requirementClassification.itemsPerPage")}
              </label>
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap sm:hidden">
                {t("requirementClassification.itemsPerPageShort")}
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="p-4">
            <div className="overflow-x-auto">
              <Table
                columns={[
                  {
                    key: "title",
                    label: t("requirementImport.requirementTitle"),
                    render: (req: Requirement) => (
                      <div className="font-medium text-default">{req.title}</div>
                    ),
                  },
                  {
                    key: "description",
                    label: t("requirementImport.description"),
                    render: (req: Requirement) => (
                      <div className="text-sm text-secondary max-w-md line-clamp-2">
                        {req.description || "-"}
                      </div>
                    ),
                    hideOnMobile: true,
                  },
                  {
                    key: "source",
                    label: t("requirementImport.source"),
                    render: (req: Requirement) => (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                          {req.source}
                        </span>
                        {req.sourceReference && (
                          <div className="text-xs text-secondary mt-1 font-mono">
                            {req.sourceReference}
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "actions",
                    label: t("actions.edit"),
                    render: (req: Requirement) => (
                      removeRequirement && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(req._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium cursor-pointer"
                          title={t("actions.delete", "Delete")}
                        >
                          {t("actions.remove", { defaultValue: "Remove" })}
                        </button>
                      )
                    ),
                  },
                ]}
                data={paginatedRequirements}
                getRowKey={(req) => req._id}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={requirements.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};
