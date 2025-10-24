import useSWR, { mutate } from "swr";
import { fpaComponentService } from "@/core/services/fpaComponentService";
import type {
  CreateALIData,
  CreateEIData,
  CreateEOData,
  CreateEQData,
  CreateAIEData,
} from "@/core/schemas/fpa";

export const useALIComponents = (params: { estimateId: string }) => {
  const key = params.estimateId ? `/estimates/${params.estimateId}/components/ilf` : null;

  const {
    data: aliComponents,
    error,
    isLoading: isLoadingALI,
    mutate: mutateALI,
  } = useSWR(key, () => fpaComponentService.getALIComponents(params));

  return {
    aliComponents,
    error,
    isLoadingALI,
    mutateALI,
  };
};

export const useEIComponents = (params: { estimateId: string }) => {
  const key = params.estimateId ? `/estimates/${params.estimateId}/components/ei` : null;

  const {
    data: eiComponents,
    error,
    isLoading: isLoadingEI,
    mutate: mutateEI,
  } = useSWR(key, () => fpaComponentService.getEIComponents(params));

  return {
    eiComponents,
    error,
    isLoadingEI,
    mutateEI,
  };
};

export const useEOComponents = (params: { estimateId: string }) => {
  const key = params.estimateId ? `/estimates/${params.estimateId}/components/eo` : null;

  const {
    data: eoComponents,
    error,
    isLoading: isLoadingEO,
    mutate: mutateEO,
  } = useSWR(key, () => fpaComponentService.getEOComponents(params));

  return {
    eoComponents,
    error,
    isLoadingEO,
    mutateEO,
  };
};

export const useEQComponents = (params: { estimateId: string }) => {
  const key = params.estimateId ? `/estimates/${params.estimateId}/components/eq` : null;

  const {
    data: eqComponents,
    error,
    isLoading: isLoadingEQ,
    mutate: mutateEQ,
  } = useSWR(key, () => fpaComponentService.getEQComponents(params));

  return {
    eqComponents,
    error,
    isLoadingEQ,
    mutateEQ,
  };
};

export const useAIEComponents = (params: { estimateId: string }) => {
  const key = params.estimateId ? `/estimates/${params.estimateId}/components/eif` : null;

  const {
    data: aieComponents,
    error,
    isLoading: isLoadingAIE,
    mutate: mutateAIE,
  } = useSWR(key, () => fpaComponentService.getAIEComponents(params));

  return {
    aieComponents,
    error,
    isLoadingAIE,
    mutateAIE,
  };
};

export const useAllComponents = (params: { estimateId: string }) => {
  const ali = useALIComponents(params);
  const ei = useEIComponents(params);
  const eo = useEOComponents(params);
  const eq = useEQComponents(params);
  const aie = useAIEComponents(params);

  const isLoading =
    ali.isLoadingALI ||
    ei.isLoadingEI ||
    eo.isLoadingEO ||
    eq.isLoadingEQ ||
    aie.isLoadingAIE;
  const error = ali.error || ei.error || eo.error || eq.error || aie.error;

  return {
    ali: ali.aliComponents || [],
    ei: ei.eiComponents || [],
    eo: eo.eoComponents || [],
    eq: eq.eqComponents || [],
    aie: aie.aieComponents || [],
    isLoading,
    error,
    refresh: () => {
      ali.mutateALI();
      ei.mutateEI();
      eo.mutateEO();
      eq.mutateEQ();
      aie.mutateAIE();
    },
  };
};

export const useFpaComponentActions = () => {
  const createALIComponent = async (params: {
    estimateId: string;
    data: CreateALIData;
  }) => {
    try {
      const result = await fpaComponentService.createALIComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/ilf`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const createEIComponent = async (params: {
    estimateId: string;
    data: CreateEIData;
  }) => {
    try {
      const result = await fpaComponentService.createEIComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/ei`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const createEOComponent = async (params: {
    estimateId: string;
    data: CreateEOData;
  }) => {
    try {
      const result = await fpaComponentService.createEOComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/eo`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const createEQComponent = async (params: {
    estimateId: string;
    data: CreateEQData;
  }) => {
    try {
      const result = await fpaComponentService.createEQComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/eq`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const createAIEComponent = async (params: {
    estimateId: string;
    data: CreateAIEData;
  }) => {
    try {
      const result = await fpaComponentService.createAIEComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/eif`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateALIComponent = async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateALIData>;
  }) => {
    try {
      const result = await fpaComponentService.updateALIComponent(params);
      // Backend auto-recalculates complexity & FP, invalidate caches for all tabs
      await mutate(`/estimates/${params.estimateId}/components/ilf`);
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateEIComponent = async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateEIData>;
  }) => {
    try {
      const result = await fpaComponentService.updateEIComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/ei`);
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateEOComponent = async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateEOData>;
  }) => {
    try {
      const result = await fpaComponentService.updateEOComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/eo`);
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateEQComponent = async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateEQData>;
  }) => {
    try {
      const result = await fpaComponentService.updateEQComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/eq`);
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateAIEComponent = async (params: {
    estimateId: string;
    id: string;
    data: Partial<CreateAIEData>;
  }) => {
    try {
      const result = await fpaComponentService.updateAIEComponent(params);
      await mutate(`/estimates/${params.estimateId}/components/eif`);
      await mutate(`/estimates/${params.estimateId}`);
      await mutate(`/estimates/${params.estimateId}/overview`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const invalidateAllComponents = async (estimateId: string) => {
    await mutate(`/estimates/${estimateId}/components/ilf`);
    await mutate(`/estimates/${estimateId}/components/ei`);
    await mutate(`/estimates/${estimateId}/components/eo`);
    await mutate(`/estimates/${estimateId}/components/eq`);
    await mutate(`/estimates/${estimateId}/components/eif`);
    await mutate(`/estimates/${estimateId}`);
    await mutate(`/estimates/${estimateId}/overview`);
  };

  return {
    createALIComponent,
    createEIComponent,
    createEOComponent,
    createEQComponent,
    createAIEComponent,
    updateALIComponent,
    updateEIComponent,
    updateEOComponent,
    updateEQComponent,
    updateAIEComponent,
    invalidateAllComponents,
  };
};

export const useFpaComponents = useFpaComponentActions;
