import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import type { MeasurementPlanSummary } from "@/core/schemas/projects";

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: MeasurementPlanSummary[];
  organizationId: string;
}

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  organizationId,
}) => {
  const { t } = useTranslation("projects");
  const router = useRouter();

  const handlePlanClick = (planId: string) => {
    router.push(`/plans/${planId}`);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-default">
              {t("plansModal.title")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          {plans.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              {t("plansModal.noPlans")}
            </p>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  onClick={() => handlePlanClick(plan._id)}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-gray-50 hover:border-purple-600 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-default">{plan.planName}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        plan.status
                      )}`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <label className="text-gray-500 w-32">{t("plansModal.responsible")}</label>
                      <span className="text-gray-900">
                        {plan.planResponsible}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <label className="text-gray-500 w-32">{t("plansModal.objectives")}</label>
                      <span className="text-gray-900">
                        {plan.objectives?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <label className="text-gray-500 w-32">{t("plansModal.created")}</label>
                      <span className="text-gray-900">
                        {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button variant="secondary" onClick={onClose}>
              {t("plansModal.close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
