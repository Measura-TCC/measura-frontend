import useSWR from "swr";
import { projectService } from "@/core/services/projectService";
import type { Project } from "@/core/schemas/projects";

export const useProjectObjectives = (projectId: string | null) => {
  const {
    data: project,
    error,
    isLoading,
    mutate,
  } = useSWR<Project>(
    projectId ? `projects/${projectId}` : null,
    () => projectService.getById({ id: projectId! }),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    project,
    projectObjectives: project?.objectives || [],
    isLoadingProject: isLoading,
    projectError: error,
    refetchProject: mutate,
  };
};