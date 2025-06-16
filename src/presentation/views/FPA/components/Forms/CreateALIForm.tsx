"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createALISchema, type CreateALIData } from "@/core/schemas/fpa";
import { useFpaComponents } from "@/core/hooks/fpa/components/useFpaComponents";
import { useState } from "react";

interface CreateALIFormProps {
  estimateId: string;
  onSuccess?: (ali: unknown) => void;
}

export const CreateALIForm = ({
  estimateId,
  onSuccess,
}: CreateALIFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateALIData>({
    resolver: zodResolver(createALISchema),
    defaultValues: {
      recordElementTypes: 1,
      dataElementTypes: 1,
    },
  });

  const { createALIComponent } = useFpaComponents();

  const onSubmit = async (data: CreateALIData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createALIComponent({ estimateId, data });
      reset();
      onSuccess?.(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("componentForms.ali.failedToCreate")
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
          {t("componentForms.ali.name")}
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
          placeholder={t("componentForms.ali.primaryIntentPlaceholder")}
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
          htmlFor="recordElementTypes"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.ali.recordElementTypes")}
        </label>
        <input
          {...register("recordElementTypes", { valueAsNumber: true })}
          id="recordElementTypes"
          type="number"
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.recordElementTypes && (
          <p className="mt-1 text-sm text-red-600">
            {errors.recordElementTypes.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="dataElementTypes"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.ali.dataElementTypes")}
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? t("componentForms.ali.submitting")
            : t("componentForms.ali.submit")}
        </button>
      </div>
    </form>
  );
};
