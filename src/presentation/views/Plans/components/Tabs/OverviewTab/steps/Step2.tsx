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

interface Step2Props {
  selectedObjectives: Objective[];
  onAddObjective: (objective: Objective) => void;
  onRemoveObjective: (objectiveTitle: string) => void;
  onNext: () => void;
}

export const Step2: React.FC<Step2Props> = ({
  selectedObjectives,
  onAddObjective,
  onRemoveObjective,
  onNext,
}) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step2.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step2.description")}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Selected Objectives</h4>
            {selectedObjectives.length === 0 ? (
              <p className="text-secondary">No objectives selected yet.</p>
            ) : (
              <div className="space-y-2">
                {selectedObjectives.map((objective, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span>{objective.objectiveTitle}</span>
                    <Button
                      variant="secondary"
                      onClick={() => onRemoveObjective(objective.objectiveTitle)}
                    >
                      Remove
                    </Button>
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