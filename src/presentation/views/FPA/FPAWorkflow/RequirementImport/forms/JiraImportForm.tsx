"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/primitives";
import { integrationService } from "@/core/services/integrationService";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import type { Requirement } from "@/core/types/fpa";
import type { JiraProject } from "@/core/types/integrations";

interface JiraImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'jira' }>) => void;
}

export const JiraImportForm = ({ requirements, addRequirements }: JiraImportFormProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { isJiraConfigured, organization } = useIntegrationStatus();
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [jql, setJql] = useState<string>("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsImporting(true);
    setError(null);

    try {
      const mockRequirements = [
        {
          title: `[${selectedProject}] Sample requirement from JQL: ${jql}`,
          description: "This is a preview. Full Jira import will be available after estimate creation.",
          source: "jira" as const,
        },
      ];

      addRequirements(mockRequirements);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import requirements");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isJiraConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jira Cloud Import</h3>
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jira Cloud Import</h3>

      {isLoadingProjects ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading Jira projects...</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("importForms.jira.selectProject")}
            </label>
            <select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              disabled={isImporting}
            >
              {projects.map((project) => (
                <option key={project.key} value={project.key}>
                  {project.key} - {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("importForms.jira.jql")}
            </label>
            <textarea
              rows={3}
              value={jql}
              onChange={(e) => setJql(e.target.value)}
              placeholder="project = PROJ AND status = 'To Do'"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              disabled={isImporting}
            />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("importForms.jira.commonFilters")}:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setJql(`project = ${selectedProject}`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  All issues
                </button>
                <button
                  type="button"
                  onClick={() => setJql(`project = ${selectedProject} AND status = 'To Do'`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Open issues
                </button>
                <button
                  type="button"
                  onClick={() => setJql(`project = ${selectedProject} AND type = Story`)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Stories only
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
            <p className="mt-1">During estimate creation, requirements are stored temporarily. Full import from Jira will be available after the estimate is created.</p>
          </div>

          <Button
            onClick={handleImport}
            variant="primary"
            disabled={isImporting || !jql}
          >
            {isImporting ? t("requirementImport.importing") : t("requirementImport.addPreview")}
          </Button>
        </>
      )}
    </div>
  );
};
