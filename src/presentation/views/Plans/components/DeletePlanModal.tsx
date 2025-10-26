import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import { useToast } from "@/core/hooks/common/useToast";
import { MeasurementPlanStatus, type MeasurementPlanSummaryDto } from "@/core/types/plans";

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MeasurementPlanSummaryDto;
  onDelete: (planId: string) => Promise<void>;
  isDeleting: boolean;
}

export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onDelete,
  isDeleting,
}) => {
  const { t } = useTranslation("plans");
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const canDelete = plan.status === MeasurementPlanStatus.DRAFT;

  const handleDelete = async () => {
    if (!canDelete) {
      setError(t("cannotDeleteActive"));
      return;
    }

    setError(null);

    try {
      await onDelete(plan.id);

      toast.success({
        message: t("deletePlanSuccess", { planName: plan.planName }),
      });

      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("deletePlanError");
      setError(errorMessage);

      toast.error({
        message: errorMessage,
      });
    }
  };

  const handleClose = () => {
    setError(null);
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
              {t("deletePlanTitle")}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {!canDelete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  {t("deletePlanWarning")}
                </p>
                <p className="text-sm text-yellow-700">
                  {t("cannotDeleteActive")}
                </p>
              </div>
            )}

            {canDelete && (
              <>
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">
                    {t("deletePlanConfirmation", { planName: plan.planName })}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">{t("planName")}:</span> {plan.planName}
                  </p>
                  <p>
                    <span className="font-medium">{t("responsible")}:</span> {plan.planResponsible}
                  </p>
                  <p>
                    <span className="font-medium">{t("status.title")}:</span>{" "}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      plan.status === MeasurementPlanStatus.DRAFT
                        ? "bg-gray-100 text-gray-800"
                        : ""
                    }`}>
                      {t(`status.${plan.status}`)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">{t("workflow.objectives")}:</span>{" "}
                    {plan.objectivesCount}
                  </p>
                  <p>
                    <span className="font-medium">{t("workflow.metrics")}:</span>{" "}
                    {plan.metricsCount}
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isDeleting}
            >
              {t("actions.cancel")}
            </Button>
            {canDelete && (
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? t("deleting") : t("actions.delete")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
