"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import {
  DocumentIcon,
  PlusIcon,
  BuildingIcon,
} from "@/presentation/assets/icons";
import { useOrganizations } from "@/core/hooks/organizations";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { useOrganizationalObjectives } from "@/core/hooks/organizations";
import { useOrganizationStore } from "@/core/hooks/organizations/useOrganizationStore";
import { CreateProjectForm } from "@/presentation/views/Projects/components/CreateProjectForm";
import { ProjectStatusSelector } from "@/presentation/views/Projects/components/ProjectStatusSelector";
import { OrganizationAlert } from "@/presentation/components/shared/OrganizationAlert";

export default function ProjectsPage() {
  const { t, i18n } = useTranslation("projects");
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { userOrganization, isLoadingUserOrganization, activeOrganizationId, loadUserOrganizations, forceClearCache } =
    useOrganizations({ fetchUserOrganization: true });
  const { projects, isLoadingProjects } = useProjects();
  const { objectives: organizationalObjectives } =
    useOrganizationalObjectives();

  // Debug organization state
  useEffect(() => {
    // Force clear cache if demo ID is detected
    if (activeOrganizationId === "demo-organization-id") {
      forceClearCache();
    }

    // Directly set the active organization ID if we have userOrganization but no activeOrganizationId
    if (!activeOrganizationId && userOrganization?._id) {
      console.log(
        "ProjectsPage - Setting active organization ID directly:",
        userOrganization._id
      );
      const { setActiveOrganization } = useOrganizationStore.getState();
      setActiveOrganization(userOrganization._id);
    }
  }, [
    activeOrganizationId,
    userOrganization,
    isLoadingUserOrganization,
    projects,
    isLoadingProjects,
    forceClearCache,
    loadUserOrganizations,
  ]);

  const handleProjectCreated = () => {
    setShowCreateForm(false);
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language === "pt" ? "pt-BR" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ARCHIVED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PLANNING":
        return t("statusPlanning");
      case "IN_PROGRESS":
        return t("statusInProgress");
      case "COMPLETED":
        return t("statusCompleted");
      case "ARCHIVED":
        return t("statusArchived");
      default:
        return status;
    }
  };

  if (isLoadingUserOrganization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-default">{t("title")}</h1>
          <p className="text-muted mt-1">{t("loading")}</p>
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!userOrganization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-default">{t("title")}</h1>
          <p className="text-muted mt-1">{t("subtitle")}</p>
        </div>

        <OrganizationAlert
          hasOrganization={false}
          translationNamespace="projects"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-default">{t("title")}</h1>
          <p className="text-muted mt-1">
            {t("subtitleWithOrg", { organizationName: userOrganization.name })}
          </p>
          <p className="text-sm text-secondary mt-1 flex items-center gap-2">
            <BuildingIcon className="w-4 h-4" />
            {userOrganization.name}
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          {t("newProject")}
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t("createNewProject")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateProjectForm onSuccess={handleProjectCreated} />
            <div className="mt-4">
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                {t("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoadingProjects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-3">
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DocumentIcon className="w-5 h-5 text-primary" />
                  {project.name}
                </CardTitle>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    project.status
                  )} w-fit`}
                >
                  {getStatusLabel(project.status)}
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-secondary line-clamp-2">
                  {project.description}
                </p>
                <div className="border-t border-border pt-3">
                  <ProjectStatusSelector project={project} />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/plans?project=${project._id}`)}
                  >
                    View Plans
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/fpa?project=${project._id}`)}
                  >
                    View Estimates
                  </Button>
                </div>
                {project.objectives && project.objectives.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <h4 className="text-sm font-medium mb-2">
                      Project Objectives:
                    </h4>
                    {project.objectives.slice(0, 2).map((obj) => (
                      <div
                        key={obj._id}
                        className="text-xs bg-blue-50 p-2 rounded mb-1"
                      >
                        <div className="font-medium">{obj.title}</div>
                        {obj.organizationalObjectiveIds &&
                          obj.organizationalObjectiveIds.length > 0 && (
                            <div className="text-blue-600 mt-1">
                              {t("linkedTo")}{" "}
                              {obj.organizationalObjectiveIds
                                .map(
                                  (id) =>
                                    organizationalObjectives.find(
                                      (org) => org._id === id
                                    )?.title
                                )
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          )}
                      </div>
                    ))}
                    {project.objectives.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{project.objectives.length - 2} more objectives
                      </div>
                    )}
                  </div>
                )}
                {project.startDate && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">{t("startDate")}</span>
                    <span className="text-secondary">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">{t("endDate")}</span>
                    <span className="text-secondary">
                      {formatDate(project.endDate)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-border">
                  <span className="text-muted">
                    {t("createdAt", "Created")}
                  </span>
                  <span className="text-muted">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="font-medium text-default">
                  {t("noProjectsYet")}
                </h3>
                <p className="text-sm text-secondary mt-1">
                  {t("noProjectsMessage")}
                </p>
              </div>
              <Button onClick={() => setShowCreateForm(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                {t("createFirstProject")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
