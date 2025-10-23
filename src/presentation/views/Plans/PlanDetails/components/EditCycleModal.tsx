import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/presentation/components/primitives";
import { useMeasurementCycles } from "@/core/hooks/measurementPlans";
import type { MeasurementCycle } from "@/core/types/plans";

interface EditCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycle: MeasurementCycle;
  planId: string;
  hasMeasurements?: boolean;
  measurementCount?: number;
}

export const EditCycleModal: React.FC<EditCycleModalProps> = ({
  isOpen,
  onClose,
  cycle,
  planId,
  hasMeasurements = false,
  measurementCount = 0,
}) => {
  const { t } = useTranslation("plans");
  const { updateCycle, deleteCycle, isUpdating, isDeleting, operationError } =
    useMeasurementCycles({ planId });
  const [formData, setFormData] = useState({
    cycleName: "",
    startDate: "",
    endDate: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (cycle) {
      setFormData({
        cycleName: cycle.cycleName,
        startDate: new Date(cycle.startDate).toISOString().split("T")[0],
        endDate: new Date(cycle.endDate).toISOString().split("T")[0],
      });
    }
  }, [cycle]);

  const handleUpdate = async () => {
    setValidationError(null);

    if (!formData.cycleName.trim()) {
      setValidationError(t("monitoring.cycleName") + " " + t("monitoring.required"));
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setValidationError(t("monitoring.required"));
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      setValidationError(t("monitoring.endDateMustBeAfterStart"));
      return;
    }

    try {
      await updateCycle(cycle._id, {
        cycleName: formData.cycleName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update cycle:", error);
    }
  };

  const handleDelete = async () => {
    if (hasMeasurements && !showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      await deleteCycle(cycle._id);
      onClose();
    } catch (error) {
      console.error("Failed to delete cycle:", error);
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
              {t("monitoring.editCycle")}
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
                  {t("monitoring.cycleDeleteWarning", { count: measurementCount })}
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
                  {isDeleting ? t("deleting") : t("monitoring.confirmDelete")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-default mb-1">
                    {t("monitoring.cycleName")}
                  </label>
                  <Input
                    type="text"
                    value={formData.cycleName}
                    onChange={(e) =>
                      setFormData({ ...formData, cycleName: e.target.value })
                    }
                    placeholder={t("monitoring.cycleName")}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-default mb-1">
                    {t("monitoring.startDate")}
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-default mb-1">
                    {t("monitoring.endDate")}
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    min={formData.startDate}
                    className="w-full"
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
                  {t("monitoring.deleteCycle")}
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
