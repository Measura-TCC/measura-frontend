import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import type { StepData } from "../utils/types";

interface Step5Props {
  stepData: StepData;
  selectedObjectives: string[];
  selectedQuestionsPerObjective: Record<string, string[]>;
  selectedMetricsPerQuestion: Record<string, string[]>;
  getObjectiveName: (id: string) => string;
  getQuestionName: (id: string) => string;
  getMetricName: (id: string) => string;
  getMetricUnit: (id: string) => string;
  isCreatingPlan: boolean;
  onFinalize: () => void;
}

export const Step5: React.FC<Step5Props> = ({
  stepData,
  selectedObjectives,
  selectedQuestionsPerObjective,
  selectedMetricsPerQuestion,
  getObjectiveName,
  getQuestionName,
  getMetricName,
  getMetricUnit,
  isCreatingPlan,
  onFinalize,
}) => {
  const { t } = useTranslation("plans");
  const [showDetailedView, setShowDetailedView] = useState(false);

  const totalObjectives = selectedObjectives.length;
  const totalQuestions = Object.values(selectedQuestionsPerObjective).reduce((sum, questions) => sum + questions.length, 0);
  const totalMetrics = Object.values(selectedMetricsPerQuestion).reduce((sum, metrics) => sum + metrics.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step5.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step5.description")}
        </p>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-4">{t("workflow.planSummary")}</h4>
          <div className="space-y-2 text-sm mb-4">
            <div>
              <strong>{t("forms.planName")}:</strong> {stepData.planBasics?.name}
            </div>
            <div>
              <strong>{t("forms.owner")}:</strong> {stepData.planBasics?.owner}
            </div>
            <div>
              <strong>{t("forms.description")}:</strong> {stepData.planBasics?.description}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-primary">{t("workflow.gqmStructure")}</h4>
            
            {selectedObjectives.map((objectiveId, objIndex) => {
              const objectiveQuestions = selectedQuestionsPerObjective[objectiveId] || [];
              
              return (
                <div key={objectiveId} className="border border-border rounded-lg p-4">
                  <div className="font-medium text-default mb-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">
                      G{objIndex + 1}
                    </span>
                    <strong>{t("workflow.objective")}:</strong> {getObjectiveName(objectiveId)}
                  </div>
                  
                  {objectiveQuestions.length > 0 && (
                    <div className="ml-4 space-y-3">
                      {objectiveQuestions.map((questionId, qIndex) => {
                        const questionMetrics = selectedMetricsPerQuestion[questionId] || [];
                        
                        return (
                          <div key={questionId}>
                            <div className="font-medium text-secondary mb-1">
                              <span className="bg-secondary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">
                                Q{qIndex + 1}
                              </span>
                              <strong>{t("workflow.question")}:</strong> {getQuestionName(questionId)}
                            </div>
                            
                            {questionMetrics.length > 0 && (
                              <div className="ml-8 space-y-1">
                                {questionMetrics.map((metricId, mIndex) => (
                                  <div key={metricId} className="text-sm">
                                    <span className="bg-green-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
                                      M{mIndex + 1}
                                    </span>
                                    <strong>{t("workflow.metric")}:</strong> <span className="font-medium">{getMetricName(metricId)}</span> ({getMetricUnit(metricId)})
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalObjectives}</div>
              <div className="text-sm text-secondary">{t("workflow.objectives")}</div>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{totalQuestions}</div>
              <div className="text-sm text-secondary">{t("workflow.questions")}</div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{totalMetrics}</div>
              <div className="text-sm text-secondary">{t("workflow.metrics")}</div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <Button
              onClick={() => setShowDetailedView(!showDetailedView)}
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              {showDetailedView ? t("workflow.hideDetails") : t("workflow.showDetails")}
            </Button>
            <Button
              onClick={() => {
                alert(t("workflow.exportPdfSoon"));
              }}
              variant="secondary"
              className="border border-primary text-primary hover:bg-primary hover:text-white"
            >
              📄 {t("workflow.exportPdf")}
            </Button>
          </div>

          {showDetailedView && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="font-medium text-primary mb-4">{t("workflow.detailedGqmStructure")}</h4>
              
              {selectedObjectives.map((objectiveId, objIndex) => {
                const objectiveQuestions = selectedQuestionsPerObjective[objectiveId] || [];
                
                return (
                  <div key={objectiveId} className="mb-6 border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mt-1">
                        G{objIndex + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-default mb-2">
                          {t("workflow.objective")} {objIndex + 1}
                        </div>
                        <div className="text-default bg-primary/5 p-3 rounded-md">
                          {getObjectiveName(objectiveId)}
                        </div>
                      </div>
                    </div>
                    
                    {objectiveQuestions.length > 0 && (
                      <div className="ml-6 space-y-4">
                        {objectiveQuestions.map((questionId, qIndex) => {
                          const questionMetrics = selectedMetricsPerQuestion[questionId] || [];
                          
                          return (
                            <div key={questionId}>
                              <div className="flex items-start gap-3 mb-3">
                                <span className="bg-secondary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-medium mt-1">
                                  Q{qIndex + 1}
                                </span>
                                <div className="flex-1">
                                  <div className="font-medium text-secondary mb-2">
                                    {t("workflow.question")} {qIndex + 1}
                                  </div>
                                  <div className="text-default bg-secondary/5 p-3 rounded-md">
                                    {getQuestionName(questionId)}
                                  </div>
                                </div>
                              </div>
                              
                              {questionMetrics.length > 0 && (
                                <div className="ml-6 space-y-3">
                                  {questionMetrics.map((metricId, mIndex) => (
                                    <div key={metricId} className="flex items-start gap-3">
                                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-1">
                                        M{mIndex + 1}
                                      </span>
                                      <div className="flex-1">
                                        <div className="font-medium text-green-700 mb-2">
                                          {t("workflow.metric")} {mIndex + 1}
                                        </div>
                                        <div className="text-default bg-green-50 p-3 rounded-md">
                                          <div className="font-medium mb-3">{getMetricName(metricId)}</div>
                                          <div className="text-sm text-gray-600 mb-2">
                                            {t("workflow.unit")}: {getMetricUnit(metricId)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button
          onClick={onFinalize}
          disabled={isCreatingPlan}
          className="w-full"
          variant="primary"
        >
          {isCreatingPlan ? t("workflow.creating") : t("workflow.finalizePlan")}
        </Button>
      </CardContent>
    </Card>
  );
};