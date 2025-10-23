"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useProjectActions } from "@/core/hooks/projects/useProjects";
import { useOrganizations } from "@/core/hooks/organizations";
import { useOrganizationalObjectives } from "@/core/hooks/organizations";
import {
  UpdateProjectRequest,
  createUpdateProjectSchemaFactory,
  Project,
} from "@/core/schemas/projects";
import { Button } from "@/presentation/components/primitives/Button/Button";
import { DateInput } from "@/presentation/components/primitives";

interface EditProjectFormProps {
  project: Project;
  onSuccess?: (project: unknown) => void;
  onCancel?: () => void;
}

export const EditProjectForm = ({ project, onSuccess, onCancel }: EditProjectFormProps) => {
  const { t } = useTranslation(["projects", "common"]);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { activeOrganizationId } = useOrganizations();
  const { updateProject } = useProjectActions();
  const {
    objectives: organizationalObjectives,
    isLoadingObjectives,
    objectivesError,
  } = useOrganizationalObjectives(activeOrganizationId || undefined);

  const projectSchema = useMemo(
    () => createUpdateProjectSchemaFactory(t),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<UpdateProjectRequest>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      objectives: project.objectives || [
        { title: "", description: "", organizationalObjectiveIds: [] },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "objectives",
  });

  const onSubmit = async (data: UpdateProjectRequest) => {
    setIsSubmitting(true);
    setError("");

    try {
      const updateData = {
        ...data,
        objectives: data.objectives?.filter(
          (obj) => obj.title?.trim() && obj.description?.trim()
        ),
      };

      const result = await updateProject({ id: project._id, data: updateData });
      onSuccess?.(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("editProjectForm.failedToUpdateProject");
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            {t("status")}
          </label>
          <select
            {...register("status")}
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="PLANNING">{t("statusPlanning")}</option>
            <option value="IN_PROGRESS">{t("statusInProgress")}</option>
            <option value="COMPLETED">{t("statusCompleted")}</option>
            <option value="ARCHIVED">{t("statusArchived")}</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
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
            <DateInput
              id="startDate"
              value={watch("startDate")}
              onChange={(value) => setValue("startDate", value)}
              error={!!errors.startDate}
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
            <DateInput
              id="endDate"
              value={watch("endDate")}
              onChange={(value) => setValue("endDate", value)}
              error={!!errors.endDate}
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
                    type="text"
                    placeholder={t("createProjectForm.objectiveTitle")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              size="md"
            >
              {t("cancel", { ns: "projects" })}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="md"
          >
            {isSubmitting
              ? t("editProjectForm.updating")
              : t("editProjectForm.updateProject")}
          </Button>
        </div>
      </form>
    </div>
  );
};
