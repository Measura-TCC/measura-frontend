import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { availableQuestions } from "../utils/stepData";
import type { Objective, Question, Metric } from "../utils/types";
import { CustomMetricModal } from "../components/CustomMetricModal";
import { CustomQuestionModal } from "../components/CustomQuestionModal";

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
  const [isCustomMetricModalOpen, setIsCustomMetricModalOpen] = useState(false);
  const [currentQuestionForMetric, setCurrentQuestionForMetric] = useState<{objectiveIndex: number, questionIndex: number} | null>(null);
  const [isCustomQuestionModalOpen, setIsCustomQuestionModalOpen] = useState(false);
  const [currentObjectiveForQuestion, setCurrentObjectiveForQuestion] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step3.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step3.description")}
        </p>

        {selectedObjectives.map((objective, index) => (
          <div key={objective.objectiveTitle} className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <h4 className="font-medium text-default">
                {t(objective.objectiveTitle)}
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
                        const question = availableQuestions.find(
                          (q) => q.questionText === e.target.value
                        );
                        if (question) {
                          const updatedObjective = {
                            ...objective,
                            questions: [...objective.questions, question]
                          };
                          onUpdateObjective(index, updatedObjective);
                          e.target.value = "";
                        }
                      }
                    }}
                  >
                    <option value="">{t("workflow.chooseQuestion")}</option>
                    {availableQuestions
                      .filter(q => !objective.questions.some(existing => existing.questionText === q.questionText))
                      .map(question => (
                        <option key={question.questionText} value={question.questionText}>
                          {t(question.questionText)}
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
                <button
                  className="mt-2 text-primary text-sm hover:underline"
                  onClick={() => {
                    setCurrentObjectiveForQuestion(index);
                    setIsCustomQuestionModalOpen(true);
                  }}
                >
                  {t("workflow.createNewQuestion")}
                </button>
              </div>

              {objective.questions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    {t("workflow.selectedQuestions", { count: objective.questions.length })}
                  </label>
                  <div className="space-y-2">
                    {objective.questions.map((question, qIndex) => (
                      <div key={question.questionText} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-secondary">
                            {qIndex + 1}.
                          </span>
                          <span className="text-sm">
                            {t(question.questionText)}
                          </span>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 text-sm"
                          onClick={() => {
                            const updatedObjective = {
                              ...objective,
                              questions: objective.questions.filter(q => q.questionText !== question.questionText)
                            };
                            onUpdateObjective(index, updatedObjective);
                          }}
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
          {selectedObjectives.some(objective => objective.questions.length > 0) && (
            <Button onClick={onNext} variant="primary">
              {t("workflow.nextMetrics")}
            </Button>
          )}
        </div>
      </CardContent>

      <CustomMetricModal
        isOpen={isCustomMetricModalOpen}
        onClose={() => {
          setIsCustomMetricModalOpen(false);
          setCurrentQuestionForMetric(null);
        }}
        onAddMetric={(metric: Metric) => {
          if (currentQuestionForMetric) {
            const { objectiveIndex, questionIndex } = currentQuestionForMetric;
            const objective = selectedObjectives[objectiveIndex];
            const question = objective.questions[questionIndex];

            const updatedQuestion = {
              ...question,
              metrics: [...question.metrics, metric]
            };

            const updatedObjective = {
              ...objective,
              questions: objective.questions.map((q, idx) =>
                idx === questionIndex ? updatedQuestion : q
              )
            };

            onUpdateObjective(objectiveIndex, updatedObjective);
          }
        }}
      />

      <CustomQuestionModal
        isOpen={isCustomQuestionModalOpen}
        onClose={() => {
          setIsCustomQuestionModalOpen(false);
          setCurrentObjectiveForQuestion(null);
        }}
        onAddQuestion={(question: Question) => {
          if (currentObjectiveForQuestion !== null) {
            const objective = selectedObjectives[currentObjectiveForQuestion];
            const updatedObjective = {
              ...objective,
              questions: [...objective.questions, question]
            };
            onUpdateObjective(currentObjectiveForQuestion, updatedObjective);
          }
        }}
      />
    </Card>
  );
};