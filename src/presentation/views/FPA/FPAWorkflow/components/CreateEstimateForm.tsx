"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { EstimateResponse } from "@/core/services/fpa/estimates";
import { useEstimateActions } from "@/core/hooks/fpa/estimates/useEstimate";
import { type CreateEstimateData } from "@/core/schemas/fpa";
import { Button } from "@/presentation/components/primitives";

const createEstimateFormSchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("validation:fpa.name.required"))
      .max(100, t("validation:fpa.name.maxLength")),
    description: z
      .string()
      .min(10, t("validation:project.description.minLength"))
      .max(500, t("validation:fpa.description.maxLength")),
    applicationBoundary: z.string().min(1, t("validation:fpa.applicationBoundary.required")),
    countingScope: z.string().min(1, t("validation:fpa.countingScope.required")),
    countType: z.enum([
      "DEVELOPMENT_PROJECT",
      "ENHANCEMENT_PROJECT",
      "APPLICATION_PROJECT",
    ]),
    teamSize: z.number().min(1).max(100),
    hourlyRateBRL: z.number().min(0.01),
  });

interface CreateEstimateFormProps {
  projectId: string;
  initialData?: {
    name?: string;
    description?: string;
    countType?: string;
  };
  onSuccess: (estimate: EstimateResponse) => void;
}

export const CreateEstimateForm = ({
  projectId,
  initialData,
  onSuccess,
}: CreateEstimateFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimateSchema = useMemo(
    () => createEstimateFormSchemaFactory(t),
    [t]
  );

  type EstimateFormData = z.infer<typeof estimateSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      countType:
        (initialData?.countType as
          | "DEVELOPMENT_PROJECT"
          | "ENHANCEMENT_PROJECT"
          | "APPLICATION_PROJECT") || "DEVELOPMENT_PROJECT",
      applicationBoundary: "",
      countingScope: "",
      teamSize: 1,
      hourlyRateBRL: 0.01
    },
  });

  const { createEstimate } = useEstimateActions();

  const onSubmit = async (data: EstimateFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const createData: CreateEstimateData = {
        ...data,
        projectId,
      };
      const estimate = await createEstimate(createData);

      onSuccess(estimate as unknown as EstimateResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("estimateForm.failedToCreate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold px-2 text-gray-900">
          {t("estimateForm.estimateInformation")}
        </legend>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.estimateName")} *
            </label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("estimateForm.estimateNamePlaceholder")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.description")}
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("estimateForm.descriptionPlaceholder")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="applicationBoundary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.applicationBoundary")} *
            </label>
            <input
              {...register("applicationBoundary")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("estimateForm.applicationBoundaryPlaceholder")}
            />
            {errors.applicationBoundary && (
              <p className="mt-1 text-sm text-red-600">
                {errors.applicationBoundary.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="countingScope"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.countingScope")} *
            </label>
            <textarea
              {...register("countingScope")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("estimateForm.countingScopePlaceholder")}
            />
            {errors.countingScope && (
              <p className="mt-1 text-sm text-red-600">
                {errors.countingScope.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="countType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.countType")} *
            </label>
            <select
              {...register("countType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="DEVELOPMENT_PROJECT">
                {t("estimateForm.developmentProject")}
              </option>
              <option value="ENHANCEMENT_PROJECT">
                {t("estimateForm.enhancementProject")}
              </option>
              <option value="APPLICATION_PROJECT">
                {t("estimateForm.applicationProject")}
              </option>
            </select>
            {errors.countType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.countType.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <input type="hidden" {...register("teamSize", { valueAsNumber: true })} />
      <input
        type="hidden"
        {...register("hourlyRateBRL", { valueAsNumber: true })}
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          size="lg"
        >
          {isSubmitting
            ? t("estimateForm.creating")
            : t("estimateForm.createEstimate")}
        </Button>
      </div>
    </form>
  );
};
