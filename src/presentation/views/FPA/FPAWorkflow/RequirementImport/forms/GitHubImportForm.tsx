"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/primitives";
import { integrationService } from "@/core/services/integrationService";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import { ImportedRequirementsPreview } from "../components/ImportedRequirementsPreview";
import type { Requirement } from "@/core/types/fpa";
import type { GitHubRepository, ImportResultResponse } from "@/core/types/integrations";

interface GitHubImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'github'; sourceReference?: string }>) => void;
  organizationId?: string;
  projectId?: string;
  estimateId?: string;
}

type ViewMode = 'form' | 'preview';

export const GitHubImportForm = ({ requirements, addRequirements, organizationId, projectId, estimateId }: GitHubImportFormProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { isGitHubConfigured, organization } = useIntegrationStatus();
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [state, setState] = useState<"open" | "closed" | "all">("open");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResultResponse | null>(null);

  useEffect(() => {
    if (isGitHubConfigured && organization) {
      loadRepositories();
    }
  }, [isGitHubConfigured, organization]);

  const loadRepositories = async () => {
    if (!organization) return;

    setIsLoadingRepos(true);
    try {
      const response = await integrationService.listGitHubRepositories(organization._id);
      setRepositories(response.repositories);
      if (response.repositories.length > 0) {
        setSelectedRepo(response.repositories[0].fullName);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load GitHub repositories");
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleImport = async () => {
    if (!organization || !projectId) {
      setError("Missing organization or project information");
      return;
    }

    const repo = repositories.find(r => r.fullName === selectedRepo);
    if (!repo) {
      setError("Please select a repository");
      return;
    }

    const [owner, repoName] = selectedRepo.split('/');

    setIsImporting(true);
    setError(null);

    try {
      // Always call the real API with preview mode
      const result = await integrationService.importFromGitHub({
        organizationId: organization._id,
        projectId,
        estimateId, // Optional - can be undefined
        owner,
        repo: repoName,
        state,
        preview: true, // Preview mode - fetch without saving
      });
      setImportResult(result);
      setViewMode('preview');
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import requirements from GitHub");
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
        source: 'github' as const,
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

  if (!isGitHubConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-default">GitHub Issues Import</h3>
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
        <h3 className="text-lg font-semibold text-default">GitHub Issues Import - Review</h3>
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
      <h3 className="text-lg font-semibold text-default">GitHub Issues Import</h3>

      {isLoadingRepos ? (
        <div className="text-sm text-secondary">Loading GitHub repositories...</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-default mb-1">
              {t("importForms.github.selectRepository")}
            </label>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-default rounded-md"
              disabled={isImporting}
            >
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.fullName}>
                  {repo.fullName} {repo.isPrivate ? "🔒" : ""}
                </option>
              ))}
            </select>
            {repositories.length === 0 && (
              <p className="text-xs text-secondary mt-1">
                No repositories found. Check your GitHub token permissions.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-default mb-1">
              {t("importForms.github.issueState")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setState("open")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  state === "open"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-default hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                disabled={isImporting}
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => setState("closed")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  state === "closed"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-default hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                disabled={isImporting}
              >
                Closed
              </button>
              <button
                type="button"
                onClick={() => setState("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  state === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-default hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                disabled={isImporting}
              >
                All
              </button>
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
            disabled={isImporting || !selectedRepo || !projectId}
          >
            {isImporting ? t("requirementImport.importing") : t("requirementImport.addPreview")}
          </Button>
        </>
      )}
    </div>
  );
};
