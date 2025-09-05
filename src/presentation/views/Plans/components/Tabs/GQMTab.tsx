import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { TargetIcon } from "@/presentation/assets/icons";
import {
  Plan,
  GQMData,
  GQMGoal,
  GQMQuestion,
  GQMMetric,
  GQMSelectionState,
} from "@/core/types/plans";
import { ObjectiveQuestionMetricSelector } from "../ObjectiveQuestionMetricSelector";

interface GQMTabProps {
  plans: Plan[] | undefined;
  selectedPlanId?: string;
  gqmData: GQMData;
  onSelectPlan: (planId: string) => void;
  onCreateGoal: (goalData: Partial<GQMGoal>) => Promise<void>;
  onCreateQuestion: (questionData: Partial<GQMQuestion>) => Promise<void>;
  onCreateMetric: (metricData: Partial<GQMMetric>) => Promise<void>;
  onCompleteStep: (step: number) => Promise<void>;
  onSelectionComplete?: (selection: GQMSelectionState) => Promise<void>;
}

export const GQMTab: React.FC<GQMTabProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  onSelectionComplete,
}) => {
  const { t } = useTranslation("plans");

  const handleSelectionComplete = async (selection: GQMSelectionState) => {
    if (onSelectionComplete) {
      await onSelectionComplete(selection);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-primary" />
            Goal-Question-Metric (GQM)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary mb-4">
            {t("gqm.noPlansForGQM")}
          </p>
          <select
            value={selectedPlanId || ""}
            onChange={(e) => onSelectPlan(e.target.value)}
            className="w-full p-2 border border-border rounded-md"
          >
            <option value="">{t("gqm.choosePlan")}</option>
            {plans?.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedPlanId && (
        <ObjectiveQuestionMetricSelector
          onSelectionComplete={handleSelectionComplete}
          onCancel={() => {}}
        />
      )}
    </div>
  );
};