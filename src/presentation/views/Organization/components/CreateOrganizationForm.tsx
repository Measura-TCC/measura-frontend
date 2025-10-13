"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import {
  createOrganizationSchema,
  type CreateOrganizationData,
} from "@/core/schemas/organizations";
import { useOrganizations } from "@/core/hooks/organizations";
import { Button } from "@/presentation/components/primitives/Button/Button";

interface Organization {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrganizationFormProps {
  onSuccess?: (organization: Organization) => void;
}

export const CreateOrganizationForm = ({
  onSuccess,
}: CreateOrganizationFormProps) => {
  const { t } = useTranslation("organization");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOrganizationData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      objectives: [
        {
          title: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "objectives",
  });

  const { createOrganization } = useOrganizations();

  const onSubmit = async (data: CreateOrganizationData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const transformedData = {
        ...data,
        objectives: data.objectives
          ?.filter((obj) => obj.title?.trim())
          .map((obj) => ({
            title: obj.title.trim(),
            description: obj.title.trim(),
            priority: "MEDIUM" as const,
            status: "PLANNING" as const,
            progress: 0,
            targetDate: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })),
        strategicObjectives: undefined,
      };

      const result = await createOrganization(transformedData);

      reset();
      onSuccess?.(result as Organization);
    } catch (err) {
      console.error("Organization creation failed:", err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : t("form.failedToCreate"));
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {t("form.organizationNameLabel")}
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          placeholder={t("form.organizationNamePlaceholder")}
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
          {t("form.descriptionLabel")}
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          placeholder={t("form.descriptionPlaceholder")}
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
          htmlFor="mission"
          className="block text-sm font-medium text-gray-700"
        >
          {t("form.missionLabel")}
        </label>
        <textarea
          {...register("mission")}
          id="mission"
          rows={3}
          placeholder={t("form.missionPlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.mission && (
          <p className="mt-1 text-sm text-red-600">{errors.mission.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="vision"
          className="block text-sm font-medium text-gray-700"
        >
          {t("form.visionLabel")}
        </label>
        <textarea
          {...register("vision")}
          id="vision"
          rows={3}
          placeholder={t("form.visionPlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.vision && (
          <p className="mt-1 text-sm text-red-600">{errors.vision.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="values"
          className="block text-sm font-medium text-gray-700"
        >
          {t("form.valuesLabel")}
        </label>
        <textarea
          {...register("values")}
          id="values"
          rows={3}
          placeholder={t("form.valuesPlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.values && (
          <p className="mt-1 text-sm text-red-600">{errors.values.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("form.strategicObjectivesLabel")}
        </label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 pl-4">
            <input
              {...register(`objectives.${index}.title`)}
              placeholder={t("form.strategicObjectivesPlaceholder")}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => remove(index)}
              >
                {t("form.removeButton")}
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            append({
              title: "",
            })
          }
        >
          {t("form.addObjectiveButton")}
        </Button>
        {errors.objectives && (
          <p className="mt-1 text-sm text-red-600">
            {Array.isArray(errors.objectives)
              ? errors.objectives.find((obj) => obj?.title)?.title?.message
              : errors.objectives.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          {t("form.websiteLabel")}
        </label>
        <input
          {...register("website")}
          id="website"
          type="url"
          placeholder={t("form.websitePlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-gray-700"
        >
          {t("form.industryLabel")}
        </label>
        <input
          {...register("industry")}
          id="industry"
          type="text"
          placeholder={t("form.industryPlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
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
          onClick={() => console.log("Button clicked!")}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t("form.creating") : t("form.createButton")}
        </Button>
      </div>
    </form>
  );
};
