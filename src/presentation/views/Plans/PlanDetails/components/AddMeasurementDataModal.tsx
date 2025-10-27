import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, SearchableDropdown } from "@/presentation/components/primitives";
import { useMeasurementData } from "@/core/hooks/measurementPlans";
import { useOrganizations } from "@/core/hooks/organizations";
import type { MeasurementPlanResponseDto, MeasurementCycle } from "@/core/types/plans";

interface AddMeasurementDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MeasurementPlanResponseDto;
  planId: string;
  cycles: MeasurementCycle[];
  preSelectedCycleId?: string;
}

interface MeasurementOption {
  id: string;
  objectiveId: string;
  questionId: string;
  metricId: string;
  measurementDefinitionId: string;
  label: string;
  metricName: string;
  objectiveTitle: string;
}

export const AddMeasurementDataModal: React.FC<AddMeasurementDataModalProps> = ({
  isOpen,
  onClose,
  plan,
  planId,
  cycles,
  preSelectedCycleId,
}) => {
  const { t } = useTranslation("plans");
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { addMeasurementData, isAdding, operationError } = useMeasurementData();
  const organizationId = userOrganization?._id;
  const [formData, setFormData] = useState({
    cycleId: preSelectedCycleId || "",
    selectedMeasurement: null as MeasurementOption | null,
    value: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dateAdjustedMessage, setDateAdjustedMessage] = useState<boolean>(false);

  // Update cycleId and date when preSelectedCycleId changes
  useEffect(() => {
    if (preSelectedCycleId) {
      const selectedCycle = cycles.find(c => c._id === preSelectedCycleId);
      const today = new Date().toISOString().split("T")[0];
      let initialDate = today;
      let wasAdjusted = false;

      if (selectedCycle) {
        // Convert UTC dates to local dates to avoid timezone offset
        const cycleStartDate = new Date(selectedCycle.startDate);
        const cycleEndDate = new Date(selectedCycle.endDate);

        // Get local date in YYYY-MM-DD format
        const cycleStart = new Date(cycleStartDate.getTime() - cycleStartDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
        const cycleEnd = new Date(cycleEndDate.getTime() - cycleEndDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];

        // If today is within cycle range, use today; otherwise use cycle start date
        if (today < cycleStart || today > cycleEnd) {
          initialDate = cycleStart;
          wasAdjusted = true;
        }
      }

      setFormData(prev => ({
        ...prev,
        cycleId: preSelectedCycleId,
        date: initialDate
      }));
      setDateAdjustedMessage(wasAdjusted);
    }
  }, [preSelectedCycleId, cycles]);

  const allMeasurements = useMemo(() => {
    const measurements: MeasurementOption[] = [];
    const addedMeasurements = new Set<string>();

    plan.objectives?.forEach((obj: any) => {
      obj.questions?.forEach((q: any) => {
        q.metrics?.forEach((m: any) => {
          m.measurements?.forEach((meas: any, idx: number) => {
            const measurementKey = `${meas._id || meas.measurementAcronym}-${m._id}`;
            if (!addedMeasurements.has(measurementKey)) {
              addedMeasurements.add(measurementKey);
              const entityLabel = meas.measurementEntity?.startsWith("metrics.measurementEntities.") || meas.measurementEntity?.startsWith("entities.")
                ? t(meas.measurementEntity.startsWith("metrics.measurementEntities.") ? meas.measurementEntity.replace("metrics.measurementEntities.", "entities.") : meas.measurementEntity)
                : meas.measurementEntity;

              measurements.push({
                id: `${obj._id || obj.objectiveTitle}-${q._id || q.questionText}-${m._id || m.metricName}-${idx}`,
                objectiveId: obj._id || "",
                questionId: q._id || "",
                metricId: m._id || "",
                measurementDefinitionId: meas._id || `${m.metricMnemonic}-${idx}`,
                label: `${m.metricMnemonic || m.metricName} → ${entityLabel} [${meas.measurementAcronym}]`,
                metricName: m.metricName,
                objectiveTitle: obj.objectiveTitle,
              });
            }
          });
        });
      });
    });

    // Sort by metric name for better organization
    return measurements.sort((a, b) => a.metricName.localeCompare(b.metricName));
  }, [plan, t]);

  const selectedCycle = cycles.find((c) => c._id === formData.cycleId);

  const handleSubmit = async () => {
    setValidationError(null);

    if (!formData.cycleId) {
      setValidationError(t("monitoring.selectCycle") + " " + t("monitoring.required"));
      return;
    }

    if (!formData.selectedMeasurement) {
      setValidationError(t("monitoring.selectMeasurement") + " " + t("monitoring.required"));
      return;
    }

    if (!formData.value || isNaN(parseFloat(formData.value))) {
      setValidationError(t("monitoring.measurementValue") + " " + t("monitoring.required"));
      return;
    }

    if (!formData.date) {
      setValidationError(t("monitoring.measurementDate") + " " + t("monitoring.required"));
      return;
    }

    if (selectedCycle) {
      // Convert UTC dates to local dates for proper comparison
      const cycleStartDate = new Date(selectedCycle.startDate);
      const cycleEndDate = new Date(selectedCycle.endDate);

      const cycleStart = new Date(cycleStartDate.getTime() - cycleStartDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
      const cycleEnd = new Date(cycleEndDate.getTime() - cycleEndDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

      if (formData.date < cycleStart || formData.date > cycleEnd) {
        setValidationError(t("monitoring.dateOutsideCycleRange"));
        return;
      }
    }

    if (!organizationId) {
      setValidationError("Organization ID is required");
      return;
    }

    try {
      // Convert local date to UTC for backend
      // Since backend stores "2025-11-13" for what user sees as "2025-11-12" in UTC-3
      // We need to add 1 day to match the backend's UTC storage
      const [year, month, day] = formData.date.split('-').map(Number);
      const utcDate = new Date(Date.UTC(year, month - 1, day + 1))
        .toISOString()
        .split("T")[0];

      await addMeasurementData({
        organizationId,
        planId,
        objectiveId: formData.selectedMeasurement.objectiveId,
        questionId: formData.selectedMeasurement.questionId,
        metricId: formData.selectedMeasurement.metricId,
        data: {
          cycleId: formData.cycleId,
          measurementDefinitionId: formData.selectedMeasurement.measurementDefinitionId,
          value: parseFloat(formData.value),
          date: utcDate,
          notes: formData.notes || undefined,
        },
      });

      setFormData({
        cycleId: "",
        selectedMeasurement: null,
        value: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setDateAdjustedMessage(false);
      onClose();
    } catch (error) {
      console.error("Failed to add measurement data:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      cycleId: "",
      selectedMeasurement: null,
      value: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setValidationError(null);
    setDateAdjustedMessage(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-default">
              {t("monitoring.addMeasurement")}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("monitoring.selectCycle")}
              </label>
              {cycles.length === 0 ? (
                <div className="w-full border border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 rounded-md px-3 py-2 text-sm text-yellow-800 dark:text-yellow-300">
                  {t("monitoring.noCyclesAvailable")}
                </div>
              ) : (
                <select
                  value={formData.cycleId}
                  onChange={(e) => {
                    const newCycleId = e.target.value;
                    const newCycle = cycles.find(c => c._id === newCycleId);
                    const today = new Date().toISOString().split("T")[0];
                    let newDate = today;
                    let wasAdjusted = false;

                    if (newCycle) {
                      // Convert UTC dates to local dates to avoid timezone offset
                      const cycleStartDate = new Date(newCycle.startDate);
                      const cycleEndDate = new Date(newCycle.endDate);

                      // Get local date in YYYY-MM-DD format
                      const cycleStart = new Date(cycleStartDate.getTime() - cycleStartDate.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0];
                      const cycleEnd = new Date(cycleEndDate.getTime() - cycleEndDate.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0];

                      // If current date is outside cycle range, set to cycle start
                      if (today < cycleStart || today > cycleEnd) {
                        newDate = cycleStart;
                        wasAdjusted = true;
                      }
                    }

                    setFormData({ ...formData, cycleId: newCycleId, date: newDate });
                    setDateAdjustedMessage(wasAdjusted);
                  }}
                  disabled={!!preSelectedCycleId}
                  className={`w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    preSelectedCycleId ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">{t("monitoring.selectCycle")}</option>
                  {cycles.map((cycle) => (
                    <option key={cycle._id} value={cycle._id}>
                      {cycle.cycleName} ({new Date(cycle.startDate).toLocaleDateString('pt-BR')} -{" "}
                      {new Date(cycle.endDate).toLocaleDateString('pt-BR')})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("monitoring.selectMeasurement")}
              </label>
              <SearchableDropdown
                items={allMeasurements.map(m => ({
                  id: m.id,
                  label: m.label,
                  value: m.id,
                }))}
                value={formData.selectedMeasurement?.id}
                onChange={(val) => {
                  const selected = allMeasurements.find(m => m.id === val);
                  setFormData({ ...formData, selectedMeasurement: selected || null });
                }}
                placeholder={t("monitoring.selectMeasurement")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("monitoring.measurementValue")}
              </label>
              <Input
                type="number"
                step="any"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                placeholder={t("monitoring.measurementValue")}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("monitoring.measurementDate")}
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  setDateAdjustedMessage(false); // Clear message when user manually changes date
                }}
                min={
                  selectedCycle
                    ? new Date(new Date(selectedCycle.startDate).getTime() - new Date(selectedCycle.startDate).getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0]
                    : undefined
                }
                max={
                  selectedCycle
                    ? new Date(new Date(selectedCycle.endDate).getTime() - new Date(selectedCycle.endDate).getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0]
                    : undefined
                }
                className="w-full"
              />
              {dateAdjustedMessage && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    ℹ️ {t("monitoring.dateAdjustedToCycleStart")}
                  </p>
                </div>
              )}
              {selectedCycle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("monitoring.selectCycle")}: {new Date(selectedCycle.startDate).toLocaleDateString('pt-BR')} -{" "}
                  {new Date(selectedCycle.endDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("monitoring.notes")} ({t("optional")})
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder={t("monitoring.notes")}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {(validationError || operationError) && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-300">
                  {validationError || operationError}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={handleClose} disabled={isAdding}>
              {t("monitoring.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={isAdding}>
              {isAdding ? t("saving") : t("monitoring.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
