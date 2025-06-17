import useSWR, { mutate } from "swr";
import { projectService } from "@/core/services/projectService";
import type { UpdateProjectRequest } from "@/core/schemas/projects";

interface CreateProjectApiRequest {
  name: string;
  description: string;
  organizationId: string;
  startDate?: string;
  endDate?: string;
  teamMembers?: string[];
}

export const useProjects = () => {
  const {
    data: projects,
    error,
    isLoading: isLoadingProjects,
    mutate: mutateProjects,
  } = useSWR("/projects", () => projectService.getAll());

  return {
    projects,
    error,
    isLoadingProjects,
    mutateProjects,
  };
};

export const useProject = (params: { id: string }) => {
  const key = params.id ? `/projects/${params.id}` : null;

  const {
    data: project,
    error,
    isLoading: isLoadingProject,
    mutate: mutateProject,
  } = useSWR(key, () => projectService.getById(params));

  return {
    project,
    error,
    isLoadingProject,
    mutateProject,
  };
};

export const useProjectVersions = (params: { id: string }) => {
  const key = params.id ? `/projects/${params.id}/versions` : null;

  const {
    data: versions,
    error,
    isLoading: isLoadingVersions,
    mutate: mutateVersions,
  } = useSWR(key, () => projectService.getVersions(params));

  return {
    versions,
    error,
    isLoadingVersions,
    mutateVersions,
  };
};

export const useProjectActions = () => {
  const createProject = async (data: CreateProjectApiRequest) => {
    try {
      const result = await projectService.create(data);
      await mutate("/projects");
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
      const result = await projectService.update(params);
      await mutate("/projects");
      await mutate(`/projects/${params.id}`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteProject = async (params: { id: string }) => {
    try {
      await projectService.delete(params);
      await mutate("/projects");
      await mutate(`/projects/${params.id}`, undefined, {
        revalidate: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const createVersion = async (params: { id: string }) => {
    try {
      const result = await projectService.createVersion(params);
      await mutate("/projects");
      await mutate(`/projects/${params.id}`);
      await mutate(`/projects/${params.id}/versions`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const exportProject = async (params: { id: string }) => {
    try {
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
      const result = await projectService.importProject(data);
      await mutate("/projects");
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
