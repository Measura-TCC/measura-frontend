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
  complexity: "LOW" | "MEDIUM" | "HIGH";
  functionPoints: number;
  recordElementTypes?: number;
  dataElementTypes?: number;
  fileTypesReferenced?: number;
  // EQ special calculation fields
  inputFtr?: number;
  inputDet?: number;
  outputFtr?: number;
  outputDet?: number;
  // Other fields
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
      `/estimates/${params.estimateId}/components/ilf`
    );
    return response.data;
  },

  getALIComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.get(
      `/estimates/${params.estimateId}/components/ilf/${params.id}`
    );
    return response.data;
  },

  createALIComponent: async (params: {
    estimateId: string;
    data: CreateALIData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/components/ilf`,
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
      `/estimates/${params.estimateId}/components/ilf/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteALIComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/components/ilf/${params.id}`);
  },

  getEIComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${params.estimateId}/components/ei`);
    return response.data;
  },

  createEIComponent: async (params: {
    estimateId: string;
    data: CreateEIData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/components/ei`,
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
      `/estimates/${params.estimateId}/components/ei/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteEIComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/components/ei/${params.id}`);
  },

  getEOComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${params.estimateId}/components/eo`);
    return response.data;
  },

  createEOComponent: async (params: {
    estimateId: string;
    data: CreateEOData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/components/eo`,
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
      `/estimates/${params.estimateId}/components/eo/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteEOComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/components/eo/${params.id}`);
  },

  getEQComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${params.estimateId}/components/eq`);
    return response.data;
  },

  createEQComponent: async (params: {
    estimateId: string;
    data: CreateEQData;
  }): Promise<ComponentResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { useSpecialCalculation, ...backendData } = params.data;
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/components/eq`,
      backendData
    );
    return response.data;
  },

  updateEQComponent: async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateEQData>;
  }): Promise<ComponentResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { useSpecialCalculation, ...backendData } = params.data;
    const response = await measuraApi.put(
      `/estimates/${params.estimateId}/components/eq/${params.id}`,
      backendData
    );
    return response.data;
  },

  deleteEQComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/components/eq/${params.id}`);
  },

  getAIEComponents: async (params: {
    estimateId: string;
  }): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(
      `/estimates/${params.estimateId}/components/eif`
    );
    return response.data;
  },

  createAIEComponent: async (params: {
    estimateId: string;
    data: CreateAIEData;
  }): Promise<ComponentResponse> => {
    const response = await measuraApi.post(
      `/estimates/${params.estimateId}/components/eif`,
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
      `/estimates/${params.estimateId}/components/eif/${params.id}`,
      params.data
    );
    return response.data;
  },

  deleteAIEComponent: async (params: {
    estimateId: string;
    id: string;
  }): Promise<void> => {
    await measuraApi.delete(`/estimates/${params.estimateId}/components/eif/${params.id}`);
  },
};
