import { measuraApi } from "./measuraApi";
import type {
  CreateMeasurementPlanDto,
  UpdateMeasurementPlanDto,
  MeasurementPlanSummaryDto,
  MeasurementPlanResponseDto,
  ExportMeasurementPlanDto,
  ExportResponseDto,
  PaginatedResponse,
  CreateObjectiveDto,
  CreateQuestionDto,
  CreateMetricDto,
  CreateMeasurementDto,
} from "@/core/types/plans";

interface GetMeasurementPlansParams {
  organizationId: string;
  page?: number;
  limit?: number;
  status?: string;
  projectId?: string;
  search?: string;
}

interface GetSinglePlanParams {
  organizationId: string;
  planId: string;
}

interface CreatePlanParams {
  organizationId: string;
  data: CreateMeasurementPlanDto;
}

interface UpdatePlanParams {
  organizationId: string;
  planId: string;
  data: UpdateMeasurementPlanDto;
}

interface DeletePlanParams {
  organizationId: string;
  planId: string;
}

interface ExportPlanParams {
  organizationId: string;
  planId: string;
  data: ExportMeasurementPlanDto;
}

interface AddObjectiveParams {
  organizationId: string;
  planId: string;
  data: CreateObjectiveDto;
}

interface UpdateObjectiveParams {
  organizationId: string;
  planId: string;
  objectiveId: string;
  data: CreateObjectiveDto;
}

interface DeleteObjectiveParams {
  organizationId: string;
  planId: string;
  objectiveId: string;
}

interface AddQuestionParams {
  organizationId: string;
  planId: string;
  objectiveId: string;
  data: CreateQuestionDto;
}

interface UpdateQuestionParams {
  planId: string;
  objectiveId: string;
  questionId: string;
  data: CreateQuestionDto;
}

interface DeleteQuestionParams {
  planId: string;
  objectiveId: string;
  questionId: string;
}

interface AddMetricParams {
  planId: string;
  objectiveId: string;
  questionId: string;
  data: CreateMetricDto;
}

interface UpdateMetricParams {
  planId: string;
  objectiveId: string;
  questionId: string;
  metricId: string;
  data: CreateMetricDto;
}

interface DeleteMetricParams {
  planId: string;
  objectiveId: string;
  questionId: string;
  metricId: string;
}

interface AddMeasurementParams {
  planId: string;
  objectiveId: string;
  questionId: string;
  metricId: string;
  data: CreateMeasurementDto;
}

interface UpdateMeasurementParams {
  planId: string;
  objectiveId: string;
  questionId: string;
  metricId: string;
  measurementId: string;
  data: CreateMeasurementDto;
}

interface DeleteMeasurementParams {
  planId: string;
  objectiveId: string;
  questionId: string;
  metricId: string;
  measurementId: string;
}


export const measurementPlanService = {
  getAll: async (params: GetMeasurementPlansParams): Promise<PaginatedResponse<MeasurementPlanSummaryDto>> => {
    const queryParams = new URLSearchParams({
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.status && { status: params.status }),
      ...(params.projectId && { projectId: params.projectId }),
      ...(params.search && { search: params.search }),
    });

    const response = await measuraApi.get(
      `/measurement-plans/${params.organizationId}?${queryParams.toString()}`
    );
    return response.data;
  },

  getById: async (params: GetSinglePlanParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.get(
      `/measurement-plans/${params.organizationId}/${params.planId}`
    );
    return response.data;
  },

  create: async (params: CreatePlanParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.post(
      `/measurement-plans/${params.organizationId}`,
      params.data
    );
    return response.data;
  },

  update: async (params: UpdatePlanParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.put(
      `/measurement-plans/${params.organizationId}/${params.planId}`,
      params.data
    );
    return response.data;
  },

  delete: async (params: DeletePlanParams): Promise<void> => {
    await measuraApi.delete(
      `/measurement-plans/${params.organizationId}/${params.planId}`
    );
  },

  export: async (params: ExportPlanParams): Promise<ExportResponseDto> => {
    const response = await measuraApi.post(
      `/measurement-plans/${params.organizationId}/${params.planId}/export`,
      params.data
    );
    return response.data;
  },

  addObjective: async (params: AddObjectiveParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.post(
      `/measurement-plans/${params.organizationId}/${params.planId}/objectives`,
      params.data
    );
    return response.data;
  },

  updateObjective: async (params: UpdateObjectiveParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.put(
      `/measurement-plans/${params.organizationId}/${params.planId}/objectives/${params.objectiveId}`,
      params.data
    );
    return response.data;
  },

  deleteObjective: async (params: DeleteObjectiveParams): Promise<void> => {
    await measuraApi.delete(
      `/measurement-plans/${params.organizationId}/${params.planId}/objectives/${params.objectiveId}`
    );
  },

  addQuestion: async (params: AddQuestionParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.post(
      `/measurement-plans/${params.organizationId}/${params.planId}/objectives/${params.objectiveId}/questions`,
      params.data
    );
    return response.data;
  },

  updateQuestion: async (params: UpdateQuestionParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.put(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}`,
      params.data
    );
    return response.data;
  },

  deleteQuestion: async (params: DeleteQuestionParams): Promise<void> => {
    await measuraApi.delete(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}`
    );
  },

  addMetric: async (params: AddMetricParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.post(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}/metrics`,
      params.data
    );
    return response.data;
  },

  updateMetric: async (params: UpdateMetricParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.put(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}/metrics/${params.metricId}`,
      params.data
    );
    return response.data;
  },

  deleteMetric: async (params: DeleteMetricParams): Promise<void> => {
    await measuraApi.delete(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}/metrics/${params.metricId}`
    );
  },

  addMeasurement: async (params: AddMeasurementParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.post(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}/metrics/${params.metricId}/measurements`,
      params.data
    );
    return response.data;
  },

  updateMeasurement: async (params: UpdateMeasurementParams): Promise<MeasurementPlanResponseDto> => {
    const response = await measuraApi.put(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}/metrics/${params.metricId}/measurements/${params.measurementId}`,
      params.data
    );
    return response.data;
  },

  deleteMeasurement: async (params: DeleteMeasurementParams): Promise<void> => {
    await measuraApi.delete(
      `/measurement-plans/${params.planId}/objectives/${params.objectiveId}/questions/${params.questionId}/metrics/${params.metricId}/measurements/${params.measurementId}`
    );
  },
};