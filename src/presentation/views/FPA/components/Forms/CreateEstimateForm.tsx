"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { EstimateResponse } from "@/core/services/fpa/estimates";
import { useEstimateActions } from "@/core/hooks/fpa/estimates/useEstimate";
import { type CreateEstimateData } from "@/core/schemas/fpa";

const estimateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description too long"),
  applicationBoundary: z.string().min(1, "Application boundary is required"),
  countingScope: z.string().min(1, "Counting scope is required"),
  countType: z.enum([
    "DEVELOPMENT_PROJECT",
    "ENHANCEMENT_PROJECT",
    "APPLICATION_PROJECT",
  ]),

  averageDailyWorkingHours: z
    .number()
    .min(1, "Minimum 1 hour per day")
    .max(24, "Maximum 24 hours per day"),

  teamSize: z
    .number()
    .int("Must be an integer")
    .min(1, "Minimum 1 person")
    .max(100, "Maximum 100 people"),

  hourlyRateBRL: z
    .number()
    .min(0.01, "Rate must be positive")
    .max(10000, "Rate too high"),
});

type EstimateFormData = z.infer<typeof estimateSchema>;

interface CreateEstimateFormProps {
  projectId: string;
  onSuccess: (estimate: EstimateResponse) => void;
}

export const CreateEstimateForm = ({
  projectId,
  onSuccess,
}: CreateEstimateFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      description: "Default project description for FPA estimation",
      countType: "DEVELOPMENT_PROJECT",
      averageDailyWorkingHours: 8,
      teamSize: 4,
      hourlyRateBRL: 150,
    },
  });

  const { createEstimate } = useEstimateActions();

  const teamSize = watch("teamSize");
  const averageDailyWorkingHours = watch("averageDailyWorkingHours");

  const estimatedDailyCapacity = teamSize * averageDailyWorkingHours;

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <input
                {...register("countingScope")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t("estimateForm.countingScopePlaceholder")}
              />
              {errors.countingScope && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.countingScope.message}
                </p>
              )}
            </div>
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

      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold px-2 text-gray-900">
          {t("estimateForm.projectConfiguration")}
        </legend>
        <p className="text-sm text-gray-600 mb-4">
          {t("estimateForm.configurationDescription")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="averageDailyWorkingHours"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.dailyWorkingHours")} *
            </label>
            <input
              {...register("averageDailyWorkingHours", { valueAsNumber: true })}
              type="number"
              min="1"
              max="24"
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {t("estimateForm.averageHoursHelp")}
            </p>
            {errors.averageDailyWorkingHours && (
              <p className="mt-1 text-sm text-red-600">
                {errors.averageDailyWorkingHours.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="teamSize"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.teamSize")} *
            </label>
            <input
              {...register("teamSize", { valueAsNumber: true })}
              type="number"
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {t("estimateForm.teamSizeHelp")}
            </p>
            {errors.teamSize && (
              <p className="mt-1 text-sm text-red-600">
                {errors.teamSize.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="hourlyRateBRL"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.hourlyRate")} *
            </label>
            <input
              {...register("hourlyRateBRL", { valueAsNumber: true })}
              type="number"
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {t("estimateForm.hourlyRateHelp")}
            </p>
            {errors.hourlyRateBRL && (
              <p className="mt-1 text-sm text-red-600">
                {errors.hourlyRateBRL.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            {t("estimateForm.teamCapacityPreview")}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">
                {t("estimateForm.dailyCapacity")}:
              </span>
              <span className="font-medium text-blue-900 ml-2">
                {estimatedDailyCapacity} hrs/d
              </span>
            </div>
            <div>
              <span className="text-blue-700">
                {t("estimateForm.teamSize")}:
              </span>
              <span className="font-medium text-blue-900 ml-2">
                {teamSize} {t("estimateForm.people")}
              </span>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? t("estimateForm.creating")
            : t("estimateForm.createEstimate")}
        </button>
      </div>
    </form>
  );
};
