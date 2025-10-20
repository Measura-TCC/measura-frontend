"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { type EstimateFormData } from "@/core/hooks/fpa/useFPAWorkflowStore";
import { Button } from "@/presentation/components/primitives";

const createEstimateFormSchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("fpa.name.required"))
      .max(100, t("fpa.name.maxLength")),
    description: z
      .string()
      .min(10, t("project.description.minLength"))
      .max(500, t("fpa.description.maxLength")),
    applicationBoundary: z.string().min(1, t("fpa.applicationBoundary.required")),
    countingScope: z.string().min(1, t("fpa.countingScope.required")),
    countType: z.enum([
      "DEVELOPMENT_PROJECT",
      "ENHANCEMENT_PROJECT",
      "APPLICATION_PROJECT",
    ]),
  });

interface CreateEstimateFormProps {
  projectId: string;
  initialData?: Partial<EstimateFormData>;
  onSuccess: (data: EstimateFormData) => void;
  onBack: () => void;
}

export const CreateEstimateForm = ({
  projectId,
  initialData,
  onSuccess,
  onBack,
}: CreateEstimateFormProps) => {
  const { t } = useTranslation("validation");
  const { t: tFpa } = useTranslation("fpa");
  const [error, setError] = useState<string | null>(null);

  const estimateSchema = useMemo(
    () => createEstimateFormSchemaFactory(t),
    [t]
  );

  type FormData = z.infer<typeof estimateSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      countType: initialData?.countType || "DEVELOPMENT_PROJECT",
      applicationBoundary: initialData?.applicationBoundary || "",
      countingScope: initialData?.countingScope || "",
    },
  });

  const onSubmit = (data: FormData) => {
    try {
      setError(null);
      onSuccess(data as EstimateFormData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save estimate data"
      );
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
          {tFpa("estimateForm.estimateInformation")}
        </legend>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {tFpa("estimateForm.estimateName")} *
            </label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={tFpa("estimateForm.estimateNamePlaceholder")}
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
              {tFpa("estimateForm.description")}
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={tFpa("estimateForm.descriptionPlaceholder")}
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
              {tFpa("estimateForm.applicationBoundary")} *
            </label>
            <input
              {...register("applicationBoundary")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={tFpa("estimateForm.applicationBoundaryPlaceholder")}
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
              {tFpa("estimateForm.countingScope")} *
            </label>
            <textarea
              {...register("countingScope")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={tFpa("estimateForm.countingScopePlaceholder")}
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
              {tFpa("estimateForm.countType")} *
            </label>
            <select
              {...register("countType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="DEVELOPMENT_PROJECT">
                {tFpa("estimateForm.developmentProject")}
              </option>
              <option value="ENHANCEMENT_PROJECT">
                {tFpa("estimateForm.enhancementProject")}
              </option>
              <option value="APPLICATION_PROJECT">
                {tFpa("estimateForm.applicationProject")}
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

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onBack}
          variant="secondary"
          size="md"
        >
          Voltar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
        >
          Próximo
        </Button>
      </div>
    </form>
  );
};
