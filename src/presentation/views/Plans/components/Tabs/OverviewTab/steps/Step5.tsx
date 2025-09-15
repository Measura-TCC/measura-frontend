import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";

interface Objective {
  objectiveTitle: string;
  objectiveDescription: string;
  questions: any[];
}

interface MeasurementPlan {
  planName: string;
  associatedProject: string;
  planResponsible: string;
  objectives: Objective[];
}

interface Step5Props {
  measurementPlan: MeasurementPlan;
  onPrevious?: () => void;
  onFinish?: () => void;
}

export const Step5: React.FC<Step5Props> = ({
  measurementPlan,
  onPrevious,
  onFinish,
}) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step5.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step5.description")}
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Plan Summary</h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Plan Name: </span>
                <span className="text-secondary">{measurementPlan.planName}</span>
              </div>
              <div>
                <span className="font-medium">Associated Project: </span>
                <span className="text-secondary">{measurementPlan.associatedProject}</span>
              </div>
              <div>
                <span className="font-medium">Plan Responsible: </span>
                <span className="text-secondary">{measurementPlan.planResponsible}</span>
              </div>
              <div>
                <span className="font-medium">Objectives: </span>
                <span className="text-secondary">{measurementPlan.objectives?.length || 0}</span>
              </div>
            </div>
          </div>

          {measurementPlan.objectives && measurementPlan.objectives.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Objectives</h4>
              <div className="space-y-2">
                {measurementPlan.objectives.map((objective, index) => (
                  <div key={index} className="p-3 border rounded">
                    <h5 className="font-medium">{objective.objectiveTitle}</h5>
                    <p className="text-secondary text-sm">{objective.objectiveDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {onPrevious && (
            <Button
              onClick={onPrevious}
              variant="secondary"
              className="w-full md:w-auto"
            >
              Previous
            </Button>
          )}
          {onFinish && (
            <Button
              onClick={onFinish}
              variant="primary"
              className="w-full md:w-auto"
            >
              Finish
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};