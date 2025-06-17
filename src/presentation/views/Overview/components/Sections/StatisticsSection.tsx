import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";

interface Statistics {
  totalEstimates: number;
  activeGoals: number;
  completedPlans: number;
}

interface StatisticsSectionProps {
  statistics: Statistics;
  isLoadingStatistics: boolean;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  statistics,
  isLoadingStatistics,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoadingStatistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("statistics")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("statistics")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-secondary">{t("totalEstimates")}</span>
          <span className="font-semibold text-default">
            {statistics.totalEstimates}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary">{t("activeGoals")}</span>
          <span className="font-semibold text-default">
            {statistics.activeGoals}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary">{t("completedPlans")}</span>
          <span className="font-semibold text-default">
            {statistics.completedPlans}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
