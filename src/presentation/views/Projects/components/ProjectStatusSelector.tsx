"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjectActions } from "@/core/hooks/projects/useProjects";
import type { Project } from "@/core/schemas/projects";

interface ProjectStatusSelectorProps {
  project: Project;
  onStatusChange?: (newStatus: Project["status"]) => void;
}

export const ProjectStatusSelector: React.FC<ProjectStatusSelectorProps> = ({
  project,
  onStatusChange,
}) => {
  const { t } = useTranslation("projects");
  const { updateProject } = useProjectActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STATUS_OPTIONS = [
    {
      value: "PLANNING",
      label: t("statusPlanning"),
      color: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
    },
    {
      value: "IN_PROGRESS",
      label: t("statusInProgress"),
      color: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
    },
    {
      value: "COMPLETED",
      label: t("statusCompleted"),
      color: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
    },
    {
      value: "ARCHIVED",
      label: t("statusArchived"),
      color: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
    },
  ] as const;

  const handleStatusChange = async (newStatus: Project["status"]) => {
    if (newStatus === project.status) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedProject = await updateProject({
        id: project._id,
        data: { status: newStatus },
      });
      onStatusChange?.(updatedProject.status);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update project status";
      setError(errorMessage);
      console.error("Failed to update project status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = STATUS_OPTIONS.find(
    (option) => option.value === project.status
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-default">
        {t("status")}
      </label>

      <div className="relative">
        <select
          value={project.status}
          onChange={(e) =>
            handleStatusChange(e.target.value as Project["status"])
          }
          disabled={isLoading}
          className="block w-full pl-3 pr-10 py-2 text-base border border-border bg-background text-default focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-md disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="animate-spin h-4 w-4 text-secondary"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {currentStatus && (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}
        >
          {currentStatus.label}
        </span>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
