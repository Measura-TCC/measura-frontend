import { useOrganizations } from "@/core/hooks/organizations";

export const useIntegrationStatus = () => {
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });

  const isJiraConfigured = userOrganization?.integrations?.jira?.enabled ?? false;
  const isGitHubConfigured = userOrganization?.integrations?.github?.enabled ?? false;
  const isClickUpConfigured = userOrganization?.integrations?.clickup?.enabled ?? false;
  const isAzureDevOpsConfigured = userOrganization?.integrations?.azureDevops?.enabled ?? false;

  return {
    isJiraConfigured,
    isGitHubConfigured,
    isClickUpConfigured,
    isAzureDevOpsConfigured,
    organization: userOrganization,
  };
};
