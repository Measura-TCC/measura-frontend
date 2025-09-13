import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { ArrowLeftIcon, ArrowRightIcon } from "@/presentation/assets/icons";
import type { Project } from "@/core/schemas/projects";
import type { MeasurementPlan } from "@/core/types/plans";
import { PlanVisualization } from "../../../PlanVisualization";

interface Step5Props {
  measurementPlan: MeasurementPlan;
  projects: Project[];
  isCreatingPlan: boolean;
  onFinalize: () => void;
}

export const Step5: React.FC<Step5Props> = ({
  measurementPlan,
  projects,
  isCreatingPlan,
  onFinalize,
}) => {
  const { t } = useTranslation("plans");
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // const objectivesPerPage = 1; // Unused variable
  const totalPages = measurementPlan.objectives.length;

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const getCurrentObjective = () => {
    return measurementPlan.objectives[currentPage];
  };

  const getProjectName = () => {
    const project = projects.find(p => p._id === measurementPlan.associatedProject);
    return project?.name || measurementPlan.associatedProject;
  };

  const totalObjectives = measurementPlan.objectives.length;
  const totalQuestions = measurementPlan.objectives.reduce(
    (sum, obj) => sum + obj.questions.length,
    0
  );
  const totalMetrics = measurementPlan.objectives.reduce(
    (sum, obj) =>
      sum + obj.questions.reduce((qSum, q) => qSum + q.metrics.length, 0),
    0
  );
  const totalMeasurements = measurementPlan.objectives.reduce(
    (sum, obj) =>
      sum +
      obj.questions.reduce(
        (qSum, q) =>
          qSum + q.metrics.reduce((mSum, m) => mSum + m.measurements.length, 0),
        0
      ),
    0
  );

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
              <strong>{t("measurementPlan.associatedProject")}:</strong>{" "}
              {getProjectName()}
            </div>
            <div>
              <strong>{t("measurementPlan.planResponsible")}:</strong>{" "}
              {measurementPlan.planResponsible}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-primary">
                {t("workflow.gqmStructure")}
              </h4>
              {totalPages > 1 && (
                <span className="text-sm text-gray-600">
                  {t("planVisualization.pageOf", {
                    current: currentPage + 1,
                    total: totalPages,
                  })}
                </span>
              )}
            </div>

            {getCurrentObjective() && (
              <div className="border border-border rounded-lg p-4">
                <div className="font-medium text-default mb-2">
                  <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">
                    G{currentPage + 1}
                  </span>
                  <strong>{t("workflow.objective")}:</strong>{" "}
                  {t(getCurrentObjective().objectiveTitle)}
                </div>

                {getCurrentObjective().questions.length > 0 && (
                  <div className="ml-4 space-y-3">
                    {getCurrentObjective().questions.map((question, qIndex) => (
                      <div key={`${question.questionText}-${qIndex}`}>
                        <div className="font-medium text-secondary mb-1">
                          <span className="bg-secondary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">
                            Q{qIndex + 1}
                          </span>
                          <strong>{t("workflow.question")}:</strong>{" "}
                          {t(question.questionText)}
                        </div>

                        {question.metrics.length > 0 && (
                          <div className="ml-8 space-y-1">
                            {question.metrics.map((metric, mIndex) => (
                              <div
                                key={`${metric.metricName}-${mIndex}`}
                                className="text-sm"
                              >
                                <span className="bg-green-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
                                  M{mIndex + 1}
                                </span>
                                <strong>{t("workflow.metric")}:</strong>{" "}
                                <span className="font-medium">
                                  {t(metric.metricName)}
                                </span>{" "}
                                ({t(metric.measurements[0]?.measurementUnit) || ""}
                                )
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="secondary"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  {t("planVisualization.previous")}
                </Button>

                <Button
                  variant="secondary"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center gap-2"
                >
                  {t("planVisualization.next")}
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {totalObjectives}
              </div>
              <div className="text-sm text-secondary">
                {t("workflow.objectives")}
              </div>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {totalQuestions}
              </div>
              <div className="text-sm text-secondary">
                {t("workflow.questions")}
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {totalMetrics}
              </div>
              <div className="text-sm text-secondary">
                {t("workflow.metrics")}
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {totalMeasurements}
              </div>
              <div className="text-sm text-secondary">
                {t("workflow.measurements")}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setShowDetailedView(!showDetailedView)}
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              {showDetailedView
                ? t("workflow.hideDetails")
                : t("workflow.showDetails")}
            </Button>
          </div>

          {showDetailedView && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <PlanVisualization
                plan={measurementPlan}
                projects={projects}
                showNavigation={false}
                externalCurrentPage={currentPage}
                onExternalPageChange={setCurrentPage}
              />
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
