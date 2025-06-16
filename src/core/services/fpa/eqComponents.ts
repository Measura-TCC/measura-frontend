import { measuraApi } from "../measuraApi";

export interface CreateEQData {
  name: string;
  description?: string;
  primaryIntent?: string;
  useSpecialCalculation: boolean;
  fileTypesReferenced?: number;
  dataElementTypes?: number;
  inputFtr?: number;
  inputDet?: number;
  outputFtr?: number;
  outputDet?: number;
  retrievalLogic?: string;
}

export const createEQComponent = async (
  estimateId: string,
  data: CreateEQData
) => {
  const response = await measuraApi.post(`/estimates/${estimateId}/eq`, data);
  return response.data;
};
