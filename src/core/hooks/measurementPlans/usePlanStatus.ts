import useSWR from "swr";
import { useOrganizations } from "@/core/hooks/organizations";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import type { PlanStatus } from "@/core/types/plans";

interface UsePlanStatusParams {
  planId: string;
}

export const usePlanStatus = (params: UsePlanStatusParams) => {
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { planId } = params;
  const organizationId = userOrganization?._id;

  const swrKey = organizationId && planId ? `/measurement-plans/${organizationId}/${planId}/status` : null;

  const {
    data: status,
    error,
    isLoading,
    mutate: mutateStatus,
  } = useSWR<PlanStatus | null>(
    swrKey,
    async () => {
      if (!organizationId || !planId) return null;
      return measurementPlanService.getPlanStatus({ organizationId, planId });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    status,
    isLoading,
    error,
    mutateStatus,
  };
};
