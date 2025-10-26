"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createAIESchema, type CreateAIEData } from "@/core/schemas/fpa";
import { useFpaComponents } from "@/core/hooks/fpa/components/useFpaComponents";
import { useState } from "react";
import { Button } from "@/presentation/components/primitives";

interface CreateAIEFormProps {
  estimateId: string;
  onSuccess?: (aie: unknown) => void;
  componentToEdit?: {
    _id: string;
    name: string;
    description?: string;
    primaryIntent?: string;
    recordElementTypes?: number;
    dataElementTypes?: number;
    externalSystem?: string;
    notes?: string;
  };
}

export const CreateAIEForm = ({
  estimateId,
  onSuccess,
  componentToEdit,
}: CreateAIEFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!componentToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAIEData>({
    resolver: zodResolver(createAIESchema),
    defaultValues: componentToEdit
      ? {
          name: componentToEdit.name,
          description: componentToEdit.description || "",
          primaryIntent: componentToEdit.primaryIntent || "",
          recordElementTypes: componentToEdit.recordElementTypes || 1,
          dataElementTypes: componentToEdit.dataElementTypes || 1,
          externalSystem: componentToEdit.externalSystem || "",
          notes: componentToEdit.notes || "",
        }
      : undefined,
  });

  const { createAIEComponent, updateAIEComponent } = useFpaComponents();

  const onSubmit = async (data: CreateAIEData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        const result = await updateAIEComponent({
          estimateId,
          id: componentToEdit._id,
          data,
        });
        onSuccess?.(result);
      } else {
        const result = await createAIEComponent({ estimateId, data });
        reset();
        onSuccess?.(result);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
          ? t("componentForms.aie.failedToUpdate")
          : t("componentForms.aie.failedToCreate")
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
          className="block text-sm font-medium text-secondary"
        >
          {t("componentForms.aie.name")}
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border-border bg-background text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-secondary"
        >
          {t("componentForms.descriptionOptional")}
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-border bg-background text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
          className="block text-sm font-medium text-secondary"
        >
          {t("componentForms.primaryIntent")}
        </label>
        <textarea
          {...register("primaryIntent")}
          id="primaryIntent"
          rows={3}
          placeholder={t("componentForms.aie.primaryIntentPlaceholder")}
          className="mt-1 block w-full rounded-md border-border bg-background text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
          className="block text-sm font-medium text-secondary"
        >
          {t("componentForms.aie.recordElementTypes")}
        </label>
        <input
          {...register("recordElementTypes", { valueAsNumber: true })}
          id="recordElementTypes"
          type="number"
          min="1"
          className="mt-1 block w-full rounded-md border-border bg-background text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
          className="block text-sm font-medium text-secondary"
        >
          {t("componentForms.aie.dataElementTypes")}
        </label>
        <input
          {...register("dataElementTypes", { valueAsNumber: true })}
          id="dataElementTypes"
          type="number"
          min="1"
          className="mt-1 block w-full rounded-md border-border bg-background text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.dataElementTypes && (
          <p className="mt-1 text-sm text-red-600">
            {errors.dataElementTypes.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="externalSystem"
          className="block text-sm font-medium text-secondary"
        >
          {t("componentForms.aie.externalSystem")}
        </label>
        <input
          {...register("externalSystem")}
          id="externalSystem"
          type="text"
          className="mt-1 block w-full rounded-md border-border bg-background text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.externalSystem && (
          <p className="mt-1 text-sm text-red-600">
            {errors.externalSystem.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-secondary"
        >
          {t("componentForms.notesOptional")}
        </label>
        <textarea
          {...register("notes")}
          id="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border-border bg-background text-default shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
              ? t("componentForms.aie.updating")
              : t("componentForms.aie.submitting")
            : isEditing
            ? t("componentForms.aie.update")
            : t("componentForms.aie.submit")}
        </Button>
      </div>
    </form>
  );
};
