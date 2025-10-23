import { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useOrganizations } from "@/core/hooks/organizations";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import type {
  MeasurementCycle,
  CreateCycleDto,
  UpdateCycleDto,
  CycleWithData,
} from "@/core/types/plans";

interface UseMeasurementCyclesParams {
  planId: string;
  withMeasurements?: boolean;
}

export const useMeasurementCycles = (params: UseMeasurementCyclesParams) => {
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { planId, withMeasurements = false } = params;
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const organizationId = userOrganization?._id;

  const swrKey = organizationId && planId
    ? `/measurement-plans/${organizationId}/${planId}/cycles${withMeasurements ? '-with-measurements' : ''}`
    : null;

  const {
    data: cycles,
    error,
    isLoading,
    mutate: mutateCycles,
  } = useSWR<MeasurementCycle[] | CycleWithData[] | null>(
    swrKey,
    async () => {
      if (!organizationId || !planId) return null;

      if (withMeasurements) {
        return measurementPlanService.getAllCyclesWithMeasurements({ organizationId, planId });
      } else {
        return measurementPlanService.getCycles({ organizationId, planId });
      }
    },
    {
      revalidateOnFocus: false,
    }
  );

  const createCycle = useCallback(
    async (data: CreateCycleDto): Promise<MeasurementCycle> => {
      if (!organizationId || !planId) {
        throw new Error("Organization ID and Plan ID are required");
      }

      setIsCreating(true);
      setOperationError(null);

      try {
        const newCycle = await measurementPlanService.createCycle({
          organizationId,
          planId,
          data,
        });

        // Invalidate both cycles and cycles-with-measurements
        await mutateCycles();
        await mutate(`/measurement-plans/${organizationId}/${planId}/cycles-with-measurements`);

        return newCycle;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create cycle";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsCreating(false);
      }
    },
    [organizationId, planId, mutateCycles]
  );

  const updateCycle = useCallback(
    async (cycleId: string, data: UpdateCycleDto): Promise<MeasurementCycle> => {
      if (!organizationId || !planId) {
        throw new Error("Organization ID and Plan ID are required");
      }

      setIsUpdating(true);
      setOperationError(null);

      try {
        const updatedCycle = await measurementPlanService.updateCycle({
          organizationId,
          planId,
          cycleId,
          data,
        });

        // Invalidate both cycles and cycles-with-measurements
        await mutateCycles();
        await mutate(`/measurement-plans/${organizationId}/${planId}/cycles-with-measurements`);

        return updatedCycle;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update cycle";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    },
    [organizationId, planId, mutateCycles]
  );

  const deleteCycle = useCallback(
    async (cycleId: string): Promise<void> => {
      if (!organizationId || !planId) {
        throw new Error("Organization ID and Plan ID are required");
      }

      setIsDeleting(true);
      setOperationError(null);

      try {
        await measurementPlanService.deleteCycle({
          organizationId,
          planId,
          cycleId,
        });

        // Invalidate both cycles and cycles-with-measurements
        await mutateCycles();
        await mutate(`/measurement-plans/${organizationId}/${planId}/cycles-with-measurements`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete cycle";
        setOperationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    [organizationId, planId, mutateCycles]
  );

  const clearError = useCallback((): void => {
    setOperationError(null);
  }, []);

  return {
    cycles: cycles || [],
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    operationError,
    createCycle,
    updateCycle,
    deleteCycle,
    mutateCycles,
    clearError,
  };
};
