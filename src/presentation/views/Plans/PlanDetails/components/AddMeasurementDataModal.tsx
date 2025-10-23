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

  // Update cycleId when preSelectedCycleId changes
  useEffect(() => {
    if (preSelectedCycleId) {
      setFormData(prev => ({ ...prev, cycleId: preSelectedCycleId }));
    }
  }, [preSelectedCycleId]);

  const allMeasurements = useMemo(() => {
    const measurements: MeasurementOption[] = [];

    plan.objectives?.forEach((obj: any) => {
      obj.questions?.forEach((q: any) => {
        q.metrics?.forEach((m: any) => {
          m.measurements?.forEach((meas: any, idx: number) => {
            measurements.push({
              id: `${obj._id || obj.objectiveTitle}-${q._id || q.questionText}-${m._id || m.metricName}-${idx}`,
              objectiveId: obj._id || "",
              questionId: q._id || "",
              metricId: m._id || "",
              measurementDefinitionId: meas._id || `${m.metricMnemonic}-${idx}`,
              label: `${meas.measurementEntity} (${m.metricName} - ${obj.objectiveTitle})`,
              metricName: m.metricName,
              objectiveTitle: obj.objectiveTitle,
            });
          });
        });
      });
    });

    return measurements;
  }, [plan]);

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
      const measurementDate = new Date(formData.date);
      const cycleStart = new Date(selectedCycle.startDate);
      const cycleEnd = new Date(selectedCycle.endDate);

      if (measurementDate < cycleStart || measurementDate > cycleEnd) {
        setValidationError(t("monitoring.dateOutsideCycleRange"));
        return;
      }
    }

    if (!organizationId) {
      setValidationError("Organization ID is required");
      return;
    }

    try {
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
          date: formData.date,
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-default">
              {t("monitoring.addMeasurement")}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
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
                <div className="w-full border border-yellow-300 bg-yellow-50 rounded-md px-3 py-2 text-sm text-yellow-800">
                  {t("monitoring.noCyclesAvailable")}
                </div>
              ) : (
                <select
                  value={formData.cycleId}
                  onChange={(e) => {
                    setFormData({ ...formData, cycleId: e.target.value });
                  }}
                  disabled={!!preSelectedCycleId}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    preSelectedCycleId ? 'bg-gray-100 cursor-not-allowed' : ''
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
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                min={
                  selectedCycle
                    ? new Date(selectedCycle.startDate).toISOString().split("T")[0]
                    : undefined
                }
                max={
                  selectedCycle
                    ? new Date(selectedCycle.endDate).toISOString().split("T")[0]
                    : undefined
                }
                className="w-full"
              />
              {selectedCycle && (
                <p className="text-xs text-gray-500 mt-1">
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {(validationError || operationError) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">
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
