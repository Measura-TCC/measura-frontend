import useSWR, { mutate } from "swr";
import { measuraApi } from "@/core/services/measuraApi";

export interface ComponentResponse {
  _id: string;
  name: string;
  description?: string;
  complexity?: "LOW" | "AVERAGE" | "HIGH";
  functionPoints?: number;
  primaryIntent?: string;
  recordElementTypes?: number;
  dataElementTypes?: number;
  fileTypesReferenced?: number;
  derivedData?: boolean;
  outputFormat?: string;
  retrievalLogic?: string;
  externalSystem?: string;
  createdAt: string;
  updatedAt: string;
}

const componentService = {
  getALIComponents: async (
    estimateId: string
  ): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/ilf`);
    return response.data;
  },

  deleteALIComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/ilf/${componentId}`);
  },

  getAIEComponents: async (
    estimateId: string
  ): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/eif`);
    return response.data;
  },

  deleteAIEComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/eif/${componentId}`);
  },

  getEIComponents: async (estimateId: string): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/ei`);
    return response.data;
  },

  deleteEIComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/ei/${componentId}`);
  },

  getEOComponents: async (estimateId: string): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/eo`);
    return response.data;
  },

  deleteEOComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/eo/${componentId}`);
  },

  getEQComponents: async (estimateId: string): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/eq`);
    return response.data;
  },

  deleteEQComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/eq/${componentId}`);
  },
};

export const useALIComponents = (estimateId: string) => {
  const key = estimateId ? `/estimates/${estimateId}/ilf` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateComponents,
  } = useSWR(key, () => componentService.getALIComponents(estimateId));

  return {
    components: data || [],
    error,
    isLoading,
    mutateComponents,
  };
};

export const useAIEComponents = (estimateId: string) => {
  const key = estimateId ? `/estimates/${estimateId}/eif` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateComponents,
  } = useSWR(key, () => componentService.getAIEComponents(estimateId));

  return {
    components: data || [],
    error,
    isLoading,
    mutateComponents,
  };
};

export const useEIComponents = (estimateId: string) => {
  const key = estimateId ? `/estimates/${estimateId}/ei` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateComponents,
  } = useSWR(key, () => componentService.getEIComponents(estimateId));

  return {
    components: data || [],
    error,
    isLoading,
    mutateComponents,
  };
};

export const useEOComponents = (estimateId: string) => {
  const key = estimateId ? `/estimates/${estimateId}/eo` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateComponents,
  } = useSWR(key, () => componentService.getEOComponents(estimateId));

  return {
    components: data || [],
    error,
    isLoading,
    mutateComponents,
  };
};

export const useEQComponents = (estimateId: string) => {
  const key = estimateId ? `/estimates/${estimateId}/eq` : null;

  const {
    data,
    error,
    isLoading,
    mutate: mutateComponents,
  } = useSWR(key, () => componentService.getEQComponents(estimateId));

  return {
    components: data || [],
    error,
    isLoading,
    mutateComponents,
  };
};

export const useComponentActions = () => {
  const deleteALIComponent = async (
    estimateId: string,
    componentId: string
  ) => {
    try {
      await componentService.deleteALIComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/ilf`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteAIEComponent = async (
    estimateId: string,
    componentId: string
  ) => {
    try {
      await componentService.deleteAIEComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/eif`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteEIComponent = async (estimateId: string, componentId: string) => {
    try {
      await componentService.deleteEIComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/ei`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteEOComponent = async (estimateId: string, componentId: string) => {
    try {
      await componentService.deleteEOComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/eo`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteEQComponent = async (estimateId: string, componentId: string) => {
    try {
      await componentService.deleteEQComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/eq`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  return {
    deleteALIComponent,
    deleteAIEComponent,
    deleteEIComponent,
    deleteEOComponent,
    deleteEQComponent,
  };
};
