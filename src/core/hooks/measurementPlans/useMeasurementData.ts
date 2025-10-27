import { useState, useCallback } from "react";
import { mutate } from "swr";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import type {
  CreateMeasurementDataDto,
  UpdateMeasurementDataDto,
  MeasurementData,
} from "@/core/types/plans";

interface AddMeasurementDataParams {
  organizationId: string;
  planId: string;
  objectiveId: string;
  questionId: string;
  metricId: string;
  data: CreateMeasurementDataDto;
}

interface UpdateMeasurementDataParams {
  organizationId: string;
  planId: string;
  measurementDataId: string;
  data: UpdateMeasurementDataDto;
}

interface DeleteMeasurementDataParams {
  organizationId: string;
  planId: string;
  measurementDataId: string;
}

export const useMeasurementData = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const addMeasurementData = useCallback(
    async (params: AddMeasurementDataParams): Promise<MeasurementData> => {
      setIsAdding(true);
      setOperationError(null);

      try {
        const newMeasurement = await measurementPlanService.addMeasurementData(params);

        // Revalidate cycles and measurements
        await mutate(`/measurement-plans/${params.organizationId}/${params.planId}/cycles-with-measurements`);
        await mutate(`/measurement-plans/${params.organizationId}/${params.planId}/cycles`);
        await mutate(`/measurement-plans/${params.organizationId}/${params.planId}/status`);

        // Revalidate metric calculations for this cycle
        // This triggers immediate recalculation when user adds measurement
        await mutate(
          (key) =>
            typeof key === 'string' &&
            key.includes(`/organizations/${params.organizationId}/measurement-plans/${params.planId}/cycles/${params.data.cycleId}/metrics/`) &&
            key.includes('/calculate')
        );

        return newMeasurement;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to add measurement data";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsAdding(false);
      }
    },
    []
  );

  const updateMeasurementData = useCallback(
    async (params: UpdateMeasurementDataParams): Promise<MeasurementData> => {
      setIsUpdating(true);
      setOperationError(null);

      try {
        const updatedMeasurement = await measurementPlanService.updateMeasurementData(params);

        await mutate(`/measurement-plans/${params.organizationId}/${params.planId}/cycles-with-measurements`);
        await mutate(`/measurement-plans/${params.organizationId}/${params.planId}/status`);

        // Revalidate all metric calculations for this plan
        await mutate(
          (key) =>
            typeof key === 'string' &&
            key.includes(`/organizations/${params.organizationId}/measurement-plans/${params.planId}/cycles/`) &&
            key.includes('/calculate')
        );

        return updatedMeasurement;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update measurement data";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const deleteMeasurementData = useCallback(
    async (params: DeleteMeasurementDataParams): Promise<void> => {
      setIsDeleting(true);
      setOperationError(null);

      try {
        await measurementPlanService.deleteMeasurementData(params);

        await mutate(`/measurement-plans/${params.organizationId}/${params.planId}/cycles-with-measurements`);
        await mutate(`/measurement-plans/${params.organizationId}/${params.planId}/status`);

        // Revalidate all metric calculations for this plan
        await mutate(
          (key) =>
            typeof key === 'string' &&
            key.includes(`/organizations/${params.organizationId}/measurement-plans/${params.planId}/cycles/`) &&
            key.includes('/calculate')
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete measurement data";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  const clearError = useCallback((): void => {
    setOperationError(null);
  }, []);

  return {
    addMeasurementData,
    updateMeasurementData,
    deleteMeasurementData,
    isAdding,
    isUpdating,
    isDeleting,
    operationError,
    clearError,
  };
};
