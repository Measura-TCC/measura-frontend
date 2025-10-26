import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import type { CycleWithData, MeasurementPlanResponseDto } from "@/core/types/plans";
import { EditCycleModal } from "./EditCycleModal";
import { EditMeasurementModal } from "./EditMeasurementModal";
import { AddMeasurementDataModal } from "./AddMeasurementDataModal";

interface CycleAccordionProps {
  cycleData: CycleWithData;
  planId: string;
  plan: MeasurementPlanResponseDto;
}

export const CycleAccordion: React.FC<CycleAccordionProps> = ({
  cycleData,
  planId,
  plan,
}) => {
  const { t } = useTranslation("plans");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditCycleModalOpen, setIsEditCycleModalOpen] = useState(false);
  const [isAddMeasurementModalOpen, setIsAddMeasurementModalOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<CycleWithData["measurements"][0] | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <div className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div
            className="flex items-center gap-3 text-left flex-1 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div>
              <div className="font-medium text-default text-base">
                {cycleData.cycle.cycleName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(cycleData.cycle.startDate)} -{" "}
                {formatDate(cycleData.cycle.endDate)} •{" "}
                {cycleData.measurementCount} {t("monitoring.measurementsInCycle")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditCycleModalOpen(true);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
              title={t("monitoring.editCycle")}
            >
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <span className="text-gray-500 dark:text-gray-400">
              {isOpen ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                onClick={() => setIsAddMeasurementModalOpen(true)}
              >
                + {t("monitoring.addMeasurementToCycle")}
              </Button>
            </div>

            {cycleData.measurements.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>{t("monitoring.noMeasurementsInCycle")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cycleData.measurements.map((measurement) => (
                  <div
                    key={measurement._id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-default">
                              {measurement.measurementDefinitionName}
                              {measurement.measurementAcronym && (
                                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                                  {measurement.measurementAcronym}
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {measurement.metricName} • {measurement.objectiveTitle}
                            </p>
                          </div>

                          <button
                            onClick={() => setEditingMeasurement(measurement)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                            title={t("monitoring.editMeasurement")}
                          >
                            <svg
                              className="w-4 h-4 text-gray-600 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {t("monitoring.value")}:
                            </span>
                            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                              {measurement.value}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {t("monitoring.measurementDate")}:
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              {formatDate(measurement.date)}
                            </p>
                          </div>
                        </div>

                        {measurement.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {t("monitoring.notes")}:
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {measurement.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <EditCycleModal
        isOpen={isEditCycleModalOpen}
        onClose={() => setIsEditCycleModalOpen(false)}
        cycle={cycleData.cycle}
        planId={planId}
        hasMeasurements={cycleData.measurements.length > 0}
        measurementCount={cycleData.measurementCount}
      />

      {editingMeasurement && (
        <EditMeasurementModal
          isOpen={!!editingMeasurement}
          onClose={() => setEditingMeasurement(null)}
          measurement={editingMeasurement}
          planId={planId}
          cycleStartDate={cycleData.cycle.startDate}
          cycleEndDate={cycleData.cycle.endDate}
        />
      )}

      <AddMeasurementDataModal
        isOpen={isAddMeasurementModalOpen}
        onClose={() => setIsAddMeasurementModalOpen(false)}
        plan={plan}
        planId={planId}
        cycles={[cycleData.cycle]}
        preSelectedCycleId={cycleData.cycle._id}
      />
    </>
  );
};
