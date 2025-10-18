"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useProjectActions } from "@/core/hooks/projects/useProjects";
import { useOrganizations } from "@/core/hooks/organizations";
import { useOrganizationalObjectives } from "@/core/hooks/organizations";
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

  const { userOrganization, isLoadingUserOrganization, activeOrganizationId, loadUserOrganizations, forceClearCache } = useOrganizations({ fetchUserOrganization: true });
  const { createProject } = useProjectActions();
  const {
    objectives: organizationalObjectives,
    isLoadingObjectives,
    objectivesError,
  } = useOrganizationalObjectives(activeOrganizationId || undefined);

  // Load user organizations on mount to ensure activeOrganizationId is set
  useEffect(() => {
    // Force refresh if we have demo organization ID
    if (activeOrganizationId === "demo-organization-id") {
      forceClearCache();
      loadUserOrganizations().catch(console.error);
    } else if (!activeOrganizationId) {
      loadUserOrganizations().catch(console.error);
    }
  }, [
    activeOrganizationId,
    loadUserOrganizations,
    forceClearCache,
    userOrganization,
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateProjectRequest>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      objectives: [
        { title: "", description: "", organizationalObjectiveIds: [] },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "objectives",
  });

  const onSubmit = async (data: CreateProjectRequest) => {
    if (!userOrganization) {
      setError(t("createProjectForm.organizationRequiredError"));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const projectData = {
        name: data.name,
        description: data.description,
        organizationId: userOrganization._id,
        startDate: data.startDate,
        endDate: data.endDate,
        objectives: data.objectives?.filter(
          (obj) => obj.title.trim() && obj.description.trim()
        ),
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("createProjectForm.projectObjectives")}
          </label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-md p-4 mb-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input
                    {...register(`objectives.${index}.title`)}
                    placeholder={t("createProjectForm.objectiveTitle")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.objectives?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.objectives[index]?.title?.message}
                    </p>
                  )}
                </div>
                <div>
                  <textarea
                    {...register(`objectives.${index}.description`)}
                    placeholder={t("createProjectForm.objectiveDescription")}
                    rows={2}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.objectives?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.objectives[index]?.description?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("createProjectForm.linkToOrganizationalObjectives")}
                  </label>
                  <select
                    {...register(
                      `objectives.${index}.organizationalObjectiveIds`
                    )}
                    multiple
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    size={3}
                    disabled={isLoadingObjectives}
                  >
                    {isLoadingObjectives ? (
                      <option disabled>Loading objectives...</option>
                    ) : objectivesError ? (
                      <option disabled>Error loading objectives</option>
                    ) : !Array.isArray(organizationalObjectives) ||
                      organizationalObjectives.length === 0 ? (
                      <option disabled>
                        No organizational objectives available
                      </option>
                    ) : (
                      organizationalObjectives.map((orgObj) => (
                        <option key={orgObj._id} value={orgObj._id}>
                          {orgObj.title}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {t("createProjectForm.holdCtrlCmdToSelect")}
                  </p>
                </div>
                <div className="flex justify-end">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant="danger"
                      size="sm"
                    >
                      {t("createProjectForm.remove")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({
                title: "",
                description: "",
                organizationalObjectiveIds: [],
              })
            }
            variant="secondary"
            size="sm"
          >
            {t("createProjectForm.addAnotherObjective")}
          </Button>
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
