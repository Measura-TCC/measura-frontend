import { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useOrganizationStore } from "./useOrganizationStore";
import { organizationService } from "@/core/services/organization";
import type {
  CreateOrganizationData,
  UpdateOrganizationData,
} from "@/core/schemas/organizations";
import type { Organization } from "./useOrganizationStore";

export class OrganizationAccessError extends Error {
  constructor(message = "Organization access required") {
    super(message);
    this.name = "OrganizationAccessError";
  }
}

export interface UseOrganizationsConfig {
  fetchAll?: boolean;
  fetchById?: string;
  fetchUserOrganization?: boolean;
}

export const useOrganizations = (config?: UseOrganizationsConfig) => {
  const store = useOrganizationStore();

  const allOrganizationsQuery = useSWR(
    config?.fetchAll ? "/organizations" : null,
    organizationService.getAll
  );

  const organizationByIdQuery = useSWR(
    config?.fetchById ? `/organizations/${config.fetchById}` : null,
    config?.fetchById
      ? () => organizationService.getById({ id: config.fetchById! })
      : null
  );

  const userOrganizationQuery = useSWR(
    config?.fetchUserOrganization ? "/organizations/my-organization" : null,
    organizationService.getUserOrganization
  );

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

  const loadUserOrganizations = useCallback(async () => {
    try {
      store.setLoadingState(true);
      store.setError(null);

      if (store.activeOrganizationId === "demo-organization-id") {
        store.forceClearCache();
      }

      const userOrganization = await organizationService.getUserOrganization();

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

  const createOrganization = async (data: CreateOrganizationData) => {
    try {
      const result = await organizationService.create(data);
      await mutate("/organizations");
      await mutate("/organizations/my-organization");
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateOrganization = async (params: {
    id: string;
    data: UpdateOrganizationData;
  }) => {
    try {
      const result = await organizationService.update(params);
      await mutate("/organizations");
      await mutate(`/organizations/${params.id}`);
      await mutate("/organizations/my-organization");
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteOrganization = async (params: { id: string }) => {
    try {
      await organizationService.delete(params);
      await mutate("/organizations");
      await mutate(`/organizations/${params.id}`, undefined, {
        revalidate: false,
      });
      await mutate("/organizations/my-organization");
    } catch (error) {
      throw error;
    }
  };

  return {
    organizations: allOrganizationsQuery.data,
    isLoadingOrganizations: allOrganizationsQuery.isLoading,
    organizationsError: allOrganizationsQuery.error,
    mutateOrganizations: allOrganizationsQuery.mutate,

    organization: organizationByIdQuery.data,
    isLoadingOrganization: organizationByIdQuery.isLoading,
    organizationError: organizationByIdQuery.error,
    mutateOrganization: organizationByIdQuery.mutate,

    userOrganization: userOrganizationQuery.data,
    isLoadingUserOrganization: userOrganizationQuery.isLoading,
    userOrganizationError: userOrganizationQuery.error,
    mutateUserOrganization: userOrganizationQuery.mutate,

    activeOrganizationId: store.activeOrganizationId,
    userOrganizations: store.userOrganizations,
    isLoadingOrganizationStore: store.isLoadingOrganization,
    organizationStoreError: store.organizationError,

    activeOrganization: getActiveOrganization(),
    hasAccess: hasOrganizationAccess(),

    requireOrganization,
    getOrganizationId,
    hasOrganizationAccess,
    getActiveOrganization,

    loadUserOrganizations,
    selectOrganization,
    clearOrganizations,
    forceClearCache,

    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
};
