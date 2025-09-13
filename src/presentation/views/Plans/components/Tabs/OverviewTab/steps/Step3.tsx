import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { availableQuestions } from "../utils/stepData";

interface Step3Props {
  selectedObjectives: string[];
  selectedQuestionsPerObjective: Record<string, string[]>;
  onAddQuestionToObjective: (objectiveId: string, questionId: string) => void;
  onRemoveQuestionFromObjective: (objectiveId: string, questionId: string) => void;
  getObjectiveName: (id: string) => string;
  getQuestionName: (id: string) => string;
  onNext: () => void;
}

export const Step3: React.FC<Step3Props> = ({
  selectedObjectives,
  selectedQuestionsPerObjective,
  onAddQuestionToObjective,
  onRemoveQuestionFromObjective,
  getObjectiveName,
  getQuestionName,
  onNext,
}) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step3.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step3.description")}
        </p>

        {selectedObjectives.map((objectiveId, index) => (
          <div key={objectiveId} className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <h4 className="font-medium text-default">
                {getObjectiveName(objectiveId)}
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-default block mb-2">
                  {t("workflow.selectQuestions")}
                </label>
                <div className="relative">
                  <select
                    className="w-full p-2 border border-border rounded-md appearance-none bg-white"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onAddQuestionToObjective(objectiveId, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">{t("workflow.chooseQuestion")}</option>
                    {availableQuestions
                      .filter(q => !selectedQuestionsPerObjective[objectiveId]?.includes(q.id))
                      .map(question => (
                        <option key={question.id} value={question.id}>
                          {t(question.name)}
                        </option>
                      ))
                    }
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <button className="mt-2 text-primary text-sm hover:underline">
                  {t("workflow.createNewQuestion")}
                </button>
              </div>

              {selectedQuestionsPerObjective[objectiveId]?.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    {t("workflow.selectedQuestions", { count: selectedQuestionsPerObjective[objectiveId].length })}
                  </label>
                  <div className="space-y-2">
                    {selectedQuestionsPerObjective[objectiveId].map((questionId, qIndex) => (
                      <div key={questionId} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-secondary">
                            {qIndex + 1}.
                          </span>
                          <span className="text-sm">
                            {getQuestionName(questionId)}
                          </span>
                        </div>
                        <button 
                          className="text-red-500 hover:text-red-700 text-sm"
                          onClick={() => onRemoveQuestionFromObjective(objectiveId, questionId)}
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
        ))}

        <div className="flex gap-2 mt-6">
          {selectedQuestionsPerObjective && Object.values(selectedQuestionsPerObjective).some(questions => questions.length > 0) && (
            <Button onClick={onNext} variant="primary">
              {t("workflow.nextMetrics")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};