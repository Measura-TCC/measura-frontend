"use client";

import { GSCDisplay } from "@/presentation/views/FPA/common/GSCDisplay";
import { estimateService } from "@/core/services/estimateService";
import type { EstimateOverviewResponse } from "@/core/services/estimateService";

interface GSCTabProps {
  estimateOverview: EstimateOverviewResponse;
  onUpdate: () => void;
}

export const GSCTab = ({ estimateOverview, onUpdate }: GSCTabProps) => {
  return (
    <div className="space-y-6">
      <GSCDisplay
        estimate={{
          _id: estimateOverview._id,
          totalDegreeOfInfluence:
            estimateOverview.generalSystemCharacteristics.totalInfluenceFactor,
          valueAdjustmentFactor:
            estimateOverview.generalSystemCharacteristics.valueAdjustmentFactor,
          generalSystemCharacteristics:
            estimateOverview.generalSystemCharacteristics.values.values,
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
