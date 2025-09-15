import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationStore {
  // State
  activeOrganizationId: string | null;
  userOrganizations: Organization[];
  isLoadingOrganization: boolean;
  organizationError: string | null;

  // Actions
  setActiveOrganization: (organizationId: string | null) => void;
  setUserOrganizations: (organizations: Organization[]) => void;
  setLoadingState: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearOrganization: () => void;
  forceClearCache: () => void;

  // Computed getters
  getActiveOrganization: () => Organization | null;
  hasOrganizationAccess: () => boolean;
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeOrganizationId: null,
      userOrganizations: [],
      isLoadingOrganization: false,
      organizationError: null,

      // Actions
      setActiveOrganization: (organizationId) => {
        set({
          activeOrganizationId: organizationId,
          organizationError: null
        });
      },

      setUserOrganizations: (organizations) => {
        set({
          userOrganizations: organizations,
          // Auto-set active organization if user has only one
          activeOrganizationId: organizations.length === 1
            ? organizations[0].id
            : get().activeOrganizationId
        });
      },

      setLoadingState: (isLoading) => {
        set({ isLoadingOrganization: isLoading });
      },

      setError: (error) => {
        set({
          organizationError: error,
          isLoadingOrganization: false
        });
      },

      clearOrganization: () => {
        set({
          activeOrganizationId: null,
          userOrganizations: [],
          isLoadingOrganization: false,
          organizationError: null,
        });
      },

      forceClearCache: () => {
        // Clear localStorage cache
        try {
          localStorage.removeItem("organization-storage");
        } catch (error) {
          console.debug("Failed to clear organization cache:", error);
        }

        // Reset state
        set({
          activeOrganizationId: null,
          userOrganizations: [],
          isLoadingOrganization: false,
          organizationError: null,
        });
      },

      // Computed getters
      getActiveOrganization: () => {
        const { activeOrganizationId, userOrganizations } = get();
        if (!activeOrganizationId) return null;
        return userOrganizations.find(org => org.id === activeOrganizationId) || null;
      },

      hasOrganizationAccess: () => {
        return get().activeOrganizationId !== null;
      },
    }),
    {
      name: "organization-storage",
      partialize: (state) => ({
        activeOrganizationId: state.activeOrganizationId,
        userOrganizations: state.userOrganizations,
      }),
    }
  )
);