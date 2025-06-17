"use client";

import { useTranslation } from "react-i18next";
import type { EstimateOverviewResponse } from "@/core/services/estimateService";

interface CostsTabProps {
  estimateOverview: EstimateOverviewResponse;
}

export const CostsTab = ({ estimateOverview }: CostsTabProps) => {
  const { t } = useTranslation("fpa");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4 text-default">
          {t("costs.analysis")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-green-700 mb-1">
              {t("costs.totalCost")}
            </div>
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(
                estimateOverview.costEstimation.estimatedTotalCost
              )}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t("costs.forFunctionPoints", {
                points: estimateOverview.functionPoints.adjusted,
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-700 mb-1">
              {t("costs.costPerFunctionPoint")}
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {formatCurrency(
                estimateOverview.costEstimation.estimatedCostPerFunctionPoint
              )}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {t("costs.averageCostPerFP")}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-700 mb-1">
              {t("costs.costPerPerson")}
            </div>
            <div className="text-2xl font-bold text-purple-800">
              {formatCurrency(
                estimateOverview.costEstimation.estimatedCostPerPerson
              )}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              {t("costs.forTeamMembers", {
                count: estimateOverview.configuration.teamSize,
              })}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-sm font-medium text-amber-700 mb-1">
              {t("costs.hourlyRate")}
            </div>
            <div className="text-2xl font-bold text-amber-800">
              {formatCurrency(estimateOverview.configuration.hourlyRateBRL)}
            </div>
            <div className="text-xs text-amber-600 mt-1">
              {t("costs.perHourPerPerson")}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4 text-default">
          {t("costs.effortBreakdown")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-secondary mb-1">
              {t("costs.totalEffort")}
            </div>
            <div className="text-xl font-bold text-default">
              {estimateOverview.effortEstimation.effort.estimatedEffortHours}
              {t("costs.hours")}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary mb-1">
              {t("costs.duration")}
            </div>
            <div className="text-xl font-bold text-default">
              {estimateOverview.effortEstimation.duration.estimatedDuration}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary mb-1">
              {t("costs.hoursPerPerson")}
            </div>
            <div className="text-xl font-bold text-default">
              {estimateOverview.effortEstimation.effort.hoursPerPerson}
              {t("costs.hours")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
