import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { availableMetrics } from "../utils/stepData";

interface Step4Props {
  selectedObjectives: string[];
  selectedQuestionsPerObjective: Record<string, string[]>;
  selectedMetricsPerQuestion: Record<string, string[]>;
  onAddMetricToQuestion: (questionId: string, metricId: string) => void;
  onRemoveMetricFromQuestion: (questionId: string, metricId: string) => void;
  getObjectiveName: (id: string) => string;
  getQuestionName: (id: string) => string;
  getMetricName: (id: string) => string;
  getMetricUnit: (id: string) => string;
  onNext: () => void;
}

export const Step4: React.FC<Step4Props> = ({
  selectedObjectives,
  selectedQuestionsPerObjective,
  selectedMetricsPerQuestion,
  onAddMetricToQuestion,
  onRemoveMetricFromQuestion,
  getObjectiveName,
  getQuestionName,
  getMetricName,
  getMetricUnit,
  onNext,
}) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step4.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step4.description")}
        </p>

        {selectedObjectives.map((objectiveId, objIndex) => {
          const objectiveQuestions = selectedQuestionsPerObjective[objectiveId] || [];
          if (objectiveQuestions.length === 0) return null;

          return (
            <div key={objectiveId} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {objIndex + 1}
                </span>
                <h4 className="font-medium text-default">
                  {getObjectiveName(objectiveId)}
                </h4>
              </div>

              <div className="space-y-4">
                {objectiveQuestions.map((questionId, qIndex) => (
                  <div key={questionId} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                        Q{qIndex + 1}
                      </span>
                      <h5 className="font-medium text-sm">
                        {getQuestionName(questionId)}
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
                                onAddMetricToQuestion(questionId, e.target.value);
                                e.target.value = "";
                              }
                            }}
                          >
                            <option value="">{t("workflow.chooseMetric")}</option>
                            {availableMetrics
                              .filter(m => !selectedMetricsPerQuestion[questionId]?.includes(m.id))
                              .map(metric => (
                                <option key={metric.id} value={metric.id}>
                                  {t(metric.name)} ({t(metric.unit)})
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
                          {t("workflow.createNewMetric")}
                        </button>
                      </div>

                      {selectedMetricsPerQuestion[questionId]?.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-default">
                            {t("workflow.selectedMetrics", { count: selectedMetricsPerQuestion[questionId].length })}
                          </label>
                          <div className="space-y-2">
                            {selectedMetricsPerQuestion[questionId].map((metricId, mIndex) => (
                              <div key={metricId} className="flex items-center justify-between bg-white p-3 rounded-md border">
                                <div className="flex items-center gap-2">
                                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                    M{mIndex + 1}
                                  </span>
                                  <div className="text-sm">
                                    <span className="font-medium">{getMetricName(metricId)}</span>
                                    <span className="text-gray-500 ml-1">({getMetricUnit(metricId)})</span>
                                  </div>
                                </div>
                                <button 
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  onClick={() => onRemoveMetricFromQuestion(questionId, metricId)}
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
              </div>
            </div>
          );
        })}

        <div className="flex gap-2 mt-6">
          {Object.values(selectedMetricsPerQuestion).some(metrics => metrics.length > 0) && (
            <Button onClick={onNext} variant="primary">
              {t("workflow.nextVisualization")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};