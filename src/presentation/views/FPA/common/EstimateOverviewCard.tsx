"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import type { EstimateOverview } from "@/core/services/estimateService";

interface EstimateOverviewCardProps {
  estimate: EstimateOverview;
  onClick?: () => void;
}

export const EstimateOverviewCard = ({
  estimate,
  onClick,
}: EstimateOverviewCardProps) => {
  const { t, i18n } = useTranslation("fpa");
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FINALIZED":
        return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "DRAFT":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
      case "ARCHIVED":
        return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getCountTypeLabel = (countType: string) => {
    switch (countType) {
      case "DEVELOPMENT_PROJECT":
        return t("forms.developmentProject");
      case "ENHANCEMENT_PROJECT":
        return t("forms.enhancementProject");
      case "APPLICATION_PROJECT":
        return t("forms.applicationBaseline");
      default:
        return countType;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '-';
    const locale = i18n.language === "pt" ? "pt-BR" : "en-US";
    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0";
    }
    return Number(value.toFixed(2)).toString();
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/fpa/estimates/${estimate._id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {estimate.name}
          </h3>
          {estimate.project && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {estimate.project.name}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {getCountTypeLabel(estimate.countType)}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
              estimate.status
            )}`}
          >
            {t(`status.${estimate.status?.toLowerCase() || 'draft'}`)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">v{estimate.version}</span>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              estimate.hasComponents ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("workflow.components.title", "Components")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              estimate.hasGSC || estimate.valueAdjustmentFactor ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">GSC</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              estimate.isCalculated ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("workflow.calculated", "Calculated")}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("workflow.adjustedFunctionPoints", "Adjusted Function Points")}
            </p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatNumber(
                estimate.adjustedFunctionPoints ||
                  estimate.unadjustedFunctionPoints ||
                  0
              )}
            </p>
          </div>
          {estimate.valueAdjustmentFactor &&
            estimate.valueAdjustmentFactor !== 1 && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t("calculations.vaf")}</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatNumber(estimate.valueAdjustmentFactor)}
                </p>
              </div>
            )}
        </div>
        {estimate.estimatedEffortHours && estimate.estimatedEffortHours > 0 && (
          <div className="mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("workflow.estimatedEffort", "Estimated Effort")}
            </p>
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {formatNumber(estimate.estimatedEffortHours)} {t("costs.hours")}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {estimate.componentCounts?.ilf || 0}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t("workflow.components.aliLabel")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {estimate.componentCounts?.eif || 0}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t("workflow.components.aieLabel")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {estimate.componentCounts?.ei || 0}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t("workflow.components.eiLabel")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {estimate.componentCounts?.eo || 0}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t("workflow.components.eoLabel")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {estimate.componentCounts?.eq || 0}
          </p>
          <p className="text-xs text-gray-400">
            {t("workflow.components.eqLabel")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
        <span>
          {t("overview.createdAt", "Created")}: {formatDate(estimate.createdAt)}
        </span>
        <span>
          {estimate.totalComponents || 0} {t("totalComponents", "components")}
        </span>
      </div>
    </div>
  );
};
