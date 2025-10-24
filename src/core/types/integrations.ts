export enum IntegrationType {
  JIRA = "jira",
  GITHUB = "github",
  CLICKUP = "clickup",
  AZURE_DEVOPS = "azureDevops",
}

export interface JiraIntegration {
  domain: string;
  email: string;
  apiToken: string;
  enabled: boolean;
  configuredBy?: string;
  configuredAt?: string;
  lastUsedAt?: string;
}

export interface GitHubIntegration {
  token: string;
  enabled: boolean;
  configuredBy?: string;
  configuredAt?: string;
  lastUsedAt?: string;
}

export interface ClickUpIntegration {
  token: string;
  enabled: boolean;
  configuredBy?: string;
  configuredAt?: string;
  lastUsedAt?: string;
}

export interface AzureDevOpsIntegration {
  organization: string;
  pat: string;
  enabled: boolean;
  configuredBy?: string;
  configuredAt?: string;
  lastUsedAt?: string;
}

export interface OrganizationIntegrations {
  jira?: JiraIntegration;
  github?: GitHubIntegration;
  clickup?: ClickUpIntegration;
  azureDevops?: AzureDevOpsIntegration;
}

export interface ImportJiraRequirementsDto {
  organizationId: string;
  projectId: string;
  estimateId: string;
  jql: string;
}

export interface ImportGitHubRequirementsDto {
  organizationId: string;
  projectId: string;
  estimateId: string;
  owner: string;
  repo: string;
  state: "open" | "closed" | "all";
}

export interface ImportClickUpRequirementsDto {
  organizationId: string;
  projectId: string;
  estimateId: string;
  listId: string;
}

export interface ImportAzureDevOpsRequirementsDto {
  organizationId: string;
  projectId: string;
  estimateId: string;
  project: string;
  wiql: string;
}

export interface ImportResultResponse {
  success: boolean;
  data: {
    imported: number;
    skipped: number;
    failed: number;
    requirements: any[];
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface JiraProjectsResponse {
  projects: JiraProject[];
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
}

export interface GitHubRepositoriesResponse {
  repositories: GitHubRepository[];
}

export interface ClickUpList {
  id: string;
  name: string;
  spaceName: string;
  folderName: string | null;
}

export interface ClickUpListsResponse {
  lists: ClickUpList[];
}

export interface AzureDevOpsProject {
  id: string;
  name: string;
  description: string;
  state: string;
}

export interface AzureDevOpsProjectsResponse {
  projects: AzureDevOpsProject[];
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  details?: {
    serverInfo?: {
      version: string;
      deploymentType: string;
    };
    userInfo?: {
      displayName: string;
      emailAddress: string;
    };
    user?: {
      login: string;
      name: string;
      email: string | null;
    };
    organization?: string;
    projectCount?: number;
  };
}
