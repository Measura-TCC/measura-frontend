"use client";

import { useTranslation } from "react-i18next";
import { EnhancedOverview } from "@/presentation/views/FPA/common/EnhancedOverview";
import type { EstimateOverviewResponse } from "@/core/services/estimateService";

interface OverviewTabProps {
  estimateOverview?: EstimateOverviewResponse;
  isLoadingEstimateOverview: boolean;
  overviewError?: Error | null;
}

export const EstimateOverviewTab = ({
  estimateOverview,
  isLoadingEstimateOverview,
  overviewError,
}: OverviewTabProps) => {
  const { t } = useTranslation("fpa");

  if (isLoadingEstimateOverview) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-background-secondary h-32 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-pulse bg-background-secondary h-48 rounded-lg"></div>
          <div className="animate-pulse bg-background-secondary h-48 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{t("errors.loadingMessage")}</p>
      </div>
    );
  }

  if (!estimateOverview) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <p className="text-amber-700">{t("messages.noOverviewData")}</p>
      </div>
    );
  }

  return <EnhancedOverview estimateOverview={estimateOverview} />;
};
