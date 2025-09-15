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

interface Step4Props {
  selectedObjectives: Objective[];
  onUpdateObjective: (index: number, objective: Objective) => void;
  onNext: () => void;
}

export const Step4: React.FC<Step4Props> = ({
  selectedObjectives,
  onUpdateObjective,
  onNext,
}) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step4.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step4.description")}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Configure Objectives</h4>
            {selectedObjectives.length === 0 ? (
              <p className="text-secondary">No objectives to configure.</p>
            ) : (
              <div className="space-y-4">
                {selectedObjectives.map((objective, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h5 className="font-medium">{objective.objectiveTitle}</h5>
                    <p className="text-secondary text-sm">{objective.objectiveDescription}</p>
                    <div className="mt-2">
                      <span className="text-sm text-secondary">
                        Questions: {objective.questions?.length || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={onNext}
          variant="primary"
          className="w-full md:w-auto"
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};