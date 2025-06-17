"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useProjectActions } from "@/core/hooks/projects/useProjects";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import {
  CreateProjectRequest,
  createProjectSchema,
} from "@/core/schemas/projects";
import { InfoIcon } from "@/presentation/assets/icons";
import { Button } from "@/presentation/components/primitives/Button/Button";

interface CreateProjectFormProps {
  onSuccess?: (project: unknown) => void;
}

export const CreateProjectForm = ({ onSuccess }: CreateProjectFormProps) => {
  const { t } = useTranslation(["projects", "common"]);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();
  const { createProject } = useProjectActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectRequest>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (data: CreateProjectRequest) => {
    if (!userOrganization) {
      setError(t("createProjectForm.organizationRequiredError"));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const teamMembersArray = data.teamMembers
        ? data.teamMembers
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
        : [];

      const projectData = {
        name: data.name,
        description: data.description,
        organizationId: userOrganization._id,
        startDate: data.startDate,
        endDate: data.endDate,
        teamMembers: teamMembersArray,
      };

      const result = await createProject(projectData);

      reset();
      onSuccess?.(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("createProjectForm.failedToCreateProject");
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUserOrganization) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">{t("createProjectForm.loadingText")}</p>
      </div>
    );
  }

  if (!userOrganization) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 mb-4">
          {t("createProjectForm.organizationRequiredError")}
        </p>
        <p className="text-gray-600">
          {t("createProjectForm.contactAdminMessage")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-medium">
            {t("createProjectForm.organization")}:
          </span>{" "}
          {userOrganization.name}
        </p>
      </div>

      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InfoIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {t("createProjectForm.statusInfo")}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            {t("createProjectForm.projectNameRequired")}
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder={t("createProjectForm.projectNamePlaceholder")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            {t("createProjectForm.descriptionRequired")}
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={4}
            placeholder={t("createProjectForm.descriptionPlaceholder")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              {t("startDate")}
            </label>
            <input
              {...register("startDate")}
              id="startDate"
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              {t("endDate")}
            </label>
            <input
              {...register("endDate")}
              id="endDate"
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="teamMembers"
            className="block text-sm font-medium text-gray-700"
          >
            {t("createProjectForm.teamMembersOptional")}
          </label>
          <textarea
            {...register("teamMembers")}
            id="teamMembers"
            rows={2}
            placeholder={t("createProjectForm.teamMembersPlaceholder")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            {t("createProjectForm.teamMembersHelp")}
          </p>
          {errors.teamMembers && (
            <p className="mt-1 text-sm text-red-600">
              {errors.teamMembers.message}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="md"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("createProjectForm.creating")
              : t("createProjectForm.createProject")}
          </Button>
        </div>
      </form>
    </div>
  );
};
