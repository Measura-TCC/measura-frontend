import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { DocumentIcon } from "@/presentation/assets/icons";
import { Plan, PlanStatus, GQMPhase } from "@/core/types/plans";

interface PlansTabProps {
  plans: Plan[] | undefined;
  isLoadingPlans: boolean;
  formatDate: (date: Date | string) => string;
  getStatusColor: (status: PlanStatus) => string;
  getTypeLabel: (type: string) => string;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (id: string) => void;
  onDuplicatePlan: (id: string) => void;
  onManageGQM: (plan: Plan) => void;
}

export const PlansTab: React.FC<PlansTabProps> = ({
  plans,
  isLoadingPlans,
  formatDate,
  getStatusColor,
  getTypeLabel,
  onEditPlan,
  onDeletePlan,
  onDuplicatePlan,
  onManageGQM,
}) => {
  const { t } = useTranslation("plans");

  const getGQMPhaseLabel = (phase?: GQMPhase) => {
    if (!phase) return t("gqm.notStarted");
    return t(`gqm.phases.${phase}`);
  };

  const getGQMPhaseColor = (phase?: GQMPhase) => {
    switch (phase) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "data_collection":
        return "bg-blue-100 text-blue-800";
      case "interpretation":
        return "bg-purple-100 text-purple-800";
      case "definition":
        return "bg-yellow-100 text-yellow-800";
      case "planning":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoadingPlans) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("yourPlans")}</CardTitle>
      </CardHeader>
      <CardContent>
        {!plans || plans.length === 0 ? (
          <div className="text-center py-8">
            <DocumentIcon className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-default mb-2">
              {t("noPlansYet")}
            </h3>
            <p className="text-secondary mb-4">{t("noPlansDescription")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-default">{plan.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        plan.status
                      )}`}
                    >
                      {t(`status.${plan.status}`)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getGQMPhaseColor(
                        plan.gqmPhase
                      )}`}
                    >
                      {getGQMPhaseLabel(plan.gqmPhase)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-secondary mb-3">
                  {plan.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <h4 className="text-xs font-medium text-secondary mb-1">
                      {t("type")}:
                    </h4>
                    <span className="px-2 py-1 bg-background-secondary text-xs rounded capitalize">
                      {getTypeLabel(plan.type)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-secondary mb-1">
                      {t("owner")}:
                    </h4>
                    <span className="px-2 py-1 bg-background-secondary text-xs rounded">
                      {plan.owner}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-secondary mb-1">
                      {t("progress")}:
                    </h4>
                    <span className="px-2 py-1 bg-background-secondary text-xs rounded">
                      {plan.progress}%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-secondary mb-1">
                      {t("dates")}:
                    </h4>
                    <span className="text-xs text-muted">
                      {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted">
                    <span>
                      {plan.goalsCount} {t("goals")}
                    </span>
                    <span>
                      {plan.metricsCount} {t("metrics")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageGQM(plan)}
                    >
                      {t("manageGQM")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPlan(plan)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicatePlan(plan.id)}
                    >
                      {t("duplicate")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
