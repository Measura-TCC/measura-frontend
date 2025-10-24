"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createEOSchema, type CreateEOData } from "@/core/schemas/fpa";
import { useFpaComponents } from "@/core/hooks/fpa/components/useFpaComponents";
import { useState } from "react";
import { Button } from "@/presentation/components/primitives";

interface CreateEOFormProps {
  estimateId: string;
  onSuccess?: (eo: unknown) => void;
  componentToEdit?: {
    _id: string;
    name: string;
    description?: string;
    primaryIntent?: string;
    derivedData?: boolean;
    outputFormat?: string;
    fileTypesReferenced?: number;
    dataElementTypes?: number;
    notes?: string;
  };
}

export const CreateEOForm = ({ estimateId, onSuccess, componentToEdit }: CreateEOFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!componentToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEOData>({
    resolver: zodResolver(createEOSchema),
    defaultValues: componentToEdit
      ? {
          name: componentToEdit.name,
          description: componentToEdit.description || "",
          primaryIntent: componentToEdit.primaryIntent || "",
          derivedData: componentToEdit.derivedData || false,
          outputFormat: componentToEdit.outputFormat || "",
          fileTypesReferenced: componentToEdit.fileTypesReferenced || 0,
          dataElementTypes: componentToEdit.dataElementTypes || 0,
          notes: componentToEdit.notes || "",
        }
      : undefined,
  });

  const { createEOComponent, updateEOComponent } = useFpaComponents();

  const onSubmit = async (data: CreateEOData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        const result = await updateEOComponent({
          estimateId,
          id: componentToEdit._id,
          data,
        });
        onSuccess?.(result);
      } else {
        const result = await createEOComponent({ estimateId, data });
        reset();
        onSuccess?.(result);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
          ? t("componentForms.eo.failedToUpdate")
          : t("componentForms.eo.failedToCreate")
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
          {t("componentForms.eo.name")}
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
          placeholder={t("componentForms.eo.primaryIntentPlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.primaryIntent && (
          <p className="mt-1 text-sm text-red-600">
            {errors.primaryIntent.message}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register("derivedData")}
          id="derivedData"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="derivedData"
          className="ml-2 block text-sm text-gray-900"
        >
          {t("componentForms.eo.derivedData")}
        </label>
        {errors.derivedData && (
          <p className="mt-1 text-sm text-red-600">
            {errors.derivedData.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="outputFormat"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.eo.outputFormat")}
        </label>
        <input
          {...register("outputFormat")}
          id="outputFormat"
          type="text"
          placeholder={t("componentForms.eo.outputFormatPlaceholder")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.outputFormat && (
          <p className="mt-1 text-sm text-red-600">
            {errors.outputFormat.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="fileTypesReferenced"
          className="block text-sm font-medium text-gray-700"
        >
          {t("componentForms.eo.fileTypesReferenced")}
        </label>
        <input
          {...register("fileTypesReferenced", { valueAsNumber: true })}
          id="fileTypesReferenced"
          type="number"
          min="0"
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
          {t("componentForms.eo.dataElementTypes")}
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
            ? isEditing
              ? t("componentForms.eo.updating")
              : t("componentForms.eo.submitting")
            : isEditing
            ? t("componentForms.eo.update")
            : t("componentForms.eo.submit")}
        </Button>
      </div>
    </form>
  );
};
