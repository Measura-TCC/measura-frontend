import useSWR from "swr";
import { useOrganizations } from "@/core/hooks/organizations";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import type { CycleWithData } from "@/core/types/plans";

interface UseCycleWithMeasurementsParams {
  planId: string;
  cycleId: string;
}

export const useCycleWithMeasurements = (params: UseCycleWithMeasurementsParams) => {
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { planId, cycleId } = params;
  const organizationId = userOrganization?._id;

  const swrKey = organizationId && planId && cycleId
    ? `/measurement-plans/${organizationId}/${planId}/cycles/${cycleId}/measurements`
    : null;

  const {
    data: cycleData,
    error,
    isLoading,
    mutate: mutateCycleData,
  } = useSWR<CycleWithData>(
    swrKey,
    async () => {
      if (!organizationId || !planId || !cycleId) return null;
      return measurementPlanService.getCycleWithMeasurements({ organizationId, planId, cycleId });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    cycleData,
    isLoading,
    error,
    mutateCycleData,
  };
};
