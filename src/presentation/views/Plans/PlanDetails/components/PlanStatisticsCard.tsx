import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";

interface PlanStatisticsCardProps {
  objectivesCount: number;
  questionsCount: number;
  metricsCount: number;
  measurementsCount: number;
}

export const PlanStatisticsCard: React.FC<PlanStatisticsCardProps> = ({
  objectivesCount,
  questionsCount,
  metricsCount,
  measurementsCount,
}) => {
  const { t } = useTranslation("plans");

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
      </CardContent>
    </Card>
  );
};