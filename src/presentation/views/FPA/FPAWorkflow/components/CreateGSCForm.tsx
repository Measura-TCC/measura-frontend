"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createGSCSchema, type CreateGSCData } from "@/core/schemas/fpa";
import { useState } from "react";
import { Button } from "@/presentation/components/primitives/Button/Button";

interface CreateGSCFormProps {
  onSuccess?: (gsc: number[]) => void;
  initialValues?: {
    dataProcessing?: number;
    performanceRequirements?: number;
    heavilyUsedConfiguration?: number;
    transactionRate?: number;
    onlineDataEntry?: number;
    endUserEfficiency?: number;
    onlineUpdate?: number;
    complexProcessing?: number;
    reusability?: number;
    installationEase?: number;
    operationalEase?: number;
    multipleSites?: number;
    facilitateChange?: number;
    distributedFunctions?: number;
    notes?: string;
  };
}

export const CreateGSCForm = ({
  onSuccess,
  initialValues,
}: CreateGSCFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGSCData>({
    resolver: zodResolver(createGSCSchema),
    defaultValues: {
      dataProcessing: initialValues?.dataProcessing || 0,
      performanceRequirements: initialValues?.performanceRequirements || 0,
      heavilyUsedConfiguration: initialValues?.heavilyUsedConfiguration || 0,
      transactionRate: initialValues?.transactionRate || 0,
      onlineDataEntry: initialValues?.onlineDataEntry || 0,
      endUserEfficiency: initialValues?.endUserEfficiency || 0,
      onlineUpdate: initialValues?.onlineUpdate || 0,
      complexProcessing: initialValues?.complexProcessing || 0,
      reusability: initialValues?.reusability || 0,
      installationEase: initialValues?.installationEase || 0,
      operationalEase: initialValues?.operationalEase || 0,
      multipleSites: initialValues?.multipleSites || 0,
      facilitateChange: initialValues?.facilitateChange || 0,
      distributedFunctions: initialValues?.distributedFunctions || 0,
      notes: initialValues?.notes || "",
    },
  });

  const onSubmit = async (data: CreateGSCData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const generalSystemCharacteristics = [
        data.dataProcessing,
        data.performanceRequirements,
        data.heavilyUsedConfiguration,
        data.transactionRate,
        data.onlineDataEntry,
        data.endUserEfficiency,
        data.onlineUpdate,
        data.complexProcessing,
        data.reusability,
        data.installationEase,
        data.operationalEase,
        data.multipleSites,
        data.facilitateChange,
        data.distributedFunctions,
      ];

      onSuccess?.(generalSystemCharacteristics);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save GSC data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const gscFields = [
    { name: "dataProcessing", label: t("forms.dataProcessing") },
    {
      name: "performanceRequirements",
      label: t("forms.performanceRequirements"),
    },
    {
      name: "heavilyUsedConfiguration",
      label: t("forms.heavilyUsedConfiguration"),
    },
    { name: "transactionRate", label: t("forms.transactionRate") },
    { name: "onlineDataEntry", label: t("forms.onlineDataEntry") },
    { name: "endUserEfficiency", label: t("forms.endUserEfficiency") },
    { name: "onlineUpdate", label: t("forms.onlineUpdate") },
    { name: "complexProcessing", label: t("forms.complexProcessing") },
    { name: "reusability", label: t("forms.reusability") },
    { name: "installationEase", label: t("forms.installationEase") },
    { name: "operationalEase", label: t("forms.operationalEase") },
    { name: "multipleSites", label: t("forms.multipleSites") },
    { name: "facilitateChange", label: t("forms.facilitateChange") },
    { name: "distributedFunctions", label: t("forms.distributedFunctions") },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("forms.generalSystemCharacteristics")}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {t("forms.gscDescription")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gscFields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <select
                {...register(field.name as keyof CreateGSCData, {
                  valueAsNumber: true,
                })}
                id={field.name}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              {errors[field.name as keyof CreateGSCData] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[field.name as keyof CreateGSCData]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            {t("forms.notes")}
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
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? t("estimateForm.saving") : t("estimateForm.saveGSC")}
        </Button>
      </div>
    </form>
  );
};
