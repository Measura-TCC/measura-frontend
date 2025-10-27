import { measuraApi } from "../measuraApi";

export interface CreateEstimateData {
  name: string;
  description?: string;
  applicationBoundary: string;
  countingScope: string;
  countType:
    | "DEVELOPMENT_PROJECT"
    | "ENHANCEMENT_PROJECT"
    | "APPLICATION_PROJECT";
  averageDailyWorkingHours: number;
  teamSize: number;
  hourlyRateBRL: number;
  productivityFactor: number;
  projectId: string;
}

export interface EstimateResponse {
  _id: string;
  name: string;
  description?: string;
  applicationBoundary: string;
  countingScope: string;
  countType: string;
  averageDailyWorkingHours: number;
  teamSize: number;
  hourlyRateBRL: number;
  productivityFactor: number;
  project: {
    _id: string;
    name: string;
  };
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export const createEstimate = async (
  data: CreateEstimateData
): Promise<EstimateResponse> => {
  const response = await measuraApi.post("/estimates", data);
  return response.data;
};

export const updateEstimateStatus = async (
  estimateId: string,
  status: string
): Promise<EstimateResponse> => {
  const response = await measuraApi.patch(`/estimates/${estimateId}/status`, { status });
  return response.data;
};

export interface AddComponentData {
  componentType: string;
  fpaData: Record<string, unknown>;
}

const getComponentEndpoint = (componentType: string): string => {
  const endpointMap: Record<string, string> = {
    'ALI': 'components/ilf',
    'AIE': 'components/eif',
    'EI': 'components/ei',
    'EO': 'components/eo',
    'EQ': 'components/eq',
  };
  return endpointMap[componentType] || 'components/ilf';
};

export const addComponentsToEstimate = async (
  estimateId: string,
  components: AddComponentData[]
): Promise<void> => {
  const promises = components.map(component => {
    const endpoint = getComponentEndpoint(component.componentType);
    return measuraApi.post(`/estimates/${estimateId}/${endpoint}`, component.fpaData);
  });
  await Promise.all(promises);
};
