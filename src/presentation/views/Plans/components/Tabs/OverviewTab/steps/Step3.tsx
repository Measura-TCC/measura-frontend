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

interface Step3Props {
  selectedObjectives: Objective[];
  onUpdateObjective: (index: number, objective: Objective) => void;
  onNext: () => void;
}

export const Step3: React.FC<Step3Props> = ({
  selectedObjectives,
  onUpdateObjective,
  onNext,
}) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step3.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step3.description")}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Review Objectives</h4>
            {selectedObjectives.length === 0 ? (
              <p className="text-secondary">No objectives to review.</p>
            ) : (
              <div className="space-y-4">
                {selectedObjectives.map((objective, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h5 className="font-medium">{objective.objectiveTitle}</h5>
                    <p className="text-secondary text-sm">{objective.objectiveDescription}</p>
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