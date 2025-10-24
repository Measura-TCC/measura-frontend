"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/primitives";
import { integrationService } from "@/core/services/integrationService";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import type { Requirement } from "@/core/types/fpa";
import type { GitHubRepository } from "@/core/types/integrations";

interface GitHubImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'github' }>) => void;
}

export const GitHubImportForm = ({ requirements, addRequirements }: GitHubImportFormProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { isGitHubConfigured, organization } = useIntegrationStatus();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [state, setState] = useState<"open" | "closed" | "all">("open");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsImporting(true);
    setError(null);

    try {
      const repo = repositories.find(r => r.fullName === selectedRepo);
      const mockRequirements = [
        {
          title: `[GitHub] Sample issue from ${repo?.name || selectedRepo}`,
          description: `State: ${state}. This is a preview. Full GitHub import will be available after estimate creation.`,
          source: "github" as const,
        },
      ];

      addRequirements(mockRequirements);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import requirements");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isGitHubConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub Issues Import</h3>
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub Issues Import</h3>

      {isLoadingRepos ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading GitHub repositories...</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("importForms.github.selectRepository")}
            </label>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              disabled={isImporting}
            >
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.fullName}>
                  {repo.fullName} {repo.isPrivate ? "🔒" : ""}
                </option>
              ))}
            </select>
            {repositories.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                No repositories found. Check your GitHub token permissions.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("importForms.github.issueState")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setState("open")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  state === "open"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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

          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-3 rounded-md text-sm">
            <p className="font-medium">Preview Mode</p>
            <p className="mt-1">During estimate creation, requirements are stored temporarily. Full import from GitHub will be available after the estimate is created.</p>
          </div>

          <Button
            onClick={handleImport}
            variant="primary"
            disabled={isImporting || !selectedRepo}
          >
            {isImporting ? t("requirementImport.importing") : t("requirementImport.addPreview")}
          </Button>
        </>
      )}
    </div>
  );
};
