import { measuraApi } from "../measuraApi";
import type {
  CreateOrganizationData,
  UpdateOrganizationData,
} from "@/core/schemas/organizations";
import type { OrganizationObjective, PredefinedMeasurement, CreateOrganizationalObjectiveDto, UpdateOrganizationalObjectiveDto } from "@/core/types/plans";

export interface Organization {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  mission?: string;
  vision?: string;
  values?: string;
  objectives?: OrganizationObjective[];
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

  getObjectives: async (params: { organizationId: string }): Promise<OrganizationObjective[]> => {
    const response = await measuraApi.get(`/organizations/${params.organizationId}/objectives`);
    return response.data.data || [];
  },

  getMeasurements: async (params: { organizationId: string }): Promise<PredefinedMeasurement[]> => {
    const response = await measuraApi.get(`/organizations/${params.organizationId}/measurements`);
    return response.data;
  },

  createObjective: async (params: { organizationId: string; data: CreateOrganizationalObjectiveDto }): Promise<Organization> => {
    const response = await measuraApi.post(`/organizations/${params.organizationId}/objectives`, params.data);
    return response.data;
  },

  updateObjective: async (params: { organizationId: string; objectiveId: string; data: UpdateOrganizationalObjectiveDto }): Promise<Organization> => {
    const response = await measuraApi.put(`/organizations/${params.organizationId}/objectives/${params.objectiveId}`, params.data);
    return response.data;
  },

  deleteObjective: async (params: { organizationId: string; objectiveId: string }): Promise<Organization> => {
    const response = await measuraApi.delete(`/organizations/${params.organizationId}/objectives/${params.objectiveId}`);
    return response.data;
  },

  getObjective: async (params: { organizationId: string; objectiveId: string }): Promise<OrganizationObjective> => {
    const response = await measuraApi.get(`/organizations/${params.organizationId}/objectives/${params.objectiveId}`);
    return response.data;
  },
};
