import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { formatRelativeTime } from "@/core/utils";

interface Activity {
  id: string;
  title: string;
  description: string;
  userName: string;
  createdAt: Date;
}

interface ActivitySectionProps {
  activities: Activity[];
  isLoadingActivities: boolean;
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({
  activities,
  isLoadingActivities,
}) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentActivity")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingActivities ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-gray-200 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-4 border-b border-border last:border-b-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-default">
                    {activity.title}
                  </p>
                  <p className="text-sm text-secondary">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted">
                      {activity.userName}
                    </span>
                    <span className="text-xs text-muted">•</span>
                    <span className="text-xs text-muted">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
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
