import { useState, useCallback } from "react";
import { mutate } from "swr";
import { useOrganizations } from "@/core/hooks/organizations";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import type {
  CreateObjectiveDto,
  CreateQuestionDto,
  CreateMetricDto,
  CreateMeasurementDto,
  MeasurementPlanResponseDto,
} from "@/core/types/plans";

interface UseMeasurementPlanOperationsParams {
  planId: string;
}

export const useMeasurementPlanOperations = (params: UseMeasurementPlanOperationsParams) => {
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { planId } = params;

  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [isUpdatingObjective, setIsUpdatingObjective] = useState(false);
  const [isDeletingObjective, setIsDeletingObjective] = useState(false);

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isUpdatingQuestion, setIsUpdatingQuestion] = useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [isUpdatingMetric, setIsUpdatingMetric] = useState(false);
  const [isDeletingMetric, setIsDeletingMetric] = useState(false);

  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [isUpdatingMeasurement, setIsUpdatingMeasurement] = useState(false);
  const [isDeletingMeasurement, setIsDeletingMeasurement] = useState(false);

  const refreshPlanData = useCallback(async (): Promise<void> => {
    if (!userOrganization) return;

    await mutate(`/measurement-plans/${userOrganization._id}/${planId}`);
    await mutate(`/measurement-plans/${userOrganization._id}`);
  }, [userOrganization, planId]);

  const addObjective = useCallback(
    async (data: CreateObjectiveDto): Promise<MeasurementPlanResponseDto> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsAddingObjective(true);

      try {
        const result = await measurementPlanService.addObjective({
          organizationId: userOrganization._id,
          planId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsAddingObjective(false);
      }
    },
    [userOrganization, planId, refreshPlanData]
  );

  const updateObjective = useCallback(
    async (objectiveId: string, data: CreateObjectiveDto): Promise<MeasurementPlanResponseDto> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsUpdatingObjective(true);

      try {
        const result = await measurementPlanService.updateObjective({
          organizationId: userOrganization._id,
          planId,
          objectiveId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsUpdatingObjective(false);
      }
    },
    [userOrganization, planId, refreshPlanData]
  );

  const deleteObjective = useCallback(
    async (objectiveId: string): Promise<void> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsDeletingObjective(true);

      try {
        await measurementPlanService.deleteObjective({
          organizationId: userOrganization._id,
          planId,
          objectiveId,
        });

        await refreshPlanData();
      } catch (error) {
        throw error;
      } finally {
        setIsDeletingObjective(false);
      }
    },
    [userOrganization, planId, refreshPlanData]
  );

  const addQuestion = useCallback(
    async (objectiveId: string, data: CreateQuestionDto): Promise<MeasurementPlanResponseDto> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsAddingQuestion(true);

      try {
        const result = await measurementPlanService.addQuestion({
          organizationId: userOrganization._id,
          planId,
          objectiveId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsAddingQuestion(false);
      }
    },
    [userOrganization, planId, refreshPlanData]
  );

  const updateQuestion = useCallback(
    async (objectiveId: string, questionId: string, data: CreateQuestionDto): Promise<MeasurementPlanResponseDto> => {
      setIsUpdatingQuestion(true);

      try {
        const result = await measurementPlanService.updateQuestion({
          planId,
          objectiveId,
          questionId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsUpdatingQuestion(false);
      }
    },
    [planId, refreshPlanData]
  );

  const deleteQuestion = useCallback(
    async (objectiveId: string, questionId: string): Promise<void> => {
      setIsDeletingQuestion(true);

      try {
        await measurementPlanService.deleteQuestion({
          planId,
          objectiveId,
          questionId,
        });

        await refreshPlanData();
      } catch (error) {
        throw error;
      } finally {
        setIsDeletingQuestion(false);
      }
    },
    [planId, refreshPlanData]
  );

  const addMetric = useCallback(
    async (objectiveId: string, questionId: string, data: CreateMetricDto): Promise<MeasurementPlanResponseDto> => {
      setIsAddingMetric(true);

      try {
        const result = await measurementPlanService.addMetric({
          planId,
          objectiveId,
          questionId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsAddingMetric(false);
      }
    },
    [planId, refreshPlanData]
  );

  const updateMetric = useCallback(
    async (objectiveId: string, questionId: string, metricId: string, data: CreateMetricDto): Promise<MeasurementPlanResponseDto> => {
      setIsUpdatingMetric(true);

      try {
        const result = await measurementPlanService.updateMetric({
          planId,
          objectiveId,
          questionId,
          metricId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsUpdatingMetric(false);
      }
    },
    [planId, refreshPlanData]
  );

  const deleteMetric = useCallback(
    async (objectiveId: string, questionId: string, metricId: string): Promise<void> => {
      setIsDeletingMetric(true);

      try {
        await measurementPlanService.deleteMetric({
          planId,
          objectiveId,
          questionId,
          metricId,
        });

        await refreshPlanData();
      } catch (error) {
        throw error;
      } finally {
        setIsDeletingMetric(false);
      }
    },
    [planId, refreshPlanData]
  );

  const addMeasurement = useCallback(
    async (objectiveId: string, questionId: string, metricId: string, data: CreateMeasurementDto): Promise<MeasurementPlanResponseDto> => {
      setIsAddingMeasurement(true);

      try {
        const result = await measurementPlanService.addMeasurement({
          planId,
          objectiveId,
          questionId,
          metricId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsAddingMeasurement(false);
      }
    },
    [planId, refreshPlanData]
  );

  const updateMeasurement = useCallback(
    async (objectiveId: string, questionId: string, metricId: string, measurementId: string, data: CreateMeasurementDto): Promise<MeasurementPlanResponseDto> => {
      setIsUpdatingMeasurement(true);

      try {
        const result = await measurementPlanService.updateMeasurement({
          planId,
          objectiveId,
          questionId,
          metricId,
          measurementId,
          data,
        });

        await refreshPlanData();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsUpdatingMeasurement(false);
      }
    },
    [planId, refreshPlanData]
  );

  const deleteMeasurement = useCallback(
    async (objectiveId: string, questionId: string, metricId: string, measurementId: string): Promise<void> => {
      setIsDeletingMeasurement(true);

      try {
        await measurementPlanService.deleteMeasurement({
          planId,
          objectiveId,
          questionId,
          metricId,
          measurementId,
        });

        await refreshPlanData();
      } catch (error) {
        throw error;
      } finally {
        setIsDeletingMeasurement(false);
      }
    },
    [planId, refreshPlanData]
  );

  return {
    isAddingObjective,
    isUpdatingObjective,
    isDeletingObjective,
    addObjective,
    updateObjective,
    deleteObjective,

    isAddingQuestion,
    isUpdatingQuestion,
    isDeletingQuestion,
    addQuestion,
    updateQuestion,
    deleteQuestion,

    isAddingMetric,
    isUpdatingMetric,
    isDeletingMetric,
    addMetric,
    updateMetric,
    deleteMetric,

    isAddingMeasurement,
    isUpdatingMeasurement,
    isDeletingMeasurement,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,

    refreshPlanData,
  };
};