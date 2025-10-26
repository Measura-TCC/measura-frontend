"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/core/hooks/auth/useAuth";
import { useToast } from "@/core/hooks/common/useToast";
import { canChangeEstimateStatus } from "@/core/utils/permissions";
import { estimateService } from "@/core/services/estimateService";
import type { EstimateStatus } from "@/core/types/fpa";

interface EstimateStatusSelectorProps {
  estimateId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: EstimateStatus) => void;
  disabled?: boolean;
}

export const EstimateStatusSelector: React.FC<EstimateStatusSelectorProps> = ({
  estimateId,
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const { t } = useTranslation("fpa");
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(currentStatus);

  const canChangeStatus = canChangeEstimateStatus(user?.role);

  const STATUS_OPTIONS = [
    {
      value: "draft",
      label: t("status.draft"),
      color: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
    },
    {
      value: "finalized",
      label: t("status.finalized"),
      color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    },
    {
      value: "archived",
      label: t("status.archived"),
      color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    },
  ] as const;

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    if (!estimateId || estimateId === 'undefined') {
      const errorMsg = t("statusUpdateError", "Failed to update estimate status") + ": Invalid estimate ID";
      setError(errorMsg);
      toast.error({ message: errorMsg });
      console.error("Invalid estimateId:", estimateId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await estimateService.updateEstimateStatus(estimateId, newStatus as EstimateStatus);
      setStatus(newStatus);

      toast.success({
        message: t("statusUpdatedSuccess", {
          status: t(`status.${newStatus}`),
          defaultValue: `Status updated to ${newStatus}`
        })
      });

      onStatusChange?.(newStatus as EstimateStatus);
    } catch (err) {
      let errorMessage = t("statusUpdateError", "Failed to update estimate status");

      // Parse backend error
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as any).response;
        if (response?.data?.message) {
          errorMessage = Array.isArray(response.data.message)
            ? response.data.message[0]
            : response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error({ message: errorMessage });
      console.error("Failed to update estimate status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find(
    (option) => option.value === status.toLowerCase()
  );

  const isDisabled = isLoading || disabled || !canChangeStatus;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-default">
          Status:
        </label>
        {currentStatusOption && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatusOption.color}`}
          >
            {currentStatusOption.label}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={status.toLowerCase()}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isDisabled}
          className={`block w-full pl-3 pr-10 py-2 text-base border border-border bg-background text-default focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${!isDisabled ? 'cursor-pointer' : ''}`}
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

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!canChangeStatus && !disabled && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("statusChangePermissionRequired", "Only administrators and project managers can change status")}
        </p>
      )}
    </div>
  );
};
