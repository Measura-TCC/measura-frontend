import { useCallback } from "react";
import { useOrganizationStore } from "./useOrganizationStore";
import { organizationService } from "@/core/services/organization";
import type { Organization } from "./useOrganizationStore";

export class OrganizationAccessError extends Error {
  constructor(message = "Organization access required") {
    super(message);
    this.name = "OrganizationAccessError";
  }
}

export const useOrganization = () => {
  const store = useOrganizationStore();

  // Utility functions
  const requireOrganization = useCallback((): string => {
    const { activeOrganizationId } = store;
    if (!activeOrganizationId) {
      throw new OrganizationAccessError();
    }
    return activeOrganizationId;
  }, [store.activeOrganizationId]);

  const getOrganizationId = useCallback((): string | null => {
    return store.activeOrganizationId;
  }, [store.activeOrganizationId]);

  const hasOrganizationAccess = useCallback((): boolean => {
    return store.hasOrganizationAccess();
  }, [store.hasOrganizationAccess]);

  const getActiveOrganization = useCallback((): Organization | null => {
    return store.getActiveOrganization();
  }, [store.getActiveOrganization]);

  // Organization management functions
  const loadUserOrganizations = useCallback(async () => {
    try {
      store.setLoadingState(true);
      store.setError(null);

      // Clear any cached demo organization ID
      if (store.activeOrganizationId === "demo-organization-id") {
        store.forceClearCache();
      }

      const userOrganization = await organizationService.getUserOrganization();

      // For now, we assume a user belongs to one organization
      // This can be extended to support multiple organizations later
      const organizations = userOrganization
        ? [
            {
              id: userOrganization._id,
              name: userOrganization.name,
              description: userOrganization.description,
              createdAt: userOrganization.createdAt,
              updatedAt: userOrganization.updatedAt,
            },
          ]
        : [];

      store.setUserOrganizations(organizations);

      // Auto-set the active organization if there's exactly one
      if (organizations.length === 1) {
        store.setActiveOrganization(organizations[0].id);
      }

      return organizations;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load organizations";
      store.setError(errorMessage);
      throw error;
    } finally {
      store.setLoadingState(false);
    }
  }, [store]);

  const selectOrganization = useCallback(
    (organizationId: string | null) => {
      if (organizationId) {
        const organization = store.userOrganizations.find(
          (org) => org.id === organizationId
        );
        if (!organization) {
          throw new Error(
            `Organization with ID ${organizationId} not found in user organizations`
          );
        }
      }
      store.setActiveOrganization(organizationId);
    },
    [store.userOrganizations, store.setActiveOrganization]
  );

  const clearOrganizations = useCallback(() => {
    store.clearOrganization();
  }, [store.clearOrganization]);

  const forceClearCache = useCallback(() => {
    store.forceClearCache();
  }, [store.forceClearCache]);

  return {
    // State
    activeOrganizationId: store.activeOrganizationId,
    userOrganizations: store.userOrganizations,
    isLoadingOrganization: store.isLoadingOrganization,
    organizationError: store.organizationError,

    // Computed values
    activeOrganization: getActiveOrganization(),
    hasAccess: hasOrganizationAccess(),

    // Utility functions
    requireOrganization,
    getOrganizationId,
    hasOrganizationAccess,
    getActiveOrganization,

    // Actions
    loadUserOrganizations,
    selectOrganization,
    clearOrganizations,
    forceClearCache,
  };
};
