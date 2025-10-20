"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createEQSchema, type CreateEQData } from "@/core/schemas/fpa";
import { useFpaComponents } from "@/core/hooks/fpa/components/useFpaComponents";
import { Button } from "@/presentation/components/primitives";

interface CreateEQFormProps {
  estimateId: string;
  onSuccess: () => void;
}

export const CreateEQForm = ({ estimateId, onSuccess }: CreateEQFormProps) => {
  const { t } = useTranslation("fpa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateEQData>({
    resolver: zodResolver(createEQSchema),
    defaultValues: {
      name: "",
      description: "",
      primaryIntent: "",
      retrievalLogic: "",
      useSpecialCalculation: false,
      fileTypesReferenced: 0,
      dataElementTypes: 1,
      inputFtr: 0,
      inputDet: 1,
      outputFtr: 0,
      outputDet: 1,
    },
  });

  const { createEQComponent } = useFpaComponents();

  const useSpecialCalculation = watch("useSpecialCalculation");
  const inputFtr = watch("inputFtr");
  const inputDet = watch("inputDet");
  const outputFtr = watch("outputFtr");
  const outputDet = watch("outputDet");

  const calculateComplexity = (
    ftr: number = 0,
    det: number = 0
  ): "LOW" | "MEDIUM" | "HIGH" => {
    if (ftr <= 1) {
      if (det <= 15) return "LOW";
      return "MEDIUM";
    }
    if (ftr <= 3) {
      if (det <= 4) return "LOW";
      if (det <= 15) return "MEDIUM";
      return "HIGH";
    }
    if (det <= 4) return "MEDIUM";
    return "HIGH";
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "LOW":
        return "text-green-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "HIGH":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const inputComplexity =
    useSpecialCalculation &&
    inputFtr !== null &&
    inputFtr !== undefined &&
    inputDet !== null &&
    inputDet !== undefined
      ? calculateComplexity(inputFtr, inputDet)
      : null;

  const outputComplexity =
    useSpecialCalculation &&
    outputFtr !== null &&
    outputFtr !== undefined &&
    outputDet !== null &&
    outputDet !== undefined
      ? calculateComplexity(outputFtr, outputDet)
      : null;

  const onSubmit = async (data: CreateEQData) => {
    console.log("EQ Form onSubmit called with data:", data);
    console.log("Form errors:", errors);
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Creating EQ component...");
      await createEQComponent({ estimateId, data });
      console.log("EQ component created successfully");
      reset();
      onSuccess?.();
    } catch (err) {
      console.error("Error creating EQ component:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("componentForms.eq.failedToCreate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        console.log("Form submit event triggered");
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("componentForms.eq.componentNameLabel")}
          </label>
          <input
            {...register("name")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("componentForms.eq.componentNamePlaceholder")}
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
            {t("componentForms.eq.descriptionLabel")}
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("componentForms.eq.descriptionPlaceholder")}
          />
        </div>

        <div>
          <label
            htmlFor="primaryIntent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("componentForms.eq.primaryIntentLabel")}
          </label>
          <input
            {...register("primaryIntent")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("componentForms.eq.primaryIntentPlaceholder")}
          />
        </div>
      </div>

      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-lg font-semibold px-2">
          {t("componentForms.eq.calculationMethod")}
        </legend>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              {...register("useSpecialCalculation")}
              type="checkbox"
              className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              onChange={(e) => {
                setValue("useSpecialCalculation", e.target.checked);
                if (e.target.checked) {
                  setValue("fileTypesReferenced", undefined);
                  setValue("dataElementTypes", undefined);
                } else {
                  setValue("inputFtr", undefined);
                  setValue("inputDet", undefined);
                  setValue("outputFtr", undefined);
                  setValue("outputDet", undefined);
                }
              }}
            />
            <span className="text-sm font-medium text-gray-700">
              {t("componentForms.eq.useSpecialCalculation")}
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            {t("componentForms.eq.specialCalculationRecommendation")}
          </p>
        </div>

        {!useSpecialCalculation ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fileTypesReferenced"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("componentForms.eq.ftrReferencedFiles")}
              </label>
              <input
                {...register("fileTypesReferenced", { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="2"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("componentForms.eq.ftrReferencedFilesHelp")}
              </p>
              {errors.fileTypesReferenced && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fileTypesReferenced.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dataElementTypes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("componentForms.eq.detDataElements")}
              </label>
              <input
                {...register("dataElementTypes", { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="10"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("componentForms.eq.detDataElementsHelp")}
              </p>
              {errors.dataElementTypes && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dataElementTypes.message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">
                {t("componentForms.eq.inputPart")}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="inputFtr"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("componentForms.eq.inputFtr")}
                  </label>
                  <input
                    {...register("inputFtr", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("componentForms.eq.inputFtrHelp")}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="inputDet"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("componentForms.eq.inputDet")}
                  </label>
                  <input
                    {...register("inputDet", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="5"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("componentForms.eq.inputDetHelp")}
                  </p>
                </div>
              </div>
              {inputComplexity && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">
                    {t("componentForms.eq.inputComplexity")}:{" "}
                  </span>
                  <span
                    className={`font-medium ${getComplexityColor(
                      inputComplexity
                    )}`}
                  >
                    {t(`complexityLabels.${inputComplexity}`)}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">
                {t("componentForms.eq.outputPart")}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="outputFtr"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("componentForms.eq.outputFtr")}
                  </label>
                  <input
                    {...register("outputFtr", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("componentForms.eq.outputFtrHelp")}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="outputDet"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("componentForms.eq.outputDet")}
                  </label>
                  <input
                    {...register("outputDet", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="12"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("componentForms.eq.outputDetHelp")}
                  </p>
                </div>
              </div>
              {outputComplexity && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">
                    {t("componentForms.eq.outputComplexity")}:{" "}
                  </span>
                  <span
                    className={`font-medium ${getComplexityColor(
                      outputComplexity
                    )}`}
                  >
                    {t(`complexityLabels.${outputComplexity}`)}
                  </span>
                </div>
              )}
            </div>

            {inputComplexity && outputComplexity && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>{t("componentForms.eq.finalComplexity")}:</strong>{" "}
                  {t("componentForms.eq.finalComplexityExplanation", {
                    complexity: t(
                      `complexityLabels.${
                        inputComplexity === outputComplexity
                          ? inputComplexity
                          : inputComplexity === "HIGH" ||
                            outputComplexity === "HIGH"
                          ? "HIGH"
                          : inputComplexity === "MEDIUM" ||
                            outputComplexity === "MEDIUM"
                          ? "MEDIUM"
                          : "LOW"
                      }`
                    ).toLowerCase(),
                  })}
                </p>
              </div>
            )}
          </>
        )}
      </fieldset>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors.root.message}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          size="md"
        >
          {isSubmitting
            ? t("componentForms.eq.creating")
            : t("componentForms.eq.createComponent")}
        </Button>
      </div>
    </form>
  );
};
