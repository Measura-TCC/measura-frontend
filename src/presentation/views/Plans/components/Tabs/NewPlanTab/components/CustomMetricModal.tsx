import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Tabs,
} from "@/presentation/components/primitives";
import { Stepper } from "@/presentation/components/primitives/Stepper/Stepper";
import type { Metric, Measurement } from "../utils/types";
import { availableMetrics } from "../utils/stepData";
import { CustomMeasurementModal } from "./CustomMeasurementModal";
import { PlusIcon, TrashIcon } from "@/presentation/assets/icons";

interface CustomMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMetric: (metric: Metric) => void;
  editingData?: Metric;
}

export const CustomMetricModal: React.FC<CustomMetricModalProps> = ({
  isOpen,
  onClose,
  onAddMetric,
  editingData,
}) => {
  const { t } = useTranslation("plans");
  const [selectedTab, setSelectedTab] = useState(editingData ? "custom" : "predefined");
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Metric details, Step 2: Measurements

  // If editing data contains translation keys, translate them for display
  const getTranslatedValue = (value: string | undefined, prefix: string) => {
    if (!value) return "";
    if (value.startsWith(prefix)) {
      return t(value);
    }
    return value;
  };

  const [customMetric, setCustomMetric] = useState<Omit<Metric, "measurements">>({
    metricName: getTranslatedValue(editingData?.metricName, "metrics."),
    metricDescription: getTranslatedValue(editingData?.metricDescription, "metrics.descriptions."),
    metricMnemonic: editingData?.metricMnemonic || "",
    metricFormula: editingData?.metricFormula || "",
    metricControlRange: editingData?.metricControlRange || [0, 100],
    analysisProcedure: getTranslatedValue(editingData?.analysisProcedure, "analysis.procedures."),
    analysisFrequency: getTranslatedValue(editingData?.analysisFrequency, "analysis.frequency."),
    analysisResponsible: getTranslatedValue(editingData?.analysisResponsible, "analysis.responsible."),
  });
  const [measurements, setMeasurements] = useState<Measurement[]>(editingData?.measurements || []);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);

  // Update state when editingData changes
  useEffect(() => {
    if (editingData) {
      setCustomMetric({
        metricName: getTranslatedValue(editingData.metricName, "metrics."),
        metricDescription: getTranslatedValue(editingData.metricDescription, "metrics.descriptions."),
        metricMnemonic: editingData.metricMnemonic || "",
        metricFormula: editingData.metricFormula || "",
        metricControlRange: editingData.metricControlRange || [0, 100],
        analysisProcedure: getTranslatedValue(editingData.analysisProcedure, "analysis.procedures."),
        analysisFrequency: getTranslatedValue(editingData.analysisFrequency, "analysis.frequency."),
        analysisResponsible: getTranslatedValue(editingData.analysisResponsible, "analysis.responsible."),
      });
      setMeasurements(editingData.measurements || []);
    }
  }, [editingData]);

  const isStep1Valid =
    customMetric.metricName.trim() &&
    customMetric.metricDescription?.trim() &&
    customMetric.metricMnemonic?.trim() &&
    customMetric.metricFormula?.trim();

  const handleAddPredefinedMetric = (metric: Metric) => {
    onAddMetric(metric);
    onClose();
  };

  const handleAddMeasurement = (measurement: Measurement) => {
    setMeasurements((prev) => [...prev, measurement]);
  };

  const handleRemoveMeasurement = (index: number) => {
    setMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateCustomMetric = () => {
    if (!customMetric.metricName.trim() || measurements.length === 0) return;

    const newMetric: Metric = {
      ...customMetric,
      measurements,
    };

    onAddMetric(newMetric);
    onClose();

    // Reset form
    setCustomMetric({
      metricName: "",
      metricDescription: "",
      metricMnemonic: "",
      metricFormula: "",
      metricControlRange: [0, 100],
      analysisProcedure: "",
      analysisFrequency: "",
      analysisResponsible: "",
    });
    setMeasurements([]);
  };

  const handleClose = () => {
    setSelectedTab("predefined");
    setCurrentStep(1);
    setCustomMetric({
      metricName: "",
      metricDescription: "",
      metricMnemonic: "",
      metricFormula: "",
      metricControlRange: [0, 100],
      analysisProcedure: "",
      analysisFrequency: "",
      analysisResponsible: "",
    });
    setMeasurements([]);
    onClose();
  };

  const handleNextStep = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/40 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingData ? t("editMetric") : t("modals.customMetric.title")}
            </h2>
            <button onClick={handleClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer text-2xl leading-none">
              ×
            </button>
          </div>

          {!editingData && (
            <div className="mb-4">
              <Tabs
                tabs={[
                  { id: "predefined", label: t("modals.customMetric.predefinedTab") },
                  { id: "custom", label: t("modals.customMetric.customTab") },
                ]}
                activeTab={selectedTab}
                onTabChange={(tab) => {
                  setSelectedTab(tab);
                  setCurrentStep(1); // Reset to step 1 when switching tabs
                }}
              />
            </div>
          )}

          {/* Step Indicator for Custom Tab */}
          {(editingData || selectedTab === 'custom') && (
            <Stepper
              steps={[
                { number: 1, label: t("metric.metricName") },
                { number: 2, label: t("metric.measurements") },
              ]}
              currentStep={currentStep}
              onStepClick={(step) => {
                // Allow going back to step 1 if on step 2
                if (step === 1 && currentStep === 2) {
                  setCurrentStep(1);
                }
                // Allow going to step 2 if step 1 is valid
                if (step === 2 && isStep1Valid) {
                  setCurrentStep(2);
                }
              }}
              canNavigateTo={(step) => {
                if (step === 1) return true; // Can always go back to step 1
                if (step === 2) return isStep1Valid; // Can only go to step 2 if step 1 is valid
                return false;
              }}
              className="mb-6"
            />
          )}

          {!editingData && selectedTab === 'predefined' && (
            <div className="space-y-4">
            <p className="text-sm text-secondary">
              {t("modals.customMetric.predefinedDescription")}
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableMetrics.map((metric) => (
                <div
                  key={metric.metricName}
                  className="border border-border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleAddPredefinedMetric(metric)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-default">
                      {t(metric.metricName)}
                    </h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {metric.metricMnemonic}
                    </span>
                  </div>
                  <p className="text-sm text-secondary mb-2">
                    {metric.metricDescription ? t(metric.metricDescription) : "No description available"}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{t("metric.metricFormula")}:</span>{" "}
                    {metric.metricFormula}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="font-medium">{t("measurement.measurementsCount")}:</span>{" "}
                    {metric.measurements.length}
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}

          {(editingData || selectedTab === 'custom') && currentStep === 1 && (
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("metric.metricName")} *
                </label>
                <Input
                  value={customMetric.metricName}
                  onChange={(e) =>
                    setCustomMetric((prev) => ({
                      ...prev,
                      metricName: e.target.value,
                    }))
                  }
                  placeholder={t("modals.customMetric.namePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("metric.metricMnemonic")} *
                </label>
                <Input
                  value={customMetric.metricMnemonic}
                  onChange={(e) =>
                    setCustomMetric((prev) => ({
                      ...prev,
                      metricMnemonic: e.target.value.slice(0, 3),
                    }))
                  }
                  placeholder={t("modals.customMetric.mnemonicPlaceholder")}
                  maxLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("metric.metricDescription")} *
              </label>
              <textarea
                value={customMetric.metricDescription}
                onChange={(e) =>
                  setCustomMetric((prev) => ({
                    ...prev,
                    metricDescription: e.target.value,
                  }))
                }
                placeholder={t("modals.customMetric.descriptionPlaceholder")}
                rows={3}
                className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-gray-800 text-default"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("metric.metricFormula")} *
              </label>
              <Input
                value={customMetric.metricFormula}
                onChange={(e) =>
                  setCustomMetric((prev) => ({
                    ...prev,
                    metricFormula: e.target.value,
                  }))
                }
                placeholder={t("modals.customMetric.formulaPlaceholder")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("modals.customMetric.minRange")}
                </label>
                <Input
                  type="number"
                  value={customMetric.metricControlRange?.[0] ?? 0}
                  onChange={(e) =>
                    setCustomMetric((prev) => ({
                      ...prev,
                      metricControlRange: [
                        Number(e.target.value),
                        prev.metricControlRange?.[1] ?? 100,
                      ],
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("modals.customMetric.maxRange")}
                </label>
                <Input
                  type="number"
                  value={customMetric.metricControlRange?.[1] ?? 100}
                  onChange={(e) =>
                    setCustomMetric((prev) => ({
                      ...prev,
                      metricControlRange: [
                        prev.metricControlRange?.[0] ?? 0,
                        Number(e.target.value),
                      ],
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("metric.analysisProcedure")}
              </label>
              <textarea
                value={customMetric.analysisProcedure}
                onChange={(e) =>
                  setCustomMetric((prev) => ({
                    ...prev,
                    analysisProcedure: e.target.value,
                  }))
                }
                placeholder={t("modals.customMetric.analysisProcedurePlaceholder")}
                rows={3}
                className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-gray-800 text-default"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("metric.analysisFrequency")}
                </label>
                <Input
                  value={customMetric.analysisFrequency}
                  onChange={(e) =>
                    setCustomMetric((prev) => ({
                      ...prev,
                      analysisFrequency: e.target.value,
                    }))
                  }
                  placeholder={t("modals.customMetric.analysisFrequencyPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("metric.analysisResponsible")}
                </label>
                <Input
                  value={customMetric.analysisResponsible}
                  onChange={(e) =>
                    setCustomMetric((prev) => ({
                      ...prev,
                      analysisResponsible: e.target.value,
                    }))
                  }
                  placeholder={t("modals.customMetric.analysisResponsiblePlaceholder")}
                />
              </div>
            </div>
            </div>
          )}

          {/* Step 2: Measurements */}
          {(editingData || selectedTab === 'custom') && currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t("metric.measurements")} são necessárias para definir como a métrica será medida. Adicione pelo menos uma medida.
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-default">
                  {t("metric.measurements")} ({measurements.length})
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowMeasurementModal(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  {t("measurement.addMeasurement")}
                </Button>
              </div>

              {measurements.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-3">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {t("noMeasurementsYet")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Clique em "Adicionar Medida" para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {measurements.map((measurement, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-4 flex items-start justify-between bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <h5 className="font-medium text-sm text-default">
                            {measurement.measurementEntity?.startsWith("metrics.measurementEntities.")
                              ? t(measurement.measurementEntity)
                              : measurement.measurementEntity}
                          </h5>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {measurement.measurementAcronym}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-secondary ml-8">
                          <div>
                            <span className="font-medium">{t("measurement.measurementUnit")}:</span>{" "}
                            {measurement.measurementUnit?.startsWith("units.")
                              ? t(measurement.measurementUnit)
                              : measurement.measurementUnit}
                          </div>
                          <div>
                            <span className="font-medium">{t("measurement.measurementFrequency")}:</span>{" "}
                            {measurement.measurementFrequency?.startsWith("measurements.frequency.")
                              ? t(measurement.measurementFrequency)
                              : measurement.measurementFrequency}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMeasurement(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors"
                        title="Remover medida"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              {(editingData || selectedTab === "custom") && currentStep === 2 && (
                <Button variant="secondary" onClick={handlePreviousStep}>
                  ← {t("back")}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleClose}>
                {t("modals.customMetric.cancel")}
              </Button>
              {(editingData || selectedTab === "custom") && currentStep === 1 && (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStep1Valid}
                >
                  {t("next")} →
                </Button>
              )}
              {(editingData || selectedTab === "custom") && currentStep === 2 && (
                <Button
                  onClick={handleCreateCustomMetric}
                  disabled={measurements.length === 0}
                >
                  {editingData ? t("updateMetric") : t("modals.customMetric.create")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomMeasurementModal
        isOpen={showMeasurementModal}
        onClose={() => setShowMeasurementModal(false)}
        onAddMeasurement={handleAddMeasurement}
        existingMeasurements={measurements}
      />
    </div>
  );
};