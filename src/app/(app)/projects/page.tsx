"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { CreateProjectForm } from "../../../components/projects/CreateProjectForm";
import { ProjectStatusSelector } from "../../../components/projects/ProjectStatusSelector";

export default function ProjectsPage() {
  const { t, i18n } = useTranslation("projects");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();
  const { projects, isLoadingProjects } = useProjects(
    userOrganization ? { organizationId: userOrganization._id } : undefined
  );

  useEffect(() => {}, [
    userOrganization,
    isLoadingUserOrganization,
    projects,
    isLoadingProjects,
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
          <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
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
          <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
          <p className="text-muted mt-1">{t("subtitle")}</p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <BuildingIcon className="w-12 h-12 text-amber-600 mx-auto" />
              <div>
                <h3 className="font-medium text-amber-900">
                  {t("organizationRequired")}
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  {t("organizationRequiredMessage")}
                </p>
              </div>
              <Button onClick={() => (window.location.href = "/organization")}>
                <PlusIcon className="w-4 h-4 mr-2" />
                {t("createOrganization")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
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
