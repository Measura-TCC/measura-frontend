import { measuraApi } from "./measuraApi";
import type {
  CreateOrganizationData,
  UpdateOrganizationData,
} from "@/core/schemas/organizations";

export interface Organization {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  mission?: string;
  vision?: string;
  values?: string;
  strategicObjectives?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const response = await measuraApi.get("/organizations");
    return response.data;
  },

  getById: async (params: { id: string }): Promise<Organization> => {
    const response = await measuraApi.get(`/organizations/${params.id}`);
    return response.data;
  },

  create: async (data: CreateOrganizationData): Promise<Organization> => {
    const response = await measuraApi.post("/organizations", data);
    return response.data;
  },

  update: async (params: {
    id: string;
    data: UpdateOrganizationData;
  }): Promise<Organization> => {
    const response = await measuraApi.put(
      `/organizations/${params.id}`,
      params.data
    );
    return response.data;
  },

  delete: async (params: { id: string }): Promise<void> => {
    await measuraApi.delete(`/organizations/${params.id}`);
  },

  getUserOrganization: async (): Promise<Organization | null> => {
    try {
      const response = await measuraApi.get("/organizations/my-organization");
      return response.data;
    } catch {
      return null;
    }
  },
};
