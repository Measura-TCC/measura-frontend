"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/primitives";
import { integrationService } from "@/core/services/integrationService";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import type { Requirement } from "@/core/types/fpa";
import type { ClickUpList } from "@/core/types/integrations";

interface ClickUpImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'clickup' }>) => void;
}

export const ClickUpImportForm = ({ requirements, addRequirements }: ClickUpImportFormProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { isClickUpConfigured, organization } = useIntegrationStatus();
  const [lists, setLists] = useState<ClickUpList[]>([]);
  const [selectedList, setSelectedList] = useState<string>("");
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isClickUpConfigured && organization) {
      loadLists();
    }
  }, [isClickUpConfigured, organization]);

  const loadLists = async () => {
    if (!organization) return;

    setIsLoadingLists(true);
    try {
      const response = await integrationService.listClickUpLists(organization._id);
      setLists(response.lists);
      if (response.lists.length > 0) {
        setSelectedList(response.lists[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load ClickUp lists");
    } finally {
      setIsLoadingLists(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);

    try {
      const list = lists.find(l => l.id === selectedList);
      const mockRequirements = [
        {
          title: `[ClickUp] Sample task from ${list?.name || selectedList}`,
          description: `Space: ${list?.spaceName || 'N/A'}. This is a preview. Full ClickUp import will be available after estimate creation.`,
          source: "clickup" as const,
        },
      ];

      addRequirements(mockRequirements);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import requirements");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isClickUpConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ClickUp Import</h3>
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ClickUp Import</h3>

      {isLoadingLists ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading ClickUp lists...</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("importForms.clickup.selectList")}
            </label>
            <select
              value={selectedList}
              onChange={(e) => setSelectedList(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              disabled={isImporting}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.spaceName} / {list.folderName || 'Root'} / {list.name}
                </option>
              ))}
            </select>
            {lists.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                No lists found. Check your ClickUp token permissions.
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-3 rounded-md text-sm">
            <p className="font-medium">Preview Mode</p>
            <p className="mt-1">During estimate creation, requirements are stored temporarily. Full import from ClickUp will be available after the estimate is created.</p>
          </div>

          <Button
            onClick={handleImport}
            variant="primary"
            disabled={isImporting || !selectedList}
          >
            {isImporting ? t("requirementImport.importing") : t("requirementImport.addPreview")}
          </Button>
        </>
      )}
    </div>
  );
};
