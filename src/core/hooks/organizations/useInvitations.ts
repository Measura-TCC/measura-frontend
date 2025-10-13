import useSWR, { mutate } from "swr";
import { organizationInvitationService } from "@/core/services/organization";

interface UseInvitationsConfig {
  fetchMy?: boolean;
  fetchOrganization?: string | null;
}

export const useInvitations = (config?: UseInvitationsConfig) => {
  const myInvitationsQuery = useSWR(
    config?.fetchMy ? "/organization-invitations/my-invitations" : null,
    organizationInvitationService.getMyInvitations,
    {
      refreshInterval: 60000,
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  );

  const orgInvitationsQuery = useSWR(
    config?.fetchOrganization
      ? `/organization-invitations/organizations/${config.fetchOrganization}/invitations`
      : null,
    config?.fetchOrganization
      ? () => organizationInvitationService.getOrganizationInvitations(config.fetchOrganization!)
      : null
  );

  const inviteUser = async (userIdentifier: string, organizationId?: string) => {
    const result = await organizationInvitationService.inviteUser(userIdentifier);
    await mutate("/organization-invitations/my-invitations");
    if (organizationId) {
      await mutate(`/organization-invitations/organizations/${organizationId}/invitations`);
    }
    return result;
  };

  const acceptInvitation = async (id: string) => {
    const result = await organizationInvitationService.acceptInvitation(id);
    await mutate("/organization-invitations/my-invitations");
    await mutate("/organizations/my-organization");
    return result;
  };

  const rejectInvitation = async (id: string) => {
    const result = await organizationInvitationService.rejectInvitation(id);
    await mutate("/organization-invitations/my-invitations");
    return result;
  };

  const cancelInvitation = async (id: string, orgId: string) => {
    const result = await organizationInvitationService.cancelInvitation(id);
    await mutate(`/organization-invitations/organizations/${orgId}/invitations`);
    return result;
  };

  return {
    myInvitations: myInvitationsQuery.data || [],
    isLoadingMyInvitations: myInvitationsQuery.isLoading,
    myInvitationsError: myInvitationsQuery.error,
    refetchMyInvitations: myInvitationsQuery.mutate,
    orgInvitations: orgInvitationsQuery.data || [],
    isLoadingOrgInvitations: orgInvitationsQuery.isLoading,
    orgInvitationsError: orgInvitationsQuery.error,
    refetchOrgInvitations: orgInvitationsQuery.mutate,
    inviteUser,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
  };
};
