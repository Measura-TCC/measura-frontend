"use client";

import { GSCDisplay } from "@/presentation/views/FPA/common/GSCDisplay";
import { estimateService } from "@/core/services/estimateService";
import type { EstimateOverviewResponse } from "@/core/services/estimateService";

interface GSCTabProps {
  estimateOverview: EstimateOverviewResponse;
  onUpdate: () => void;
}

export const GSCTab = ({ estimateOverview, onUpdate }: GSCTabProps) => {
  const getGSCValues = () => {
    const values = estimateOverview.generalSystemCharacteristics.values;

    if (Array.isArray(values)) {
      return values;
    } else if (values && typeof values === "object" && "values" in values) {
      const nestedValues = (values as { values: number[] }).values;
      return nestedValues;
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <GSCDisplay
        estimate={{
          _id: estimateOverview._id,
          totalDegreeOfInfluence:
            estimateOverview.generalSystemCharacteristics.totalInfluenceFactor,
          valueAdjustmentFactor:
            estimateOverview.generalSystemCharacteristics.valueAdjustmentFactor,
          generalSystemCharacteristics: getGSCValues(),
        }}
        onUpdate={async (generalSystemCharacteristics) => {
          try {
            await estimateService.updateEstimate({
              id: estimateOverview._id,
              data: { generalSystemCharacteristics },
            });
            onUpdate();
          } catch (error) {
            console.error("Failed to update GSC:", error);
          }
        }}
      />
    </div>
  );
};
