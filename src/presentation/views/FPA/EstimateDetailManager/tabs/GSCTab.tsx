"use client";

import { GSCDisplay } from "@/presentation/views/FPA/common/GSCDisplay";
import { estimateService } from "@/core/services/estimateService";
import { useOrganizations } from "@/core/hooks/organizations";
import type { EstimateOverviewResponse, EstimateResponse } from "@/core/services/estimateService";

interface GSCTabProps {
  estimateOverview: EstimateOverviewResponse;
  estimate?: EstimateResponse | null;
  onUpdate: () => void;
}

export const GSCTab = ({ estimateOverview, estimate, onUpdate }: GSCTabProps) => {
  const { requireOrganization } = useOrganizations();

  const getGSCValues = () => {
    // Try to get GSC values from estimate first, then estimateOverview
    if (estimate && (estimate as any).generalSystemCharacteristics) {
      const gsc = (estimate as any).generalSystemCharacteristics;
      if (Array.isArray(gsc)) {
        return gsc;
      }
    }

    // Fallback to estimateOverview
    const gsc = (estimateOverview as any).generalSystemCharacteristics;
    if (Array.isArray(gsc)) {
      return gsc;
    } else if (gsc && Array.isArray(gsc.values)) {
      return gsc.values;
    } else if (gsc && typeof gsc === "object" && "values" in gsc) {
      const nestedValues = (gsc as { values: number[] }).values;
      return nestedValues;
    }
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Default 14 zeros
  };

  const calculateTotalInfluence = (values: number[]) => {
    return values.reduce((sum, value) => sum + value, 0);
  };

  const calculateValueAdjustmentFactor = (totalInfluence: number) => {
    return (totalInfluence * 0.01) + 0.65;
  };

  const gscValues = getGSCValues();
  const totalInfluence = calculateTotalInfluence(gscValues);
  const valueAdjustmentFactor = calculateValueAdjustmentFactor(totalInfluence);

  return (
    <div className="space-y-6">
      <GSCDisplay
        estimate={{
          _id: estimateOverview._id,
          totalDegreeOfInfluence: totalInfluence,
          valueAdjustmentFactor: valueAdjustmentFactor,
          generalSystemCharacteristics: gscValues,
        }}
        onUpdate={async (generalSystemCharacteristics) => {
          try {
            requireOrganization();
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
