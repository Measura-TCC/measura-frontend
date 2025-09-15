import useSWR, { mutate } from "swr";
import { projectService } from "@/core/services/projectService";
import { useOrganization } from "@/core/hooks/organizations/useOrganization";
import type { UpdateProjectRequest } from "@/core/schemas/projects";
import type { CreateProjectObjectiveDto } from "@/core/services/projectService";

interface CreateProjectApiRequest {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  teamMembers?: string[];
  objectives?: CreateProjectObjectiveDto[];
}

export const useProjects = () => {
  const { activeOrganizationId } = useOrganization();

  const key = activeOrganizationId ? `/projects/${activeOrganizationId}` : null;

  const {
    data: projects,
    error,
    isLoading: isLoadingProjects,
    mutate: mutateProjects,
  } = useSWR(key, () => activeOrganizationId ? projectService.getAll() : null);

  return {
    projects,
    error,
    isLoadingProjects,
    mutateProjects,
  };
};

export const useProject = (params: { id: string }) => {
  const { activeOrganizationId } = useOrganization();

  const key = params.id && activeOrganizationId ? `/projects/${activeOrganizationId}/${params.id}` : null;

  const {
    data: project,
    error,
    isLoading: isLoadingProject,
    mutate: mutateProject,
  } = useSWR(key, () =>
    activeOrganizationId ? projectService.getById({ id: params.id }) : null
  );

  return {
    project,
    error,
    isLoadingProject,
    mutateProject,
  };
};

export const useProjectVersions = (params: { id: string }) => {
  const { activeOrganizationId } = useOrganization();

  const key = params.id && activeOrganizationId ? `/projects/${activeOrganizationId}/${params.id}/versions` : null;

  const {
    data: versions,
    error,
    isLoading: isLoadingVersions,
    mutate: mutateVersions,
  } = useSWR(key, () =>
    activeOrganizationId ? projectService.getVersions({ id: params.id }) : null
  );

  return {
    versions,
    error,
    isLoadingVersions,
    mutateVersions,
  };
};

export const useProjectActions = () => {
  const { requireOrganization } = useOrganization();

  const createProject = async (data: CreateProjectApiRequest) => {
    try {
      const organizationId = requireOrganization();
      const result = await projectService.create(data);
      await mutate(`/projects/${organizationId}`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateProject = async (params: {
    id: string;
    data: UpdateProjectRequest;
  }) => {
    try {
      const organizationId = requireOrganization();
      const result = await projectService.update(params);
      await mutate(`/projects/${organizationId}`);
      await mutate(`/projects/${organizationId}/${params.id}`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteProject = async (params: { id: string }) => {
    try {
      const organizationId = requireOrganization();
      await projectService.delete(params);
      await mutate(`/projects/${organizationId}`);
      await mutate(`/projects/${organizationId}/${params.id}`, undefined, {
        revalidate: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const createVersion = async (params: { id: string }) => {
    try {
      const organizationId = requireOrganization();
      const result = await projectService.createVersion(params);
      await mutate(`/projects/${organizationId}`);
      await mutate(`/projects/${organizationId}/${params.id}`);
      await mutate(`/projects/${organizationId}/${params.id}/versions`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const exportProject = async (params: { id: string }) => {
    try {
      requireOrganization();
      const blob = await projectService.exportProject(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `project-${params.id}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      return blob;
    } catch (error) {
      throw error;
    }
  };

  const importProject = async (data: FormData) => {
    try {
      const organizationId = requireOrganization();
      const result = await projectService.importProject(data);
      await mutate(`/projects/${organizationId}`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    createProject,
    updateProject,
    deleteProject,
    createVersion,
    exportProject,
    importProject,
  };
};
