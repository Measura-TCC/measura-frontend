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
