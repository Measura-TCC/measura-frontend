import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
} from "@/presentation/components/primitives";
import { PlusIcon } from "@/presentation/assets/icons";
import type { Metric, Measurement } from "@/core/types/plans";
import { CustomMeasurementModal } from "./CustomMeasurementModal";

interface MetricAccordionProps {
  metric: Metric;
  metricIndex: number;
  onUpdateMetric: (updatedMetric: Metric) => void;
  onRemoveMetric: () => void;
}

export const MetricAccordion: React.FC<MetricAccordionProps> = ({
  metric,
  metricIndex,
  onUpdateMetric,
  onRemoveMetric,
}) => {
  const { t } = useTranslation("plans");
  const [isOpen, setIsOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);

  const handleAddMeasurement = (measurement: Measurement) => {
    const updatedMetric = {
      ...metric,
      measurements: [...metric.measurements, measurement],
    };
    onUpdateMetric(updatedMetric);
  };

  const handleRemoveMeasurement = (measurementIndex: number) => {
    const updatedMetric = {
      ...metric,
      measurements: metric.measurements.filter((_, index) => index !== measurementIndex),
    };
    onUpdateMetric(updatedMetric);
  };

  return (
    <>
      <div className="border border-border rounded-lg">
        <button
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              M{metricIndex + 1}
            </span>
            <div className="text-left">
              <div className="font-medium text-default">
                {t(metric.metricName)}
              </div>
              <div className="text-sm text-secondary">
                {t("accordion.measurementsCount", { count: metric.measurements.length })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveMetric();
              }}
              className="text-red-500 hover:text-red-700 text-sm p-1"
              title="Remove metric"
            >
              ×
            </button>
            <span className="text-gray-500">
              {isOpen ? '▼' : '▶'}
            </span>
          </div>
        </button>

        {isOpen && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <div className="space-y-4">
                {/* Metric Details */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{t("metric.metricDescription")}:</span>{" "}
                    {t(metric.metricDescription)}
                  </div>
                  <div>
                    <span className="font-medium">{t("metric.metricFormula")}:</span>{" "}
                    {metric.metricFormula}
                  </div>
                  <div>
                    <span className="font-medium">{t("metric.metricControlRange")}:</span>{" "}
                    [{metric.metricControlRange[0]}, {metric.metricControlRange[1]}]
                  </div>
                  <div>
                    <span className="font-medium">{t("metric.analysisProcedure")}:</span>{" "}
                    {t(metric.analysisProcedure)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">{t("metric.analysisFrequency")}:</span>{" "}
                      {t(metric.analysisFrequency)}
                    </div>
                    <div>
                      <span className="font-medium">{t("metric.analysisResponsible")}:</span>{" "}
                      {metric.analysisResponsible ? t(metric.analysisResponsible) : '-'}
                    </div>
                  </div>
                </div>

                {/* Measurements */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-default">
                      {t("metric.measurements")} ({metric.measurements.length})
                    </h5>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsMeasurementModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      {t("measurement.addMeasurement")}
                    </Button>
                  </div>

                  {metric.measurements.length === 0 ? (
                    <div className="text-center p-4 text-secondary bg-gray-50 rounded-lg">
                      No measurements added yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {metric.measurements.map((measurement, measurementIndex) => (
                        <div
                          key={`${measurement.measurementAcronym}-${measurementIndex}`}
                          className="border border-gray-200 rounded-lg p-3 bg-white"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                {measurement.measurementAcronym}
                              </span>
                              <h6 className="font-medium text-sm">
                                {t(measurement.measurementEntity)}
                              </h6>
                            </div>
                            <button
                              onClick={() => handleRemoveMeasurement(measurementIndex)}
                              className="text-red-500 hover:text-red-700 text-sm"
                              title="Remove measurement"
                            >
                              ×
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>
                              <span className="font-medium">{t("measurement.measurementProperties")}:</span>{" "}
                              {t(measurement.measurementProperties)}
                            </div>
                            <div>
                              <span className="font-medium">{t("measurement.measurementUnit")}:</span>{" "}
                              {t(measurement.measurementUnit)}
                            </div>
                            <div>
                              <span className="font-medium">{t("measurement.measurementScale")}:</span>{" "}
                              {t(measurement.measurementScale)}
                            </div>
                            <div>
                              <span className="font-medium">{t("measurement.measurementFrequency")}:</span>{" "}
                              {t(measurement.measurementFrequency)}
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-gray-600">
                            <div className="mb-1">
                              <span className="font-medium">{t("measurement.measurementProcedure")}:</span>{" "}
                              {t(measurement.measurementProcedure)}
                            </div>
                            {measurement.measurementResponsible && (
                              <div>
                                <span className="font-medium">{t("measurement.measurementResponsible")}:</span>{" "}
                                {t(measurement.measurementResponsible)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>

      <CustomMeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onAddMeasurement={handleAddMeasurement}
        existingMeasurements={metric.measurements}
      />
    </>
  );
};