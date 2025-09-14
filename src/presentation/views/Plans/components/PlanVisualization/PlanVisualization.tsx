import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { MeasurementPlan } from "@/core/types/plans";
import { ArrowLeftIcon, ArrowRightIcon } from "@/presentation/assets/icons";
import type { Project } from "@/core/schemas/projects";

interface PlanVisualizationProps {
  plan: MeasurementPlan;
  projects?: Project[];
  showNavigation?: boolean;
  onExport?: (format: "pdf" | "docx") => void;
  externalCurrentPage?: number;
  onExternalPageChange?: (page: number) => void;
}

interface PlanPage {
  objectives: Array<{
    objective: MeasurementPlan["objectives"][number];
    objectiveIndex: number;
  }>;
}

export const PlanVisualization: React.FC<PlanVisualizationProps> = ({
  plan,
  projects = [],
  showNavigation = true,
  onExport,
  externalCurrentPage,
  onExternalPageChange,
}) => {
  const { t } = useTranslation("plans");
  const [internalCurrentPage, setInternalCurrentPage] = useState(0);

  // Use external page if provided, otherwise use internal state
  const currentPage =
    externalCurrentPage !== undefined
      ? externalCurrentPage
      : internalCurrentPage;

  // Always show 1 objective per page for better visualization
  const objectivesPerPage = 1;
  const totalPages = Math.ceil(plan.objectives.length / objectivesPerPage);

  const getPageData = (pageIndex: number): PlanPage => {
    const startIndex = pageIndex * objectivesPerPage;
    const endIndex = Math.min(
      startIndex + objectivesPerPage,
      plan.objectives.length
    );

    return {
      objectives: plan.objectives
        .slice(startIndex, endIndex)
        .map((objective, index) => ({
          objective,
          objectiveIndex: startIndex + index + 1,
        })),
    };
  };

  const currentPageData = getPageData(currentPage);

  const getProjectName = () => {
    const project = projects.find(p => p._id === plan.associatedProject);
    return project?.name || plan.associatedProject;
  };

  const goToPreviousPage = () => {
    const newPage = Math.max(0, currentPage - 1);
    if (onExternalPageChange) {
      onExternalPageChange(newPage);
    } else {
      setInternalCurrentPage(newPage);
    }
  };

  const goToNextPage = () => {
    const newPage = Math.min(totalPages - 1, currentPage + 1);
    if (onExternalPageChange) {
      onExternalPageChange(newPage);
    } else {
      setInternalCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="min-h-[600px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("planVisualization.title")}</CardTitle>
            {onExport && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onExport("pdf")}
                >
                  {t("export.exportPdf")}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onExport("docx")}
                >
                  {t("export.exportDocx")}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
            {plan.planName && (
              <div>
                <strong>{t("measurementPlan.planName")}:</strong>{" "}
                {plan.planName}
              </div>
            )}
            <div>
              <strong>{t("measurementPlan.associatedProject")}:</strong>{" "}
              {getProjectName()}
            </div>
            <div>
              <strong>{t("measurementPlan.planResponsible")}:</strong>{" "}
              {plan.planResponsible}
            </div>
          </div>

          <div className="space-y-8">
            {currentPageData.objectives.map(({ objective, objectiveIndex }) => (
              <div
                key={`${objective.objectiveTitle}-${objectiveIndex}`}
                className="space-y-6"
              >
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t("workflow.objective")} {objectiveIndex}:{" "}
                    {t(objective.objectiveTitle)}
                  </h2>
                </div>

                {objective.questions.map((question, questionIndex) => (
                  <div
                    key={`${question.questionText}-${questionIndex}`}
                    className="ml-4 space-y-4"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        - {t("workflow.question")} {questionIndex + 1}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {t(question.questionText)}
                      </span>
                    </div>

                    {question.metrics.map((metric, metricIndex) => (
                      <div
                        key={`${metric.metricName}-${metricIndex}`}
                        className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            - {t("workflow.metric")} {metricIndex + 1}:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {t(metric.metricName)}
                          </span>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              {t("measurement.generalInfo")}:
                            </h4>
                            <div className="ml-4">
                              <div>
                                <strong>
                                  {t("metric.metricDescription")}:
                                </strong>{" "}
                                {t(metric.metricDescription)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <strong>{t("metric.metricMnemonic")}:</strong>{" "}
                              {metric.metricMnemonic}
                            </div>
                            <div>
                              <strong>{t("metric.metricFormula")}:</strong>{" "}
                              {metric.metricFormula}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              {t("measurement.controlAnalysis")}
                            </h4>
                            <div className="ml-4 space-y-1">
                              <div>
                                <strong>
                                  {t("metric.metricControlRange")}:
                                </strong>{" "}
                                [{metric.metricControlRange[0]},{" "}
                                {metric.metricControlRange[1]}]
                              </div>
                              <div>
                                <strong>
                                  {t("metric.analysisProcedure")}:
                                </strong>{" "}
                                {t(metric.analysisProcedure)}
                              </div>
                              <div>
                                <strong>
                                  {t("metric.analysisFrequency")}:
                                </strong>{" "}
                                {t(metric.analysisFrequency)}
                              </div>
                              {metric.analysisResponsible && (
                                <div>
                                  <strong>
                                    {t("metric.analysisResponsible")}:
                                  </strong>{" "}
                                  {t(metric.analysisResponsible)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              {t("measurement.measurementDetails")}
                            </h4>
                            {metric.measurements.map(
                              (measurement, measurementIndex) => (
                                <div
                                  key={`${measurement.measurementAcronym}-${measurementIndex}`}
                                  className="ml-4 space-y-1 mb-4 last:mb-0"
                                >
                                  <div className="font-medium text-gray-900">
                                    {t("types.measurement")} {measurementIndex + 1}
                                  </div>
                                  <div>
                                    <strong>
                                      {t("measurement.measurementProperties")}:
                                    </strong>{" "}
                                    {measurement.measurementProperties}
                                  </div>
                                  <div>
                                    <strong>
                                      {t("measurement.measurementUnit")}:
                                    </strong>{" "}
                                    {measurement.measurementUnit}
                                  </div>
                                  <div>
                                    <strong>
                                      {t("measurement.measurementScale")}:
                                    </strong>{" "}
                                    {measurement.measurementScale}
                                  </div>
                                  <div>
                                    <strong>
                                      {t("measurement.measurementProcedure")}:
                                    </strong>{" "}
                                    {measurement.measurementProcedure}
                                  </div>
                                  <div>
                                    <strong>
                                      {t("measurement.measurementFrequency")}:
                                    </strong>{" "}
                                    {measurement.measurementFrequency}
                                  </div>
                                  {measurement.measurementResponsible && (
                                    <div>
                                      <strong>
                                        {t(
                                          "measurement.measurementResponsible"
                                        )}
                                        :
                                      </strong>{" "}
                                      {measurement.measurementResponsible}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showNavigation && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {t("planVisualization.previous")}
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {t("planVisualization.pageOf", {
                current: currentPage + 1,
                total: totalPages,
              })}
            </span>
          </div>

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
  );
};
