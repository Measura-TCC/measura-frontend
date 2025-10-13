import useSWR, { mutate } from "swr";
import { organizationMemberService } from "@/core/services/organization";

export const useOrganizationMembers = (organizationId: string | null) => {
  const key = organizationId ? `/organizations/${organizationId}/members` : null;

  const { data, error, isLoading, mutate: mutateMembers } = useSWR(
    key,
    () => organizationMemberService.getMembers(organizationId!)
  );

  return {
    members: data || [],
    error,
    isLoading,
    mutateMembers,
  };
};

export const useMemberActions = () => {
  const leaveOrganization = async () => {
    const result = await organizationMemberService.leaveOrganization();
    await mutate("/organizations/my-organization");
    return result;
  };

  const removeMember = async (organizationId: string, userId: string) => {
    const result = await organizationMemberService.removeMember(organizationId, userId);
    await mutate(`/organizations/${organizationId}/members`);
    return result;
  };

  return {
    leaveOrganization,
    removeMember,
  };
};
