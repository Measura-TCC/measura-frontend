"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import type { Requirement, ComponentType } from "@/core/types/fpa";
import { Button } from "@/presentation/components/primitives";
import {
  createALISchemaFactory,
  createAIESchemaFactory,
  createEISchemaFactory,
  createEOSchemaFactory,
  createEQSchemaFactory,
  type CreateALIData,
  type CreateAIEData,
  type CreateEIData,
  type CreateEOData,
  type CreateEQData,
} from "@/core/schemas/fpa";

interface RequirementFPAModalProps {
  requirement: Requirement;
  isOpen: boolean;
  onClose: () => void;
  onSave: (requirementId: string, fpaData: Record<string, unknown>) => void;
}

type FormData =
  | CreateALIData
  | CreateAIEData
  | CreateEIData
  | CreateEOData
  | CreateEQData;

export const RequirementFPAModal = ({
  requirement,
  isOpen,
  onClose,
  onSave,
}: RequirementFPAModalProps) => {
  const { t } = useTranslation("fpa");
  const { t: tValidation } = useTranslation("validation");

  const getSchemaForType = (type: ComponentType) => {
    switch (type) {
      case "ALI":
        return createALISchemaFactory(tValidation);
      case "AIE":
        return createAIESchemaFactory(tValidation);
      case "EI":
        return createEISchemaFactory(tValidation);
      case "EO":
        return createEOSchemaFactory(tValidation);
      case "EQ":
        return createEQSchemaFactory(tValidation);
    }
  };

  const schema = requirement.componentType
    ? getSchemaForType(requirement.componentType)
    : createALISchemaFactory(tValidation);
  const componentType = requirement.componentType || "ALI";

  const getDefaultValues = () => {
    const base = {
      name: (requirement as any).name || requirement.title,
      description:
        (requirement as any).description || requirement.description || "",
      primaryIntent: (requirement as any).primaryIntent || "",
      notes: (requirement as any).notes || "",
    };

    if (componentType === "ALI" || componentType === "AIE") {
      return {
        ...base,
        recordElementTypes: (requirement as any).recordElementTypes || 1,
        dataElementTypes: (requirement as any).dataElementTypes || 1,
        ...(componentType === "AIE" && {
          externalSystem: (requirement as any).externalSystem || "",
        }),
      };
    }

    if (componentType === "EI") {
      return {
        ...base,
        processingLogic: (requirement as any).processingLogic || "",
        fileTypesReferenced: (requirement as any).fileTypesReferenced || 0,
        dataElementTypes: (requirement as any).dataElementTypes || 0,
      };
    }

    if (componentType === "EO") {
      return {
        ...base,
        derivedData: (requirement as any).derivedData || false,
        outputFormat: (requirement as any).outputFormat || "",
        fileTypesReferenced: (requirement as any).fileTypesReferenced || 0,
        dataElementTypes: (requirement as any).dataElementTypes || 0,
      };
    }

    if (componentType === "EQ") {
      return {
        ...base,
        retrievalLogic: (requirement as any).retrievalLogic || "",
        useSpecialCalculation:
          (requirement as any).useSpecialCalculation || false,
        fileTypesReferenced: (requirement as any).fileTypesReferenced || 0,
        dataElementTypes: (requirement as any).dataElementTypes || 0,
      };
    }

    return base;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues());
    }
  }, [requirement._id, isOpen]);

  if (!isOpen || !requirement.componentType) return null;

  const onSubmit = (data: unknown) => {
    onSave(requirement._id, data as Record<string, unknown>);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] border flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t(`componentTypes.${componentType}`)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{requirement.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            handleSubmit(
              (data) => {
                onSubmit(data);
              },
              () => {
                // Validation failed - form will show errors
              }
            )(e);
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
            {/* Name field - ALL components */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {t(`componentForms.${componentType.toLowerCase()}.name`)}
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {String(errors.name.message || "")}
                </p>
              )}
            </div>

            {/* Description field - ALL components */}
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {String(errors.description?.message || "")}
                </p>
              )}
            </div>

            {/* Primary Intent - ALL components */}
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
                placeholder={t(
                  `componentForms.${componentType.toLowerCase()}.primaryIntentPlaceholder`
                )}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.primaryIntent && (
                <p className="mt-1 text-sm text-red-600">
                  {String(errors.primaryIntent?.message || "")}
                </p>
              )}
            </div>

            {/* ALI/AIE specific fields */}
            {(componentType === "ALI" || componentType === "AIE") && (
              <>
                <div>
                  <label
                    htmlFor="recordElementTypes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t(
                      `componentForms.${componentType.toLowerCase()}.recordElementTypes`
                    )}
                  </label>
                  <input
                    {...register("recordElementTypes", { valueAsNumber: true })}
                    id="recordElementTypes"
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.recordElementTypes && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.recordElementTypes?.message || "")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dataElementTypes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t(
                      `componentForms.${componentType.toLowerCase()}.dataElementTypes`
                    )}
                  </label>
                  <input
                    {...register("dataElementTypes", { valueAsNumber: true })}
                    id="dataElementTypes"
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.dataElementTypes && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.dataElementTypes?.message || "")}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* AIE specific field */}
            {componentType === "AIE" && (
              <div>
                <label
                  htmlFor="externalSystem"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("componentForms.aie.externalSystem")}
                </label>
                <input
                  {...register("externalSystem")}
                  id="externalSystem"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.externalSystem && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(errors.externalSystem?.message || "")}
                  </p>
                )}
              </div>
            )}

            {/* EI specific fields */}
            {componentType === "EI" && (
              <>
                <div>
                  <label
                    htmlFor="processingLogic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("componentForms.ei.processingLogic")}
                  </label>
                  <textarea
                    {...register("processingLogic")}
                    id="processingLogic"
                    rows={3}
                    placeholder={t(
                      "componentForms.ei.processingLogicPlaceholder"
                    )}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.processingLogic && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.processingLogic?.message || "")}
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
                    {...register("fileTypesReferenced", {
                      valueAsNumber: true,
                    })}
                    id="fileTypesReferenced"
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.fileTypesReferenced && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.fileTypesReferenced?.message || "")}
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
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.dataElementTypes && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.dataElementTypes?.message || "")}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* EO specific fields */}
            {componentType === "EO" && (
              <>
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
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.outputFormat && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.outputFormat?.message || "")}
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
                    {...register("fileTypesReferenced", {
                      valueAsNumber: true,
                    })}
                    id="fileTypesReferenced"
                    type="number"
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.fileTypesReferenced && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.fileTypesReferenced?.message || "")}
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
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.dataElementTypes && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.dataElementTypes?.message || "")}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* EQ specific fields */}
            {componentType === "EQ" && (
              <>
                <input
                  {...register("useSpecialCalculation")}
                  type="hidden"
                  value="false"
                />

                <div>
                  <label
                    htmlFor="retrievalLogic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("componentForms.eq.retrievalLogic")}
                  </label>
                  <textarea
                    {...register("retrievalLogic")}
                    id="retrievalLogic"
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.retrievalLogic && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.retrievalLogic?.message || "")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fileTypesReferenced"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("componentForms.eq.ftrReferencedFiles")}
                  </label>
                  <input
                    {...register("fileTypesReferenced", {
                      valueAsNumber: true,
                    })}
                    id="fileTypesReferenced"
                    type="number"
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.fileTypesReferenced && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.fileTypesReferenced?.message || "")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dataElementTypes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("componentForms.eq.detDataElements")}
                  </label>
                  <input
                    {...register("dataElementTypes", { valueAsNumber: true })}
                    id="dataElementTypes"
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.dataElementTypes && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.dataElementTypes?.message || "")}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Notes field - ALL components */}
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">
                  {String(errors.notes?.message || "")}
                </p>
              )}
            </div>
          </div>

          {errors.root && (
            <div className="mx-6 mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {String(errors.root.message || "Validation error")}
              </p>
            </div>
          )}

          <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 rounded-b-lg">
            <Button type="button" onClick={onClose} variant="secondary">
              {t("actions.cancel")}
            </Button>
            <Button type="submit" variant="primary">
              {t("actions.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
