import useSWR, { mutate } from "swr";
import { estimateService } from "@/core/services/estimateService";
import type { RequirementWithFpaData } from "@/core/types/fpa";

export interface UseRequirementsParams {
  estimateId?: string;
}

export const useRequirements = (params: UseRequirementsParams) => {
  const key = params.estimateId
    ? `/estimates/${params.estimateId}/requirements`
    : null;

  const {
    data: requirements,
    error,
    isLoading: isLoadingRequirements,
    mutate: mutateRequirements,
  } = useSWR(key, () =>
    params.estimateId
      ? estimateService.getRequirements({ estimateId: params.estimateId })
      : null
  );

  return {
    requirements,
    error,
    isLoadingRequirements,
    mutateRequirements,
  };
};

export const useRequirement = (params: {
  estimateId: string;
  requirementId: string;
}) => {
  const key =
    params.estimateId && params.requirementId
      ? `/estimates/${params.estimateId}/requirements/${params.requirementId}`
      : null;

  const {
    data: requirement,
    error,
    isLoading: isLoadingRequirement,
    mutate: mutateRequirement,
  } = useSWR(key, () =>
    params.estimateId && params.requirementId
      ? estimateService.getRequirement({
          estimateId: params.estimateId,
          requirementId: params.requirementId,
        })
      : null
  );

  return {
    requirement,
    error,
    isLoadingRequirement,
    mutateRequirement,
  };
};

export const useRequirementActions = () => {
  const updateRequirement = async (params: {
    estimateId: string;
    requirementId: string;
    data: Partial<RequirementWithFpaData>;
  }) => {
    try {
      const result = await estimateService.updateRequirement(params);
      await mutate(`/estimates/${params.estimateId}/requirements`);
      await mutate(
        `/estimates/${params.estimateId}/requirements/${params.requirementId}`
      );
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteRequirement = async (params: {
    estimateId: string;
    requirementId: string;
  }) => {
    try {
      await estimateService.deleteRequirement(params);
      await mutate(`/estimates/${params.estimateId}/requirements`);
      await mutate(
        `/estimates/${params.estimateId}/requirements/${params.requirementId}`,
        undefined,
        { revalidate: false }
      );
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  return {
    updateRequirement,
    deleteRequirement,
  };
};
