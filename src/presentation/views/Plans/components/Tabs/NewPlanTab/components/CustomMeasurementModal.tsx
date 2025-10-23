import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Tabs,
} from "@/presentation/components/primitives";
import type { Measurement } from "../utils/types";
import { availableMeasurements } from "../utils/stepData";

interface CustomMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeasurement: (measurement: Measurement) => void;
  existingMeasurements: Measurement[];
}

export const CustomMeasurementModal: React.FC<CustomMeasurementModalProps> = ({
  isOpen,
  onClose,
  onAddMeasurement,
  existingMeasurements,
}) => {
  const { t } = useTranslation("plans");
  const [selectedTab, setSelectedTab] = useState("predefined");
  const [customMeasurement, setCustomMeasurement] = useState<Measurement>({
    measurementEntity: "",
    measurementAcronym: "",
    measurementProperties: "",
    measurementUnit: "",
    measurementScale: "",
    measurementProcedure: "",
    measurementFrequency: "",
    measurementResponsible: "",
  });

  const availablePredefined = availableMeasurements.filter(
    (measurement) =>
      !existingMeasurements.some(
        (existing) => existing.measurementAcronym === measurement.measurementAcronym
      )
  );

  const handleAddPredefinedMeasurement = (measurement: Measurement) => {
    onAddMeasurement(measurement);
    onClose();
  };

  const handleCreateCustomMeasurement = () => {
    if (!customMeasurement.measurementEntity.trim() || !customMeasurement.measurementAcronym.trim()) {
      return;
    }

    onAddMeasurement(customMeasurement);
    onClose();

    // Reset form
    setCustomMeasurement({
      measurementEntity: "",
      measurementAcronym: "",
      measurementProperties: "",
      measurementUnit: "",
      measurementScale: "",
      measurementProcedure: "",
      measurementFrequency: "",
      measurementResponsible: "",
    });
  };

  const handleClose = () => {
    setSelectedTab("predefined");
    setCustomMeasurement({
      measurementEntity: "",
      measurementAcronym: "",
      measurementProperties: "",
      measurementUnit: "",
      measurementScale: "",
      measurementProcedure: "",
      measurementFrequency: "",
      measurementResponsible: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t("modals.customMeasurement.title")}</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
              ×
            </button>
          </div>

          <div className="mb-4">
            <Tabs
              tabs={[
                { id: "predefined", label: t("modals.customMetric.predefinedTab") },
                { id: "custom", label: t("modals.customMetric.customTab") },
              ]}
              activeTab={selectedTab}
              onTabChange={setSelectedTab}
            />
          </div>

          {selectedTab === 'predefined' && (
            <div className="space-y-4">
            <p className="text-sm text-secondary">
              {t("measurement.selectMeasurement")}
            </p>

            {availablePredefined.length === 0 ? (
              <div className="text-center p-8 text-secondary">
                No predefined measurements available
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availablePredefined.map((measurement) => (
                  <div
                    key={measurement.measurementAcronym}
                    className="border border-border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddPredefinedMeasurement(measurement)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-default">
                        {t(measurement.measurementEntity)}
                      </h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {measurement.measurementAcronym}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-2">
                      {t(measurement.measurementProperties)}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">{t("measurement.measurementUnit")}:</span>{" "}
                        {t(measurement.measurementUnit)}
                      </div>
                      <div>
                        <span className="font-medium">{t("measurement.measurementScale")}:</span>{" "}
                        {t(measurement.measurementScale)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">{t("measurement.measurementFrequency")}:</span>{" "}
                      {t(measurement.measurementFrequency)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {selectedTab === 'custom' && (
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("measurement.measurementEntity")} *
                </label>
                <Input
                  value={customMeasurement.measurementEntity}
                  onChange={(e) =>
                    setCustomMeasurement((prev) => ({
                      ...prev,
                      measurementEntity: e.target.value,
                    }))
                  }
                  placeholder={t("modals.customMeasurement.entityPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("measurement.measurementAcronym")} *
                </label>
                <Input
                  value={customMeasurement.measurementAcronym}
                  onChange={(e) =>
                    setCustomMeasurement((prev) => ({
                      ...prev,
                      measurementAcronym: e.target.value.slice(0, 3).toUpperCase(),
                    }))
                  }
                  placeholder={t("modals.customMeasurement.acronymPlaceholder")}
                  maxLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("measurement.measurementProperties")} *
              </label>
              <textarea
                value={customMeasurement.measurementProperties}
                onChange={(e) =>
                  setCustomMeasurement((prev) => ({
                    ...prev,
                    measurementProperties: e.target.value,
                  }))
                }
                placeholder={t("modals.customMeasurement.propertiesPlaceholder")}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("measurement.measurementUnit")} *
                </label>
                <Input
                  value={customMeasurement.measurementUnit}
                  onChange={(e) =>
                    setCustomMeasurement((prev) => ({
                      ...prev,
                      measurementUnit: e.target.value,
                    }))
                  }
                  placeholder={t("modals.customMeasurement.unitPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("measurement.measurementScale")} *
                </label>
                <select
                  value={customMeasurement.measurementScale}
                  onChange={(e) =>
                    setCustomMeasurement((prev) => ({
                      ...prev,
                      measurementScale: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
                >
                  <option value="">{t("modals.customMeasurement.scalePlaceholder")}</option>
                  <option value="scales.continuous">{t("scales.continuous")}</option>
                  <option value="scales.discrete">{t("scales.discrete")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("measurement.measurementProcedure")} *
              </label>
              <textarea
                value={customMeasurement.measurementProcedure}
                onChange={(e) =>
                  setCustomMeasurement((prev) => ({
                    ...prev,
                    measurementProcedure: e.target.value,
                  }))
                }
                placeholder={t("modals.customMeasurement.procedurePlaceholder")}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("measurement.measurementFrequency")} *
                </label>
                <Input
                  value={customMeasurement.measurementFrequency}
                  onChange={(e) =>
                    setCustomMeasurement((prev) => ({
                      ...prev,
                      measurementFrequency: e.target.value,
                    }))
                  }
                  placeholder={t("modals.customMeasurement.frequencyPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("measurement.measurementResponsible")}
                </label>
                <Input
                  value={customMeasurement.measurementResponsible}
                  onChange={(e) =>
                    setCustomMeasurement((prev) => ({
                      ...prev,
                      measurementResponsible: e.target.value,
                    }))
                  }
                  placeholder={t("modals.customMeasurement.responsiblePlaceholder")}
                />
              </div>
            </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="secondary" onClick={handleClose}>
              {t("modals.customMeasurement.cancel")}
            </Button>
            {selectedTab === "custom" && (
              <Button
                onClick={handleCreateCustomMeasurement}
                disabled={
                  !customMeasurement.measurementEntity.trim() ||
                  !customMeasurement.measurementAcronym.trim() ||
                  !customMeasurement.measurementProperties.trim() ||
                  !customMeasurement.measurementUnit.trim() ||
                  !customMeasurement.measurementScale.trim() ||
                  !customMeasurement.measurementProcedure.trim() ||
                  !customMeasurement.measurementFrequency.trim()
                }
              >
                {t("modals.customMeasurement.create")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};