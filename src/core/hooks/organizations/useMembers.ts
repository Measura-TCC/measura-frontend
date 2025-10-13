import useSWR, { mutate } from "swr";
import { organizationMemberService } from "@/core/services/organization";

export const useMembers = (organizationId: string | null) => {
  const key = organizationId ? `/organizations/${organizationId}/members` : null;

  const { data, error, isLoading, mutate: mutateMembers } = useSWR(
    key,
    () => organizationMemberService.getMembers(organizationId!)
  );

  const leaveOrganization = async () => {
    const result = await organizationMemberService.leaveOrganization();
    await mutate("/organizations/my-organization");
    return result;
  };

  const removeMember = async (userId: string) => {
    if (!organizationId) {
      throw new Error("Organization ID is required to remove a member");
    }
    const result = await organizationMemberService.removeMember(organizationId, userId);
    await mutateMembers();
    return result;
  };

  return {
    members: data || [],
    isLoading,
    error,
    refetchMembers: mutateMembers,
    leaveOrganization,
    removeMember,
  };
};
