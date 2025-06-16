"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateGSCForm } from "./Forms/CreateGSCForm";

interface GSCDisplayProps {
  estimate: {
    _id: string;
    totalDegreeOfInfluence: number;
    valueAdjustmentFactor: number;
    generalSystemCharacteristics?: number[];
  };
  onUpdate: (generalSystemCharacteristics: number[]) => Promise<void>;
}

export const GSCDisplay = ({ estimate, onUpdate }: GSCDisplayProps) => {
  const { t } = useTranslation("fpa");
  const [isEditing, setIsEditing] = useState(false);

  const gscFields = [
    { key: "dataProcessing", label: t("forms.dataProcessing"), index: 0 },
    {
      key: "performanceRequirements",
      label: t("forms.performanceRequirements"),
      index: 1,
    },
    {
      key: "heavilyUsedConfiguration",
      label: t("forms.heavilyUsedConfiguration"),
      index: 2,
    },
    { key: "transactionRate", label: t("forms.transactionRate"), index: 3 },
    { key: "onlineDataEntry", label: t("forms.onlineDataEntry"), index: 4 },
    { key: "endUserEfficiency", label: t("forms.endUserEfficiency"), index: 5 },
    { key: "onlineUpdate", label: t("forms.onlineUpdate"), index: 6 },
    { key: "complexProcessing", label: t("forms.complexProcessing"), index: 7 },
    { key: "reusability", label: t("forms.reusability"), index: 8 },
    { key: "installationEase", label: t("forms.installationEase"), index: 9 },
    { key: "operationalEase", label: t("forms.operationalEase"), index: 10 },
    { key: "multipleSites", label: t("forms.multipleSites"), index: 11 },
    { key: "facilitateChange", label: t("forms.facilitateChange"), index: 12 },
    {
      key: "distributedFunctions",
      label: t("forms.distributedFunctions"),
      index: 13,
    },
  ];

  const hasGSCData =
    estimate.generalSystemCharacteristics &&
    estimate.generalSystemCharacteristics.length === 14;

  const handleUpdateSuccess = async (
    generalSystemCharacteristics: number[]
  ) => {
    await onUpdate(generalSystemCharacteristics);
    setIsEditing(false);
  };

  const getInitialValues = () => {
    if (!hasGSCData) return undefined;

    const gsc = estimate.generalSystemCharacteristics!;
    return {
      dataProcessing: gsc[0] || 0,
      performanceRequirements: gsc[1] || 0,
      heavilyUsedConfiguration: gsc[2] || 0,
      transactionRate: gsc[3] || 0,
      onlineDataEntry: gsc[4] || 0,
      endUserEfficiency: gsc[5] || 0,
      onlineUpdate: gsc[6] || 0,
      complexProcessing: gsc[7] || 0,
      reusability: gsc[8] || 0,
      installationEase: gsc[9] || 0,
      operationalEase: gsc[10] || 0,
      multipleSites: gsc[11] || 0,
      facilitateChange: gsc[12] || 0,
      distributedFunctions: gsc[13] || 0,
    };
  };

  if (isEditing || !hasGSCData) {
    return (
      <div className="space-y-4">
        {hasGSCData && (
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {t("forms.generalSystemCharacteristics")}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {t("forms.cancel")}
            </button>
          </div>
        )}
        <CreateGSCForm
          onSuccess={handleUpdateSuccess}
          initialValues={getInitialValues()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {t("forms.generalSystemCharacteristics")}
        </h3>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {t("forms.editGSC")}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gscFields.map((field) => {
            const value = estimate.generalSystemCharacteristics![
              field.index
            ] as number;
            return (
              <div
                key={field.key}
                className="flex justify-between items-center"
              >
                <span className="text-sm font-medium text-gray-700">
                  {field.label}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">{value}</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= value ? "bg-indigo-500" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
