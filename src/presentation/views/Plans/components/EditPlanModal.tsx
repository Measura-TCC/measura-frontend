import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/presentation/components/primitives";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { useToast } from "@/core/hooks/common/useToast";
import { useAuth } from "@/core/hooks/auth/useAuth";
import { MeasurementPlanStatus, type MeasurementPlanSummaryDto, type UpdateMeasurementPlanDto } from "@/core/types/plans";
import { canChangePlanStatus } from "@/core/utils/permissions";

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MeasurementPlanSummaryDto;
  onUpdate: (planId: string, data: UpdateMeasurementPlanDto) => Promise<any>;
  isUpdating: boolean;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdate,
  isUpdating,
}) => {
  const { user } = useAuth();
  const canChangeStatus = canChangePlanStatus(user?.role);
  const { t } = useTranslation("plans");
  const toast = useToast();
  const { projects, isLoadingProjects } = useProjects();

  const [formData, setFormData] = useState({
    planName: "",
    planResponsible: "",
    associatedProject: "",
    status: MeasurementPlanStatus.DRAFT,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (plan) {
      setFormData({
        planName: plan.planName,
        planResponsible: plan.planResponsible,
        associatedProject: plan.associatedProject,
        status: plan.status,
      });
    }
  }, [plan]);

  const getValidStatusTransitions = () => {
    const current = plan.status;

    if (current === MeasurementPlanStatus.COMPLETED) {
      return [MeasurementPlanStatus.COMPLETED];
    }

    if (current === MeasurementPlanStatus.ACTIVE) {
      return [
        MeasurementPlanStatus.DRAFT,
        MeasurementPlanStatus.ACTIVE,
        MeasurementPlanStatus.COMPLETED,
      ];
    }

    return [
      MeasurementPlanStatus.DRAFT,
      MeasurementPlanStatus.ACTIVE,
    ];
  };

  const validStatuses = getValidStatusTransitions();

  const handleSubmit = async () => {
    setValidationError(null);

    if (!formData.planName.trim()) {
      setValidationError(t("planName") + " " + t("required"));
      return;
    }

    if (!formData.planResponsible.trim()) {
      setValidationError(t("responsible") + " " + t("required"));
      return;
    }

    if (!formData.associatedProject) {
      setValidationError(t("project") + " " + t("required"));
      return;
    }

    try {
      await onUpdate(plan.id, {
        planName: formData.planName.trim(),
        planResponsible: formData.planResponsible.trim(),
        associatedProject: formData.associatedProject,
        status: formData.status,
      });

      toast.success({
        message: t("editPlanSuccess"),
      });

      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("editPlanError");
      setValidationError(errorMessage);

      toast.error({
        message: errorMessage,
      });
    }
  };

  const handleClose = () => {
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
              {t("editPlanTitle")}
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
                {t("planName")}
              </label>
              <Input
                type="text"
                value={formData.planName}
                onChange={(e) =>
                  setFormData({ ...formData, planName: e.target.value })
                }
                placeholder={t("planName")}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("responsible")}
              </label>
              <Input
                type="text"
                value={formData.planResponsible}
                onChange={(e) =>
                  setFormData({ ...formData, planResponsible: e.target.value })
                }
                placeholder={t("responsible")}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("project")}
              </label>
              <select
                value={formData.associatedProject}
                onChange={(e) =>
                  setFormData({ ...formData, associatedProject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoadingProjects}
              >
                <option value="">{t("selectProject")}</option>
                {projects?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("status.title")}
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as MeasurementPlanStatus })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={plan.status === MeasurementPlanStatus.COMPLETED || !canChangeStatus}
              >
                {validStatuses.map((status) => (
                  <option key={status} value={status}>
                    {t(`status.${status}`)}
                  </option>
                ))}
              </select>
              {plan.status === MeasurementPlanStatus.COMPLETED && (
                <p className="text-xs text-gray-500 mt-1">
                  {t("completedStatusFinal")}
                </p>
              )}
            </div>

            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{validationError}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isUpdating}
            >
              {t("actions.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={isUpdating}>
              {isUpdating ? t("saving") : t("actions.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
