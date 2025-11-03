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
}

export const EditCycleModal: React.FC<EditCycleModalProps> = ({
  isOpen,
  onClose,
  cycle,
  planId,
  hasMeasurements = false,
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
      // Convert date-only string to ISO with time offset to preserve the date
      // formData.startDate is "YYYY-MM-DD", we append time to ensure correct date in UTC
      const adjustedStartDate = new Date(formData.startDate + 'T12:00:00');
      const adjustedEndDate = new Date(formData.endDate + 'T12:00:00');

      await updateCycle(cycle._id, {
        cycleName: formData.cycleName.trim(),
        startDate: adjustedStartDate.toISOString(),
        endDate: adjustedEndDate.toISOString(),
      });
      onClose();
    } catch (error) {
      console.error("Failed to update cycle:", error);
    }
  };

  const handleDelete = async () => {
    // hasMeasurements check is now done via disabled button
    // but keep safety check here as well
    if (hasMeasurements) {
      return;
    }

    try {
      await deleteCycle(cycle._id);
      onClose();
    } catch (error) {
      console.error("Failed to delete cycle:", error);
      // Error is handled by the hook and displayed via operationError
    }
  };

  const handleClose = () => {
    setValidationError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full mx-4 shadow-xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-default">
              {t("monitoring.editCycle")}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

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
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-sm text-red-600 dark:text-red-300">
                      {validationError || (operationError?.startsWith('monitoring.') ? t(operationError) : operationError)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <div className="relative group">
                  <Button
                    variant="secondary"
                    onClick={handleDelete}
                    disabled={isUpdating || isDeleting || hasMeasurements}
                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={hasMeasurements ? t("monitoring.cannotDeleteCycleWithMeasurements") : ""}
                  >
                    {t("monitoring.deleteCycle")}
                  </Button>
                  {hasMeasurements && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-2 px-3 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out">
                      {t("monitoring.cannotDeleteCycleWithMeasurements")}
                      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                  )}
                </div>

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
        </div>
      </div>
    </div>
  );
};
