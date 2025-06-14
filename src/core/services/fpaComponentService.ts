import { measuraApi } from "./measuraApi";
import type {
  CreateALIData,
  CreateEIData,
  CreateEOData,
  CreateEQData,
  CreateAIEData,
} from "@/core/schemas/fpa";

export interface ComponentResponse {
  id: string;
  name: string;
  description: string;
  primaryIntent: string;
  complexity: "LOW" | "AVERAGE" | "HIGH";
  functionPoints: number;
  recordElementTypes?: number;
  dataElementTypes?: number;
  fileTypesReferenced?: number;
  derivedData?: boolean;
  outputFormat?: string;
  retrievalLogic?: string;
  externalSystem?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const fpaComponentService = {
  getALIComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(
      `/estimates/${params.estimateId}/ilf`
    );
    return response.data;
  },

  getALIComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.get(
      `/estimates/${params.estimateId}/ilf/${params.id}`
    );
    return response.data;
  },

  createALIComponent: async (params: {
    estimateId: string;
    data: CreateALIData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/ilf`,
      params.data
    );
    return response.data;
  },

  updateALIComponent: async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateALIData>;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.put(
      `/estimates/${params.estimateId}/ilf/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteALIComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/ilf/${params.id}`);
  },

  getEIComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${params.estimateId}/ei`);
    return response.data;
  },

  createEIComponent: async (params: {
    estimateId: string;
    data: CreateEIData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/ei`,
      params.data
    );
    return response.data;
  },

  updateEIComponent: async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateEIData>;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.put(
      `/estimates/${params.estimateId}/ei/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteEIComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/ei/${params.id}`);
  },

  getEOComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${params.estimateId}/eo`);
    return response.data;
  },

  createEOComponent: async (params: {
    estimateId: string;
    data: CreateEOData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/eo`,
      params.data
    );
    return response.data;
  },

  updateEOComponent: async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateEOData>;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.put(
      `/estimates/${params.estimateId}/eo/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteEOComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/eo/${params.id}`);
  },

  getEQComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${params.estimateId}/eq`);
    return response.data;
  },

  createEQComponent: async (params: {
    estimateId: string;
    data: CreateEQData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/eq`,
      params.data
    );
    return response.data;
  },

  updateEQComponent: async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateEQData>;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.put(
      `/estimates/${params.estimateId}/eq/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteEQComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/eq/${params.id}`);
  },

  getAIEComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(
      `/estimates/${params.estimateId}/eif`
    );
    return response.data;
  },

  createAIEComponent: async (params: {
    estimateId: string;
    data: CreateAIEData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/eif`,
      params.data
    );
    return response.data;
  },

  updateAIEComponent: async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateAIEData>;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.put(
      `/estimates/${params.estimateId}/eif/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteAIEComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/eif/${params.id}`);
  },
};
