import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { usePlanStatus } from "@/core/hooks/measurementPlans";
import { MetricStatusBadge } from "../../components/MetricStatusBadge";

interface PlanStatisticsCardProps {
  planId: string;
  objectivesCount: number;
  questionsCount: number;
  metricsCount: number;
  measurementsCount: number;
}

export const PlanStatisticsCard: React.FC<PlanStatisticsCardProps> = ({
  planId,
  objectivesCount,
  questionsCount,
  metricsCount,
  measurementsCount,
}) => {
  const { t } = useTranslation("plans");
  const { status, isLoading } = usePlanStatus({ planId });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("statistics")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{t("workflow.objectives")}</span>
          <span className="font-semibold">{objectivesCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{t("workflow.questions")}</span>
          <span className="font-semibold">{questionsCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{t("workflow.metrics")}</span>
          <span className="font-semibold">{metricsCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{t("workflow.measurements")}</span>
          <span className="font-semibold">{measurementsCount}</span>
        </div>

        {/* Indicator Status */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t("indicatorStatus.title")}</span>
            {isLoading ? (
              <span className="text-xs text-gray-400 dark:text-gray-500">{t("loading")}</span>
            ) : status ? (
              <MetricStatusBadge status={status.overallStatus} size="sm" />
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
            )}
          </div>
          {status && status.overallStatus === 'NEEDS_ATTENTION' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {status.metricsNeedAttention} de {status.totalMetrics} {t("workflow.metrics").toLowerCase()} {t("indicatorStatus.someNeedAttention").toLowerCase()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};