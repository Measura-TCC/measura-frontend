import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { availableObjectives } from "../utils/stepData";
import type { Objective } from "@/core/types/plans";

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
            <h4 className="font-medium mb-2">
              {t("workflow.selectObjectivesTitle")}
            </h4>
            <div className="space-y-2">
              <div className="relative">
                <select
                  className="w-full p-2 border border-border rounded-md appearance-none bg-white"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      const objective = availableObjectives.find(
                        (obj) => obj.objectiveTitle === e.target.value
                      );
                      if (objective) {
                        onAddObjective(objective);
                        e.target.value = "";
                      }
                    }
                  }}
                >
                  <option value="">{t("workflow.chooseObjective")}</option>
                  {availableObjectives
                    .filter(
                      (obj) =>
                        !selectedObjectives.some(
                          (selected) =>
                            selected.objectiveTitle === obj.objectiveTitle
                        )
                    )
                    .map((objective) => (
                      <option
                        key={objective.objectiveTitle}
                        value={objective.objectiveTitle}
                      >
                        {t(objective.objectiveTitle)}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {selectedObjectives.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedObjectives.map((objective) => (
                      <div
                        key={objective.objectiveTitle}
                        className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{t(objective.objectiveTitle)}</span>
                        <button
                          className="ml-2 text-primary hover:text-primary/70"
                          onClick={() =>
                            onRemoveObjective(objective.objectiveTitle)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {selectedObjectives.length > 0 && (
            <Button onClick={onNext} variant="primary">
              {t("workflow.nextQuestions")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
