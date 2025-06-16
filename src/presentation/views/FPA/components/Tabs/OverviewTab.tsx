import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import { PlusIcon, ChartIcon } from "@/presentation/assets/icons";
import { EstimateFormData, FPAStatistics } from "@/core/types/fpa";

interface OverviewTabProps {
  statistics: FPAStatistics;
  canCreateEstimate: boolean;
  isCreatingEstimate: boolean;
  estimateForm: UseFormReturn<EstimateFormData>;
  formErrors: Record<string, { message?: string }>;
  onCreateEstimate: (data: EstimateFormData) => Promise<void>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  statistics,
  canCreateEstimate,
  isCreatingEstimate,
  estimateForm,
  formErrors,
  onCreateEstimate,
}) => {
  const { t } = useTranslation("fpa");

  const { register, handleSubmit } = estimateForm;

  const handleCreate = async (data: EstimateFormData) => {
    try {
      await onCreateEstimate(data);
    } catch (error) {
      console.error("Error creating estimate:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className={!canCreateEstimate ? "opacity-50" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5 text-primary" />
              {t("createNew")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="estimateName"
                  className="text-sm font-medium text-default"
                >
                  {t("projectName")}
                </label>
                <Input
                  id="estimateName"
                  {...register("name")}
                  placeholder={t("enterProjectName")}
                  disabled={!canCreateEstimate}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600">
                    {formErrors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="estimateDescription"
                  className="text-sm font-medium text-default"
                >
                  {t("description")}
                </label>
                <Input
                  id="estimateDescription"
                  {...register("description")}
                  placeholder={t("briefDescription")}
                  disabled={!canCreateEstimate}
                />
              </div>
            </div>
            <Button
              onClick={handleSubmit(handleCreate)}
              className="w-full md:w-auto"
              disabled={!canCreateEstimate || isCreatingEstimate}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {isCreatingEstimate ? t("creating") : t("createEstimate")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("overview")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-default">
                  {statistics.totalEstimates}
                </div>
                <div className="text-sm text-secondary">
                  {t("totalEstimates")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.completedEstimates}
                </div>
                <div className="text-sm text-secondary">{t("completed")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.inProgressEstimates}
                </div>
                <div className="text-sm text-secondary">{t("inProgress")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {statistics.draftEstimates}
                </div>
                <div className="text-sm text-secondary">{t("drafts")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-primary" />
              {t("statistics")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("totalFunctionPoints")}</span>
              <span className="font-semibold text-default">
                {statistics.totalFunctionPoints}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("averagePoints")}</span>
              <span className="font-semibold text-default">
                {statistics.averagePoints}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("completionRate")}</span>
              <span className="font-semibold text-default">
                {statistics.totalEstimates > 0
                  ? Math.round(
                      (statistics.completedEstimates /
                        statistics.totalEstimates) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
