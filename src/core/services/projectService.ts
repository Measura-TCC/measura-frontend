import { measuraApi } from "./measuraApi";
import { getOrganizationState } from "../utils/organizationUtils";
import type { UpdateProjectRequest, Project } from "@/core/schemas/projects";

interface CreateProjectApiRequest {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  teamMembers?: string[];
  objectives?: CreateProjectObjectiveDto[];
}

export interface CreateProjectObjectiveDto {
  title: string;
  description: string;
  organizationalObjectiveIds?: string[];
}

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const { activeOrganizationId } = getOrganizationState();
    console.log("ProjectService.getAll - using organization ID:", activeOrganizationId);
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/projects/${activeOrganizationId}`);
    return response.data;
  },

  getById: async (params: { id: string }): Promise<Project> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/projects/${activeOrganizationId}/${params.id}`);
    return response.data;
  },

  create: async (data: CreateProjectApiRequest): Promise<Project> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.post(`/projects/${activeOrganizationId}`, data);
    return response.data;
  },

  update: async (params: {
    id: string;
    data: UpdateProjectRequest;
  }): Promise<Project> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.put(
      `/projects/${activeOrganizationId}/${params.id}`,
      params.data
    );
    return response.data;
  },

  delete: async (params: { id: string }): Promise<void> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    await measuraApi.delete(`/projects/${activeOrganizationId}/${params.id}`);
  },

  getVersions: async (params: { id: string }): Promise<Project[]> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/projects/${activeOrganizationId}/${params.id}/versions`);
    return response.data;
  },

  createVersion: async (params: { id: string }): Promise<Project> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.post(`/projects/${activeOrganizationId}/${params.id}/versions`);
    return response.data;
  },

  exportProject: async (params: { id: string }): Promise<Blob> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.get(`/projects/${activeOrganizationId}/${params.id}/export`, {
      responseType: "blob",
    });
    return response.data;
  },

  importProject: async (data: FormData): Promise<Project> => {
    const { activeOrganizationId } = getOrganizationState();
    if (!activeOrganizationId) throw new Error('Organization access required');
    const response = await measuraApi.post(`/projects/${activeOrganizationId}/import`, data);
    return response.data;
  },
};
