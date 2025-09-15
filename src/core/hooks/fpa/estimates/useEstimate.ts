import useSWR, { mutate } from "swr";
import { estimateService } from "@/core/services/estimateService";
import { useOrganization } from "@/core/hooks/organizations/useOrganization";
import type {
  CreateEstimateData,
  UpdateEstimateData,
} from "@/core/schemas/fpa";

export const useEstimates = (params?: { projectId?: string }) => {
  const { activeOrganizationId } = useOrganization();

  const key = activeOrganizationId
    ? (params?.projectId
        ? `/estimates/${activeOrganizationId}?projectId=${params.projectId}`
        : `/estimates/${activeOrganizationId}`)
    : null;

  const {
    data: estimates,
    error,
    isLoading: isLoadingEstimates,
    mutate: mutateEstimates,
  } = useSWR(key, () =>
    activeOrganizationId ? estimateService.getEstimates(params) : null
  );

  return {
    estimates,
    error,
    isLoadingEstimates,
    mutateEstimates,
  };
};

export const useEstimate = (params: { id: string }) => {
  const { activeOrganizationId } = useOrganization();

  const key = params.id && activeOrganizationId ? `/estimates/${activeOrganizationId}/${params.id}` : null;

  const {
    data: estimate,
    error,
    isLoading: isLoadingEstimate,
    mutate: mutateEstimate,
  } = useSWR(key, () =>
    activeOrganizationId ? estimateService.getEstimate({ id: params.id }) : null
  );

  return {
    estimate,
    error,
    isLoadingEstimate,
    mutateEstimate,
  };
};

export const useEstimateActions = () => {
  const { requireOrganization } = useOrganization();

  const createEstimate = async (data: CreateEstimateData) => {
    try {
      const organizationId = requireOrganization();
      const result = await estimateService.createEstimate(data);
      await mutate(`/estimates/${organizationId}`);
      if (data.projectId) {
        await mutate(`/estimates/${organizationId}?projectId=${data.projectId}`);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateEstimate = async (params: {
    id: string;
    data: UpdateEstimateData;
  }) => {
    try {
      const organizationId = requireOrganization();
      const result = await estimateService.updateEstimate(params);
      await mutate(`/estimates/${organizationId}`);
      await mutate(`/estimates/${organizationId}/${params.id}`);
      await mutate(`/estimates/${organizationId}/${params.id}/overview`);
      if (params.data.projectId) {
        await mutate(`/estimates/${organizationId}?projectId=${params.data.projectId}`);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteEstimate = async (params: { id: string }) => {
    try {
      const organizationId = requireOrganization();
      await estimateService.deleteEstimate(params);
      await mutate(`/estimates/${organizationId}`);
      await mutate(`/estimates/${organizationId}/${params.id}`, undefined, {
        revalidate: false,
      });
      await mutate(`/estimates/${organizationId}/${params.id}/overview`, undefined, {
        revalidate: false,
      });
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const createNewVersion = async (params: { id: string }) => {
    try {
      const organizationId = requireOrganization();
      const result = await estimateService.createNewVersion(params);
      await mutate(`/estimates/${organizationId}`);
      await mutate(`/estimates/${organizationId}/${params.id}`);
      await mutate(`/estimates/${organizationId}/${params.id}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const calculateFunctionPoints = async (params: { estimateId: string }) => {
    try {
      const organizationId = requireOrganization();
      const result = await estimateService.calculateFunctionPoints(params);
      await mutate(`/estimates/${organizationId}/${params.estimateId}`);
      await mutate(`/estimates/${organizationId}/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const recalculate = async (params: { id: string }) => {
    try {
      const organizationId = requireOrganization();
      const result = await estimateService.recalculate(params);
      await mutate(`/estimates/${organizationId}/${params.id}`);
      await mutate(`/estimates/${organizationId}/${params.id}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    createEstimate,
    updateEstimate,
    deleteEstimate,
    createNewVersion,
    calculateFunctionPoints,
    recalculate,
  };
};

export const useEstimatesOverviews = (params?: { projectId?: string }) => {
  const { activeOrganizationId } = useOrganization();

  const key = activeOrganizationId
    ? (params?.projectId
        ? `/estimates/${activeOrganizationId}?projectId=${params.projectId}&overview=true`
        : `/estimates/${activeOrganizationId}?overview=true`)
    : null;

  const {
    data: estimatesOverviews,
    error,
    isLoading: isLoadingEstimatesOverviews,
    mutate: mutateEstimatesOverviews,
  } = useSWR(key, () =>
    activeOrganizationId ? estimateService.getEstimatesOverviews(params) : null
  );

  return {
    estimatesOverviews,
    error,
    isLoadingEstimatesOverviews,
    mutateEstimatesOverviews,
  };
};

export const useEstimateOverview = (params: { id: string }) => {
  const { activeOrganizationId } = useOrganization();

  const key = params.id && activeOrganizationId ? `/estimates/${activeOrganizationId}/${params.id}/overview` : null;

  const {
    data: estimateOverview,
    error,
    isLoading: isLoadingEstimateOverview,
    mutate: mutateEstimateOverview,
  } = useSWR(key, () =>
    activeOrganizationId ? estimateService.getEstimateOverview({ id: params.id }) : null
  );

  return {
    estimateOverview,
    error,
    isLoadingEstimateOverview,
    mutateEstimateOverview,
  };
};
