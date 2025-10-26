import { measuraApi } from "./measuraApi";
import type {
  JiraIntegration,
  GitHubIntegration,
  ClickUpIntegration,
  AzureDevOpsIntegration,
  ImportJiraRequirementsDto,
  ImportGitHubRequirementsDto,
  ImportClickUpRequirementsDto,
  ImportAzureDevOpsRequirementsDto,
  ImportResultResponse,
  JiraProjectsResponse,
  GitHubRepositoriesResponse,
  ClickUpListsResponse,
  AzureDevOpsProjectsResponse,
  TestConnectionResponse,
} from "@/core/types/integrations";

export const integrationService = {
  configureJira: async (organizationId: string, data: Omit<JiraIntegration, "configuredBy" | "configuredAt" | "lastUsedAt">) => {
    const response = await measuraApi.post(`/organizations/${organizationId}/integrations/jira`, data);
    return response.data;
  },

  updateJira: async (organizationId: string, data: Partial<JiraIntegration>) => {
    const response = await measuraApi.put(`/organizations/${organizationId}/integrations/jira`, data);
    return response.data;
  },

  deleteJira: async (organizationId: string) => {
    const response = await measuraApi.delete(`/organizations/${organizationId}/integrations/jira`);
    return response.data;
  },

  testJiraConnection: async (organizationId: string): Promise<TestConnectionResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/jira/test`);
    return response.data;
  },

  listJiraProjects: async (organizationId: string): Promise<JiraProjectsResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/jira/projects`);
    return response.data;
  },

  importFromJira: async (data: ImportJiraRequirementsDto): Promise<ImportResultResponse> => {
    const response = await measuraApi.post("/integrations/jira/import-requirements", data);
    return response.data;
  },

  configureGitHub: async (organizationId: string, data: Omit<GitHubIntegration, "configuredBy" | "configuredAt" | "lastUsedAt">) => {
    const response = await measuraApi.post(`/organizations/${organizationId}/integrations/github`, data);
    return response.data;
  },

  updateGitHub: async (organizationId: string, data: Partial<GitHubIntegration>) => {
    const response = await measuraApi.put(`/organizations/${organizationId}/integrations/github`, data);
    return response.data;
  },

  deleteGitHub: async (organizationId: string) => {
    const response = await measuraApi.delete(`/organizations/${organizationId}/integrations/github`);
    return response.data;
  },

  testGitHubConnection: async (organizationId: string): Promise<TestConnectionResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/github/test`);
    return response.data;
  },

  listGitHubRepositories: async (organizationId: string): Promise<GitHubRepositoriesResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/github/repositories`);
    return response.data;
  },

  importFromGitHub: async (data: ImportGitHubRequirementsDto): Promise<ImportResultResponse> => {
    const response = await measuraApi.post("/integrations/github/import-requirements", data);
    return response.data;
  },

  configureClickUp: async (organizationId: string, data: Omit<ClickUpIntegration, "configuredBy" | "configuredAt" | "lastUsedAt">) => {
    const response = await measuraApi.post(`/organizations/${organizationId}/integrations/clickup`, data);
    return response.data;
  },

  updateClickUp: async (organizationId: string, data: Partial<ClickUpIntegration>) => {
    const response = await measuraApi.put(`/organizations/${organizationId}/integrations/clickup`, data);
    return response.data;
  },

  deleteClickUp: async (organizationId: string) => {
    const response = await measuraApi.delete(`/organizations/${organizationId}/integrations/clickup`);
    return response.data;
  },

  testClickUpConnection: async (organizationId: string): Promise<TestConnectionResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/clickup/test`);
    return response.data;
  },

  listClickUpLists: async (organizationId: string): Promise<ClickUpListsResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/clickup/lists`);
    return response.data;
  },

  importFromClickUp: async (data: ImportClickUpRequirementsDto): Promise<ImportResultResponse> => {
    const response = await measuraApi.post("/integrations/clickup/import-requirements", data);
    return response.data;
  },

  configureAzureDevOps: async (organizationId: string, data: Omit<AzureDevOpsIntegration, "configuredBy" | "configuredAt" | "lastUsedAt">) => {
    const response = await measuraApi.post(`/organizations/${organizationId}/integrations/azure-devops`, data);
    return response.data;
  },

  updateAzureDevOps: async (organizationId: string, data: Partial<AzureDevOpsIntegration>) => {
    const response = await measuraApi.put(`/organizations/${organizationId}/integrations/azure-devops`, data);
    return response.data;
  },

  deleteAzureDevOps: async (organizationId: string) => {
    const response = await measuraApi.delete(`/organizations/${organizationId}/integrations/azure-devops`);
    return response.data;
  },

  testAzureDevOpsConnection: async (organizationId: string): Promise<TestConnectionResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/azure-devops/test`);
    return response.data;
  },

  listAzureDevOpsProjects: async (organizationId: string): Promise<AzureDevOpsProjectsResponse> => {
    const response = await measuraApi.get(`/organizations/${organizationId}/integrations/azure-devops/projects`);
    return response.data;
  },

  importFromAzureDevOps: async (data: ImportAzureDevOpsRequirementsDto): Promise<ImportResultResponse> => {
    const response = await measuraApi.post("/integrations/azure-devops/import-requirements", data);
    return response.data;
  },
};
