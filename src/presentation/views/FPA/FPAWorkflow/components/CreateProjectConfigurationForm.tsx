"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { estimateService } from "@/core/services/estimateService";
import { Button } from "@/presentation/components/primitives/Button/Button";

const projectConfigSchema = z.object({
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

  productivityFactor: z
    .number()
    .min(1, "Minimum 1 hour per FP")
    .max(50, "Maximum 50 hours per FP")
    .optional(),
});

type ProjectConfigData = z.infer<typeof projectConfigSchema>;

interface CreateProjectConfigurationFormProps {
  estimateId: string;
  onSuccess: (data: ProjectConfigData) => void;
}

export const CreateProjectConfigurationForm = ({
  estimateId,
  onSuccess,
}: CreateProjectConfigurationFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProjectConfigData>({
    resolver: zodResolver(projectConfigSchema),
    defaultValues: {
      averageDailyWorkingHours: 8,
      teamSize: 4,
      hourlyRateBRL: 150,
      productivityFactor: 10,
    },
  });

  const teamSize = watch("teamSize");
  const averageDailyWorkingHours = watch("averageDailyWorkingHours");

  const estimatedDailyCapacity = teamSize * averageDailyWorkingHours;

  const onSubmit = async (data: ProjectConfigData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Update the estimate with project configuration data
      await estimateService.updateEstimate({
        id: estimateId,
        data: {
          averageDailyWorkingHours: data.averageDailyWorkingHours,
          teamSize: data.teamSize,
          hourlyRateBRL: data.hourlyRateBRL,
          productivityFactor: data.productivityFactor || 10,
        },
      });

      onSuccess(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("estimateForm.failedToUpdate")
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

          <div>
            <label
              htmlFor="productivityFactor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("estimateForm.productivityFactor")} *
            </label>
            <input
              {...register("productivityFactor", { valueAsNumber: true })}
              type="number"
              min="1"
              max="50"
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {t("estimateForm.productivityFactorHelp")}
            </p>
            {errors.productivityFactor && (
              <p className="mt-1 text-sm text-red-600">
                {errors.productivityFactor.message}
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
                {estimatedDailyCapacity} Hrs/d
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
        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting
            ? t("estimateForm.saving")
            : t("estimateForm.saveConfiguration")}
        </Button>
      </div>
    </form>
  );
};
