import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { ChartIcon } from "@/presentation/assets/icons";
import { Estimate, EstimateStatus } from "@/core/types/fpa";

interface EstimatesTabProps {
  estimates: Estimate[] | undefined;
  isLoadingEstimates: boolean;
  formatDate: (date: Date | string) => string;
  getStatusColor: (status: EstimateStatus) => string;
  onEditEstimate: (estimate: Estimate) => void;
  onDeleteEstimate: (id: string) => void;
  onDuplicateEstimate: (id: string) => void;
}

export const EstimatesTab: React.FC<EstimatesTabProps> = ({
  estimates,
  isLoadingEstimates,
  formatDate,
  getStatusColor,
  onEditEstimate,
  onDeleteEstimate,
  onDuplicateEstimate,
}) => {
  const { t } = useTranslation("fpa");

  if (isLoadingEstimates) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-background-secondary rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("yourEstimates")}</CardTitle>
      </CardHeader>
      <CardContent>
        {!estimates || estimates.length === 0 ? (
          <div className="text-center py-8">
            <ChartIcon className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-default mb-2">
              {t("noEstimatesYet")}
            </h3>
            <p className="text-secondary mb-4">{t("noEstimatesDescription")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {estimates.map((estimate) => (
              <div
                key={estimate.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-default">{estimate.name}</h3>
                  {estimate.description && (
                    <p className="text-sm text-muted mt-1">
                      {estimate.description}
                    </p>
                  )}
                  <p className="text-sm text-secondary mt-1">
                    {estimate.totalPoints} {t("functionPoints")} •{" "}
                    {formatDate(estimate.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      estimate.status
                    )}`}
                  >
                    {t(`status.${estimate.status}`)}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEstimate(estimate)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicateEstimate(estimate.id)}
                    >
                      {t("duplicate")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEstimate(estimate.id)}
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
