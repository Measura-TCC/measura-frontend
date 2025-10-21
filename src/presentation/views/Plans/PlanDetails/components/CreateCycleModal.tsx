import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/presentation/components/primitives";
import { useMeasurementCycles } from "@/core/hooks/measurementPlans";

interface CreateCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
}

export const CreateCycleModal: React.FC<CreateCycleModalProps> = ({
  isOpen,
  onClose,
  planId,
}) => {
  const { t } = useTranslation("plans");
  const { createCycle, isCreating, operationError } = useMeasurementCycles({ planId });
  const [formData, setFormData] = useState({
    cycleName: "",
    startDate: "",
    endDate: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);

    if (!formData.cycleName.trim()) {
      setValidationError(t("monitoring.cycleName") + " " + t("required"));
      return;
    }

    if (!formData.startDate) {
      setValidationError(t("monitoring.startDate") + " " + t("required"));
      return;
    }

    if (!formData.endDate) {
      setValidationError(t("monitoring.endDate") + " " + t("required"));
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      setValidationError(t("monitoring.endDateMustBeAfterStart"));
      return;
    }

    try {
      await createCycle({
        cycleName: formData.cycleName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      setFormData({ cycleName: "", startDate: "", endDate: "" });
      onClose();
    } catch (error) {
      console.error("Failed to create cycle:", error);
    }
  };

  const handleClose = () => {
    setFormData({ cycleName: "", startDate: "", endDate: "" });
    setValidationError(null);
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
              {t("monitoring.createCycle")}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

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

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={handleClose} disabled={isCreating}>
              {t("monitoring.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating}>
              {isCreating ? t("creating") : t("monitoring.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
