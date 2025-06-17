"use client";

import { useTranslation } from "react-i18next";
import type { EstimateOverviewResponse } from "@/core/services/estimateService";

interface CalculationsTabProps {
  estimateOverview: EstimateOverviewResponse;
}

export const CalculationsTab = ({ estimateOverview }: CalculationsTabProps) => {
  const { t } = useTranslation("fpa");

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4 text-default">
          {t("calculations.functionPointCalculations")}
        </h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-secondary">
              {t("calculations.unadjustedFunctionPoints")}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-default">
              {estimateOverview.functionPoints.unadjusted}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-secondary">
              {t("calculations.valueAdjustmentFactor")}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-default">
              {
                estimateOverview.generalSystemCharacteristics
                  .valueAdjustmentFactor
              }
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-secondary">
              {t("calculations.adjustedFunctionPoints")}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-primary">
              {estimateOverview.functionPoints.adjusted}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-secondary">
              {t("calculations.totalDegreeOfInfluence")}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-default">
              {
                estimateOverview.generalSystemCharacteristics
                  .totalInfluenceFactor
              }
              /70
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
