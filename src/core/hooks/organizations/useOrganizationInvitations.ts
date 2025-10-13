import useSWR, { mutate } from "swr";
import { organizationInvitationService } from "@/core/services/organization";

export const useMyInvitations = (enabled: boolean = true) => {
  const { data, error, isLoading, mutate: mutateInvitations } = useSWR(
    enabled ? "/organization-invitations/my-invitations" : null,
    organizationInvitationService.getMyInvitations,
    {
      refreshInterval: 60000,
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  );

  return {
    invitations: data || [],
    error,
    isLoading,
    mutateInvitations,
  };
};

export const useOrganizationInvitations = (orgId: string | null) => {
  const key = orgId ? `/organization-invitations/organizations/${orgId}/invitations` : null;

  const { data, error, isLoading, mutate: mutateInvitations } = useSWR(
    key,
    () => organizationInvitationService.getOrganizationInvitations(orgId!)
  );

  return {
    invitations: data || [],
    error,
    isLoading,
    mutateInvitations,
  };
};

export const useInvitationActions = () => {
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
    inviteUser,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
  };
};
