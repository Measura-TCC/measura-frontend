import useSWR, { mutate } from "swr";
import { estimateService } from "@/core/services/estimateService";
import type {
  CreateEstimateData,
  UpdateEstimateData,
} from "@/core/schemas/fpa";

export const useEstimates = (params?: { projectId?: string }) => {
  const key = params?.projectId
    ? `/estimates?projectId=${params.projectId}`
    : "/estimates";

  const {
    data: estimates,
    error,
    isLoading: isLoadingEstimates,
    mutate: mutateEstimates,
  } = useSWR(key, () => estimateService.getEstimates(params));

  return {
    estimates,
    error,
    isLoadingEstimates,
    mutateEstimates,
  };
};

export const useEstimate = (params: { id: string }) => {
  const key = params.id ? `/estimates/${params.id}` : null;

  const {
    data: estimate,
    error,
    isLoading: isLoadingEstimate,
    mutate: mutateEstimate,
  } = useSWR(key, () => estimateService.getEstimate(params));

  return {
    estimate,
    error,
    isLoadingEstimate,
    mutateEstimate,
  };
};

export const useEstimateActions = () => {
  const createEstimate = async (data: CreateEstimateData) => {
    try {
      const result = await estimateService.createEstimate(data);
      await mutate("/estimates");
      if (data.projectId) {
        await mutate(`/estimates?projectId=${data.projectId}`);
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
      const result = await estimateService.updateEstimate(params);
      await mutate("/estimates");
      await mutate(`/estimates/${params.id}`);
      await mutate(`/estimates/${params.id}/overview`);
      if (params.data.projectId) {
        await mutate(`/estimates?projectId=${params.data.projectId}`);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteEstimate = async (params: { id: string }) => {
    try {
      await estimateService.deleteEstimate(params);
      await mutate("/estimates");
      await mutate(`/estimates/${params.id}`, undefined, {
        revalidate: false,
      });
      await mutate(`/estimates/${params.id}/overview`, undefined, {
        revalidate: false,
      });
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const createNewVersion = async (params: { id: string }) => {
    try {
      const result = await estimateService.createNewVersion(params);
      await mutate("/estimates");
      await mutate(`/estimates/${params.id}`);
      await mutate(`/estimates/${params.id}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const calculateFunctionPoints = async (params: { estimateId: string }) => {
    try {
      const result = await estimateService.calculateFunctionPoints(params);
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const recalculate = async (params: { id: string }) => {
    try {
      const result = await estimateService.recalculate(params);
      await mutate(`/estimates/${params.id}`);
      await mutate(`/estimates/${params.id}/overview`);
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
  const key = params?.projectId
    ? `/estimates?projectId=${params.projectId}&overview=true`
    : "/estimates?overview=true";

  const {
    data: estimatesOverviews,
    error,
    isLoading: isLoadingEstimatesOverviews,
    mutate: mutateEstimatesOverviews,
  } = useSWR(key, () => estimateService.getEstimatesOverviews(params));

  return {
    estimatesOverviews,
    error,
    isLoadingEstimatesOverviews,
    mutateEstimatesOverviews,
  };
};

export const useEstimateOverview = (params: { id: string }) => {
  const key = params.id ? `/estimates/${params.id}/overview` : null;

  const {
    data: estimateOverview,
    error,
    isLoading: isLoadingEstimateOverview,
    mutate: mutateEstimateOverview,
  } = useSWR(key, () => estimateService.getEstimateOverview(params));

  return {
    estimateOverview,
    error,
    isLoadingEstimateOverview,
    mutateEstimateOverview,
  };
};
