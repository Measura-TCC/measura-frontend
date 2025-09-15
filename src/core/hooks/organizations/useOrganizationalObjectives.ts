import useSWR from "swr";
import { organizationService } from "@/core/services/organizationService";
import type { OrganizationObjective } from "@/core/types/plans";
import { useOrganizationStore } from "./useOrganizationStore";

export const useOrganizationalObjectives = (organizationId?: string) => {
  const { activeOrganizationId } = useOrganizationStore();

  // Use the provided organizationId parameter, or fall back to the store value
  const targetOrganizationId = organizationId || activeOrganizationId;

  const {
    data: objectives,
    error,
    isLoading,
    mutate,
  } = useSWR<OrganizationObjective[]>(
    targetOrganizationId
      ? `organizations/${targetOrganizationId}/objectives`
      : null,
    () =>
      organizationService.getObjectives({
        organizationId: targetOrganizationId!,
      }),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    objectives: objectives || [],
    isLoadingObjectives: isLoading,
    objectivesError: error,
    refetchObjectives: mutate,
  };
};
