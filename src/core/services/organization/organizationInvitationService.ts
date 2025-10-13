import { apiClient } from "../apiClient";
import type { OrganizationInvitation } from "@/core/types/organization-invitations";

export const organizationInvitationService = {
  inviteUser: async (userIdentifier: string): Promise<OrganizationInvitation> => {
    const response = await apiClient.post("/organization-invitations", { userIdentifier });
    return response.data;
  },

  getMyInvitations: async (): Promise<OrganizationInvitation[]> => {
    try {
      const response = await apiClient.get("/organization-invitations/my-invitations", {
        skipAutoLogout: true
      } as any);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        return [];
      }
      return [];
    }
  },

  acceptInvitation: async (id: string): Promise<OrganizationInvitation> => {
    const response = await apiClient.post(`/organization-invitations/${id}/accept`);
    return response.data;
  },

  rejectInvitation: async (id: string): Promise<OrganizationInvitation> => {
    const response = await apiClient.post(`/organization-invitations/${id}/reject`);
    return response.data;
  },

  getOrganizationInvitations: async (orgId: string): Promise<OrganizationInvitation[]> => {
    const response = await apiClient.get(`/organization-invitations/organizations/${orgId}/invitations`);
    return response.data;
  },

  cancelInvitation: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete(`/organization-invitations/${id}`);
    return response.data;
  },
};
