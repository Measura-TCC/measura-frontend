import { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import {
  MeasurementPlanStatus,
} from "@/core/types/plans";
import type {
  CreateMeasurementPlanDto,
  UpdateMeasurementPlanDto,
  MeasurementPlanResponseDto,
  PlansStatistics,
} from "@/core/types/plans";

interface UseMeasurementPlanParams {
  page?: number;
  limit?: number;
  status?: MeasurementPlanStatus;
  projectId?: string;
  search?: string;
}

interface UseSingleMeasurementPlanParams {
  planId?: string;
}

export const useMeasurementPlans = (params: UseMeasurementPlanParams = {}) => {
  const { userOrganization } = useUserOrganization();
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const { page = 1, limit = 10, status, projectId, search } = params;

  const swrKey = userOrganization
    ? `/measurement-plans/${userOrganization._id}?page=${page}&limit=${limit}&status=${status || ''}&projectId=${projectId || ''}&search=${search || ''}`
    : null;

  const {
    data: plansResponse,
    error: plansError,
    isLoading: isLoadingPlans,
    mutate: mutatePlans,
  } = useSWR(
    swrKey,
    () => {
      if (!userOrganization) return null;
      return measurementPlanService.getAll({
        organizationId: userOrganization._id,
        page,
        limit,
        status,
        projectId,
        search,
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  const plans = plansResponse?.data;
  const pagination = plansResponse?.pagination;

  const statistics: PlansStatistics = {
    totalPlans: pagination?.total || 0,
    activePlans: plans?.filter((p) => p.status === MeasurementPlanStatus.ACTIVE).length || 0,
    completedPlans: plans?.filter((p) => p.status === MeasurementPlanStatus.COMPLETED).length || 0,
    draftPlans: plans?.filter((p) => p.status === MeasurementPlanStatus.DRAFT).length || 0,
    averageProgress: plans?.length
      ? Math.round(plans.reduce((sum, p) => sum + p.progress, 0) / plans.length)
      : 0,
    totalObjectives: plans?.reduce((sum, p) => sum + p.objectivesCount, 0) || 0,
    totalQuestions: plans?.reduce((sum, p) => sum + p.questionsCount, 0) || 0,
    totalMetrics: plans?.reduce((sum, p) => sum + p.metricsCount, 0) || 0,
    totalMeasurements: plans?.reduce((sum, p) => sum + p.measurementsCount, 0) || 0,
  };

  const createPlan = useCallback(
    async (data: CreateMeasurementPlanDto): Promise<MeasurementPlanResponseDto> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsCreatingPlan(true);
      setOperationError(null);

      try {
        const newPlan = await measurementPlanService.create({
          organizationId: userOrganization._id,
          data,
        });

        await mutatePlans();

        return newPlan;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create plan";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsCreatingPlan(false);
      }
    },
    [userOrganization, mutatePlans]
  );

  const updatePlan = useCallback(
    async (planId: string, data: UpdateMeasurementPlanDto): Promise<MeasurementPlanResponseDto> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsUpdatingPlan(true);
      setOperationError(null);

      try {
        const updatedPlan = await measurementPlanService.update({
          organizationId: userOrganization._id,
          planId,
          data,
        });

        await mutatePlans();

        await mutate(`/measurement-plans/${userOrganization._id}/${planId}`);

        return updatedPlan;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update plan";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUpdatingPlan(false);
      }
    },
    [userOrganization, mutatePlans]
  );

  const deletePlan = useCallback(
    async (planId: string): Promise<void> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsDeletingPlan(true);
      setOperationError(null);

      try {
        await measurementPlanService.delete({
          organizationId: userOrganization._id,
          planId,
        });

        await mutatePlans();

        await mutate(`/measurement-plans/${userOrganization._id}/${planId}`, undefined, false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete plan";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsDeletingPlan(false);
      }
    },
    [userOrganization, mutatePlans]
  );


  const getStatusColor = (status: MeasurementPlanStatus): string => {
    switch (status) {
      case MeasurementPlanStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case MeasurementPlanStatus.ACTIVE:
        return "bg-blue-100 text-blue-800";
      case MeasurementPlanStatus.DRAFT:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const refreshData = useCallback(async (): Promise<void> => {
    await mutatePlans();
  }, [mutatePlans]);

  const clearError = useCallback((): void => {
    setOperationError(null);
  }, []);

  return {
    plans,
    pagination,
    statistics,
    isLoadingPlans,
    isCreatingPlan,
    isUpdatingPlan,
    isDeletingPlan,
    plansError,
    createPlan,
    updatePlan,
    deletePlan,
    getStatusColor,
    formatDate,
    refreshData,
    canCreatePlan: Boolean(userOrganization),
    hasOrganization: Boolean(userOrganization),
    operationError,
    clearError,
  };
};

export const useMeasurementPlan = (params: UseSingleMeasurementPlanParams) => {
  const { userOrganization } = useUserOrganization();
  const { planId } = params;

  const swrKey = userOrganization && planId
    ? `/measurement-plans/${userOrganization._id}/${planId}`
    : null;

  const {
    data: plan,
    error: planError,
    isLoading: isLoadingPlan,
    mutate: mutatePlan,
  } = useSWR(
    swrKey,
    () => {
      if (!userOrganization || !planId) return null;
      return measurementPlanService.getById({
        organizationId: userOrganization._id,
        planId,
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    plan,
    planError,
    isLoadingPlan,
    mutatePlan,
  };
};