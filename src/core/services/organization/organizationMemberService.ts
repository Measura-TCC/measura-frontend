import { apiClient } from "../apiClient";
import type { OrganizationMember, LeaveOrganizationResponse, RemoveMemberResponse } from "@/core/types/organization-members";

export const organizationMemberService = {
  getMembers: async (organizationId: string): Promise<OrganizationMember[]> => {
    const response = await apiClient.get(`/organizations/${organizationId}/members`);
    return response.data;
  },

  leaveOrganization: async (): Promise<LeaveOrganizationResponse> => {
    const response = await apiClient.post("/organizations/leave");
    return response.data;
  },

  removeMember: async (organizationId: string, userId: string): Promise<RemoveMemberResponse> => {
    const response = await apiClient.delete(`/organizations/${organizationId}/members/${userId}`);
    return response.data;
  },
};
