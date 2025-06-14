import { measuraApi } from "./measuraApi";
import type { UpdateProjectRequest, Project } from "@/core/schemas/projects";

interface CreateProjectApiRequest {
  name: string;
  description: string;
  organizationId: string;
  startDate?: string;
  endDate?: string;
  teamMembers?: string[];
}

export const projectService = {
  getAll: async (params?: { organizationId?: string }): Promise<Project[]> => {
    const response = await measuraApi.get("/projects", {
      params,
    });
    return response.data;
  },

  getById: async (params: { id: string }): Promise<Project> => {
    const response = await measuraApi.get(`/projects/${params.id}`);
    return response.data;
  },

  create: async (data: CreateProjectApiRequest): Promise<Project> => {
    const response = await measuraApi.post("/projects", data);
    return response.data;
  },

  update: async (params: {
    id: string;
    data: UpdateProjectRequest;
  }): Promise<Project> => {
    const response = await measuraApi.put(
      `/projects/${params.id}`,
      params.data
    );
    return response.data;
  },

  delete: async (params: { id: string }): Promise<void> => {
    await measuraApi.delete(`/projects/${params.id}`);
  },

  getVersions: async (params: { id: string }): Promise<Project[]> => {
    const response = await measuraApi.get(`/projects/${params.id}/versions`);
    return response.data;
  },

  createVersion: async (params: { id: string }): Promise<Project> => {
    const response = await measuraApi.post(`/projects/${params.id}/versions`);
    return response.data;
  },

  exportProject: async (params: { id: string }): Promise<Blob> => {
    const response = await measuraApi.get(`/projects/export/${params.id}`, {
      responseType: "blob",
    });
    return response.data;
  },

  importProject: async (data: FormData): Promise<Project> => {
    const response = await measuraApi.post("/projects/import", data);
    return response.data;
  },
};
