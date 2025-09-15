import useSWR, { mutate } from "swr";
import { measuraApi } from "@/core/services/measuraApi";

export interface ComponentResponse {
  _id: string;
  name: string;
  description?: string;
  complexity?: "LOW" | "MEDIUM" | "HIGH";
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
    const response = await measuraApi.get(`/estimates/${estimateId}/components/ilf`);
    return response.data;
  },

  deleteALIComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/components/ilf/${componentId}`);
  },

  getAIEComponents: async (
    estimateId: string
  ): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/components/eif`);
    return response.data;
  },

  deleteAIEComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/components/eif/${componentId}`);
  },

  getEIComponents: async (estimateId: string): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/components/ei`);
    return response.data;
  },

  deleteEIComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/components/ei/${componentId}`);
  },

  getEOComponents: async (estimateId: string): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/components/eo`);
    return response.data;
  },

  deleteEOComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/components/eo/${componentId}`);
  },

  getEQComponents: async (estimateId: string): Promise<ComponentResponse[]> => {
    const response = await measuraApi.get(`/estimates/${estimateId}/components/eq`);
    return response.data;
  },

  deleteEQComponent: async (
    estimateId: string,
    componentId: string
  ): Promise<void> => {
    await measuraApi.delete(`/estimates/${estimateId}/components/eq/${componentId}`);
  },
};

export const useALIComponents = (estimateId: string) => {
  const key = estimateId ? `/estimates/${estimateId}/components/ilf` : null;

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
  const key = estimateId ? `/estimates/${estimateId}/components/eif` : null;

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
  const key = estimateId ? `/estimates/${estimateId}/components/ei` : null;

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
  const key = estimateId ? `/estimates/${estimateId}/components/eo` : null;

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
  const key = estimateId ? `/estimates/${estimateId}/components/eq` : null;

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
      await mutate(`/estimates/${estimateId}/components/ilf`);
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
      await mutate(`/estimates/${estimateId}/components/eif`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteEIComponent = async (estimateId: string, componentId: string) => {
    try {
      await componentService.deleteEIComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/components/ei`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteEOComponent = async (estimateId: string, componentId: string) => {
    try {
      await componentService.deleteEOComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/components/eo`);
      await mutate(`/estimates/${estimateId}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteEQComponent = async (estimateId: string, componentId: string) => {
    try {
      await componentService.deleteEQComponent(estimateId, componentId);
      await mutate(`/estimates/${estimateId}/components/eq`);
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
