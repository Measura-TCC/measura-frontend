import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/presentation/components/primitives";
import { useMeasurementData } from "@/core/hooks/measurementPlans";
import { useOrganizations } from "@/core/hooks/organizations";
import type { CycleWithData } from "@/core/types/plans";

interface EditMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurement: CycleWithData["measurements"][0];
  planId: string;
  cycleStartDate: string;
  cycleEndDate: string;
}

export const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  isOpen,
  onClose,
  measurement,
  planId,
  cycleStartDate,
  cycleEndDate,
}) => {
  const { t } = useTranslation("plans");
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { updateMeasurementData, deleteMeasurementData, isUpdating, isDeleting, operationError } =
    useMeasurementData();
  const organizationId = userOrganization?._id;
  const [formData, setFormData] = useState({
    value: "",
    date: "",
    notes: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (measurement) {
      setFormData({
        value: measurement.value.toString(),
        date: new Date(measurement.date).toISOString().split("T")[0],
        notes: measurement.notes || "",
      });
    }
  }, [measurement]);

  const handleUpdate = async () => {
    setValidationError(null);

    if (!formData.value || isNaN(parseFloat(formData.value))) {
      setValidationError(t("monitoring.measurementValue") + " " + t("monitoring.required"));
      return;
    }

    if (!formData.date) {
      setValidationError(t("monitoring.measurementDate") + " " + t("monitoring.required"));
      return;
    }

    const measurementDate = new Date(formData.date);
    const cycleStart = new Date(cycleStartDate);
    const cycleEnd = new Date(cycleEndDate);

    if (measurementDate < cycleStart || measurementDate > cycleEnd) {
      setValidationError(t("monitoring.dateOutsideCycleRange"));
      return;
    }

    if (!organizationId) {
      setValidationError("Organization ID is required");
      return;
    }

    try {
      await updateMeasurementData({
        organizationId,
        planId,
        measurementDataId: measurement._id,
        data: {
          value: parseFloat(formData.value),
          date: formData.date,
          notes: formData.notes || undefined,
        },
      });
      onClose();
    } catch (error) {
      console.error("Failed to update measurement:", error);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    if (!organizationId) {
      setValidationError("Organization ID is required");
      return;
    }

    try {
      await deleteMeasurementData({
        organizationId,
        planId,
        measurementDataId: measurement._id,
      });
      onClose();
    } catch (error) {
      console.error("Failed to delete measurement:", error);
    }
  };

  const handleClose = () => {
    setValidationError(null);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-default">
              {t("monitoring.editMeasurement")}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          {showDeleteConfirm ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  {t("monitoring.confirmDelete")}?
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  {t("monitoring.cancel")}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? t("deleting") : t("monitoring.delete")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {measurement.measurementDefinitionName} ({measurement.metricName})
                </p>
              </div>

              <div className="space-y-4">
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
                    min={cycleStartDate.split("T")[0]}
                    max={cycleEndDate.split("T")[0]}
                    className="w-full"
                  />
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

              <div className="flex justify-between mt-6">
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={isUpdating || isDeleting}
                  className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                >
                  {t("monitoring.delete")}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isUpdating || isDeleting}
                  >
                    {t("monitoring.cancel")}
                  </Button>
                  <Button onClick={handleUpdate} disabled={isUpdating || isDeleting}>
                    {isUpdating ? t("saving") : t("monitoring.save")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
