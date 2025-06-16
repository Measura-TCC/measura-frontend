import useSWR, { mutate } from "swr";
import { organizationService } from "@/core/services/organizationService";
import type {
  CreateOrganizationData,
  UpdateOrganizationData,
} from "@/core/schemas/organizations";

export const useOrganizations = () => {
  const {
    data: organizations,
    error,
    isLoading: isLoadingOrganizations,
    mutate: mutateOrganizations,
  } = useSWR("/organizations", organizationService.getAll);

  return {
    organizations,
    error,
    isLoadingOrganizations,
    mutateOrganizations,
  };
};

export const useOrganization = (params: { id: string }) => {
  const key = params.id ? `/organizations/${params.id}` : null;

  const {
    data: organization,
    error,
    isLoading: isLoadingOrganization,
    mutate: mutateOrganization,
  } = useSWR(key, () => organizationService.getById(params));

  return {
    organization,
    error,
    isLoadingOrganization,
    mutateOrganization,
  };
};

export const useUserOrganization = () => {
  const {
    data: userOrganization,
    error,
    isLoading: isLoadingUserOrganization,
    mutate: mutateUserOrganization,
  } = useSWR(
    "/organizations/my-organization",
    organizationService.getUserOrganization
  );

  return {
    userOrganization,
    error,
    isLoadingUserOrganization,
    mutateUserOrganization,
  };
};

export const useOrganizationActions = () => {
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
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
};
