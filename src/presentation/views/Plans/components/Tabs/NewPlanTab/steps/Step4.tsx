import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { availableMetrics } from "../utils/stepData";
import type { Objective, Metric } from "../utils/types";
import { CustomMetricModal } from "../components/CustomMetricModal";
import { MetricAccordion } from "../components/MetricAccordion";

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
  const [isCustomMetricModalOpen, setIsCustomMetricModalOpen] = useState(false);
  const [currentQuestionForMetric, setCurrentQuestionForMetric] = useState<{objectiveIndex: number, questionIndex: number} | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step4.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step4.description")}
        </p>

        {selectedObjectives.map((objective, objIndex) => {
          if (objective.questions.length === 0) return null;

          return (
            <div key={objective.objectiveTitle} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {objIndex + 1}
                </span>
                <h4 className="font-medium text-default">
                  {t(objective.objectiveTitle)}
                </h4>
              </div>

              <div className="space-y-4">
                {objective.questions.map((question, qIndex) => (
                  <div key={question.questionText} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                        Q{qIndex + 1}
                      </span>
                      <h5 className="font-medium text-sm">
                        {t(question.questionText)}
                      </h5>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-default block mb-2">
                          {t("workflow.selectMetrics")}
                        </label>
                        <div className="relative">
                          <select
                            className="w-full p-2 border border-border rounded-md appearance-none bg-white"
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                const metric = availableMetrics.find(
                                  (m) => m.metricName === e.target.value
                                );
                                if (metric) {
                                  const updatedQuestion = {
                                    ...question,
                                    metrics: [...question.metrics, metric]
                                  };
                                  const updatedObjective = {
                                    ...objective,
                                    questions: objective.questions.map(q =>
                                      q.questionText === question.questionText ? updatedQuestion : q
                                    )
                                  };
                                  onUpdateObjective(objIndex, updatedObjective);
                                  e.target.value = "";
                                }
                              }
                            }}
                          >
                            <option value="">{t("workflow.chooseMetric")}</option>
                            {availableMetrics
                              .filter(m => !question.metrics.some(existing => existing.metricName === m.metricName))
                              .map(metric => (
                                <option key={metric.metricName} value={metric.metricName}>
                                  {t(metric.metricName)} ({t(metric.measurements[0]?.measurementUnit || '')})
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
                            setCurrentQuestionForMetric({ objectiveIndex: objIndex, questionIndex: qIndex });
                            setIsCustomMetricModalOpen(true);
                          }}
                        >
                          {t("workflow.createNewMetric")}
                        </button>
                      </div>

                      {question.metrics.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-default">
                            {t("workflow.selectedMetrics", { count: question.metrics.length })}
                          </label>
                          <div className="space-y-3">
                            {question.metrics.map((metric, mIndex) => (
                              <MetricAccordion
                                key={`${objIndex}-${qIndex}-${mIndex}-${metric.metricName}`}
                                metric={metric}
                                metricIndex={mIndex}
                                onUpdateMetric={(updatedMetric) => {
                                  const updatedQuestion = {
                                    ...question,
                                    metrics: question.metrics.map(m =>
                                      m.metricName === metric.metricName ? updatedMetric : m
                                    )
                                  };
                                  const updatedObjective = {
                                    ...objective,
                                    questions: objective.questions.map(q =>
                                      q.questionText === question.questionText ? updatedQuestion : q
                                    )
                                  };
                                  onUpdateObjective(objIndex, updatedObjective);
                                }}
                                onRemoveMetric={() => {
                                  const updatedQuestion = {
                                    ...question,
                                    metrics: question.metrics.filter(m => m.metricName !== metric.metricName)
                                  };
                                  const updatedObjective = {
                                    ...objective,
                                    questions: objective.questions.map(q =>
                                      q.questionText === question.questionText ? updatedQuestion : q
                                    )
                                  };
                                  onUpdateObjective(objIndex, updatedObjective);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex gap-2 mt-6">
          {selectedObjectives.some(objective =>
            objective.questions.some(question => question.metrics.length > 0)
          ) && (
            <Button onClick={onNext} variant="primary">
              {t("workflow.nextVisualization")}
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
    </Card>
  );
};