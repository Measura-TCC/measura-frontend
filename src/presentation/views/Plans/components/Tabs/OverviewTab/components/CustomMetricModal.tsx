import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
} from "@/presentation/components/primitives";
import type { Metric } from "../utils/types";
import { availableMetrics } from "../utils/stepData";

interface CustomMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMetric: (metric: Metric) => void;
}

export const CustomMetricModal: React.FC<CustomMetricModalProps> = ({
  isOpen,
  onClose,
  onAddMetric,
}) => {
  const { t } = useTranslation("plans");
  const [selectedTab, setSelectedTab] = useState("predefined");
  const [customMetric, setCustomMetric] = useState<Omit<Metric, "measurements">>({
    metricName: "",
    metricDescription: "",
    metricMnemonic: "",
    metricFormula: "",
    metricControlRange: [0, 100],
    analysisProcedure: "",
    analysisFrequency: "",
    analysisResponsible: "",
  });

  const handleAddPredefinedMetric = (metric: Metric) => {
    onAddMetric(metric);
    onClose();
  };

  const handleCreateCustomMetric = () => {
    if (!customMetric.metricName.trim()) return;

    const newMetric: Metric = {
      ...customMetric,
      measurements: [], // Start with empty measurements array
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
  };

  const handleClose = () => {
    setSelectedTab("predefined");
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t("modals.customMetric.title")}</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>

          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${selectedTab === 'predefined' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('predefined')}
              >
                {t("modals.customMetric.predefinedTab")}
              </button>
              <button
                className={`px-4 py-2 ${selectedTab === 'custom' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
                onClick={() => setSelectedTab('custom')}
              >
                {t("modals.customMetric.customTab")}
              </button>
            </div>
          </div>

          {selectedTab === 'predefined' && (
            <div className="space-y-4">
            <p className="text-sm text-secondary">
              {t("modals.customMetric.predefinedDescription")}
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableMetrics.map((metric) => (
                <div
                  key={metric.metricName}
                  className="border border-border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
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
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">{t("metric.metricFormula")}:</span>{" "}
                    {metric.metricFormula}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">{t("measurement.measurementsCount")}:</span>{" "}
                    {metric.measurements.length}
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}

          {selectedTab === 'custom' && (
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
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
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
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
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

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="secondary" onClick={handleClose}>
              {t("modals.customMetric.cancel")}
            </Button>
            {selectedTab === "custom" && (
              <Button
                onClick={handleCreateCustomMetric}
                disabled={
                  !customMetric.metricName.trim() ||
                  !customMetric.metricDescription?.trim() ||
                  !customMetric.metricMnemonic?.trim() ||
                  !customMetric.metricFormula?.trim()
                }
              >
                {t("modals.customMetric.create")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};