import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";

interface PlanProgressCardProps {
  progress: number;
}

export const PlanProgressCard: React.FC<PlanProgressCardProps> = ({ progress }) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("progress")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t("overallProgress")}
              </span>
              <span className="text-sm text-gray-600">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};