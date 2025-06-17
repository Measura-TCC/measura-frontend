"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CreateGSCForm } from "../FPAWorkflow/components/CreateGSCForm";

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
    {
      key: "data_communications",
      label: t("adjustmentFactors.data_communications"),
      index: 0,
    },
    {
      key: "distributed_processing",
      label: t("adjustmentFactors.distributed_processing"),
      index: 1,
    },
    { key: "performance", label: t("adjustmentFactors.performance"), index: 2 },
    {
      key: "configuration",
      label: t("adjustmentFactors.configuration"),
      index: 3,
    },
    {
      key: "transaction_rate",
      label: t("adjustmentFactors.transaction_rate"),
      index: 4,
    },
    {
      key: "online_data_entry",
      label: t("adjustmentFactors.online_data_entry"),
      index: 5,
    },
    {
      key: "end_user_efficiency",
      label: t("adjustmentFactors.end_user_efficiency"),
      index: 6,
    },
    {
      key: "online_update",
      label: t("adjustmentFactors.online_update"),
      index: 7,
    },
    {
      key: "complex_processing",
      label: t("adjustmentFactors.complex_processing"),
      index: 8,
    },
    { key: "reusability", label: t("adjustmentFactors.reusability"), index: 9 },
    {
      key: "installation_ease",
      label: t("adjustmentFactors.installation_ease"),
      index: 10,
    },
    {
      key: "operational_ease",
      label: t("adjustmentFactors.operational_ease"),
      index: 11,
    },
    {
      key: "multiple_sites",
      label: t("adjustmentFactors.multiple_sites"),
      index: 12,
    },
    {
      key: "facilitate_change",
      label: t("adjustmentFactors.facilitate_change"),
      index: 13,
    },
  ];

  const hasGSCData =
    estimate.generalSystemCharacteristics &&
    estimate.generalSystemCharacteristics.length === 14;

  const getRadarData = () => {
    if (!hasGSCData) return [];

    return gscFields.map((field) => ({
      characteristic: field.label,
      value: estimate.generalSystemCharacteristics![field.index],
      fullMark: 5,
    }));
  };

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
            <h3 className="text-lg font-semibold text-default">
              {t("forms.generalSystemCharacteristics")}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-secondary border border-border rounded-md hover:bg-background-secondary transition-colors"
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
        <h3 className="text-lg font-semibold text-default">
          {t("forms.generalSystemCharacteristics")}
        </h3>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {t("forms.editGSC")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg border border-border p-6">
          <h4 className="text-base font-semibold text-default mb-4">
            {t("forms.generalSystemCharacteristics")} -{" "}
            {t("overview.performance")}
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">
                {t("forms.totalDegreeOfInfluence")}:
              </span>
              <span className="font-medium text-default">
                {estimate.totalDegreeOfInfluence}/70
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">
                {t("forms.valueAdjustmentFactor")}:
              </span>
              <span className="font-medium text-default">
                {estimate.valueAdjustmentFactor}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">
                {t("overview.average")}
              </span>
              <span className="font-medium text-default">
                {(estimate.totalDegreeOfInfluence / 14).toFixed(2)}/5.0
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg border border-border p-6">
          <h4 className="text-base font-semibold text-default mb-4">
            {t("charts.gscRadarChart")}
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={getRadarData()} style={{ cursor: "pointer" }}>
                <PolarGrid
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeOpacity={0.8}
                  radialLines={true}
                />
                <PolarAngleAxis
                  dataKey="characteristic"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  className="text-xs"
                />
                <PolarRadiusAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickCount={6}
                />
                <Radar
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value}/5`,
                    t("charts.tooltips.rating"),
                  ]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    color: "#1f2937",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{
                    color: "#1f2937",
                    fontWeight: "500",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border p-6">
        <h4 className="text-base font-semibold text-default mb-4">
          {t("overview.componentSummary")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gscFields.map((field) => {
            const value = estimate.generalSystemCharacteristics![
              field.index
            ] as number;
            return (
              <div
                key={field.key}
                className="flex justify-between items-center py-2"
              >
                <span className="text-sm font-medium text-secondary flex-1">
                  {field.label}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-default w-8 text-center">
                    {value}
                  </span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          level <= value
                            ? "bg-primary"
                            : "bg-background-secondary"
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
