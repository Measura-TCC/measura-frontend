"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createEISchema, type CreateEIData } from "@/core/schemas/fpa";
import { useFpaComponents } from "@/core/hooks/fpa/components/useFpaComponents";
import { useState } from "react";
import { Button } from "@/presentation/components/primitives";

interface EIResponse {
  _id: string;
  name: string;
  description?: string;
  primaryIntent: string;
  fileTypesReferenced: number;
  dataElementTypes: number;
  notes?: string;
  complexity: "LOW" | "MEDIUM" | "HIGH";
  functionPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateEIFormProps {
  estimateId: string;
  onSuccess?: (ei: EIResponse) => void;
}

export const CreateEIForm = ({ estimateId, onSuccess }: CreateEIFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEIData>({
    resolver: zodResolver(createEISchema),
  });

  const { createEIComponent } = useFpaComponents();

  const onSubmit = async (data: CreateEIData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createEIComponent({ estimateId, data });
      reset();
      onSuccess?.(result as unknown as EIResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("componentForms.ei.failedToCreate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.ei.name")}
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
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
          {t("componentForms.descriptionOptional")}
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
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
          htmlFor="primaryIntent"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.primaryIntent")}
        </label>
        <textarea
          {...register("primaryIntent")}
          id="primaryIntent"
          rows={3}
          placeholder={t("componentForms.ei.primaryIntentPlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.primaryIntent && (
          <p className="mt-1 text-sm text-red-600">
            {errors.primaryIntent.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="fileTypesReferenced"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.ei.fileTypesReferenced")}
        </label>
        <input
          {...register("fileTypesReferenced", { valueAsNumber: true })}
          id="fileTypesReferenced"
          type="number"
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.fileTypesReferenced && (
          <p className="mt-1 text-sm text-red-600">
            {errors.fileTypesReferenced.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="dataElementTypes"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.ei.dataElementTypes")}
        </label>
        <input
          {...register("dataElementTypes", { valueAsNumber: true })}
          id="dataElementTypes"
          type="number"
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.dataElementTypes && (
          <p className="mt-1 text-sm text-red-600">
            {errors.dataElementTypes.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.notesOptional")}
        </label>
        <textarea
          {...register("notes")}
          id="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
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
        >
          {isSubmitting
            ? t("componentForms.ei.submitting")
            : t("componentForms.ei.submit")}
        </Button>
      </div>
    </form>
  );
};
