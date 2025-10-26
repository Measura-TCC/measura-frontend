import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { EyeIcon } from "@/presentation/assets/icons";
import type { Project } from "@/core/schemas/projects";
import { PlanVisualization } from "../../../PlanVisualization";
import { PlanGQMStructure } from "../../../PlanGQMStructure";
import type { MeasurementPlan } from "@/core/types/plans";

interface MeasurementPlanFormData {
  planName: string;
  associatedProject: string;
  planResponsible: string;
}

interface Objective {
  objectiveTitle: string;
  questions: Question[];
}

interface Question {
  questionText: string;
  metrics: Metric[];
}

interface Metric {
  metricName: string;
  measurements: Measurement[];
}

interface Measurement {
  measurementUnit: string;
}

interface BundledPlanData {
  planName: string;
  associatedProject: string;
  planResponsible: string;
  objectives: Objective[];
}

interface Step5Props {
  measurementPlanForm: MeasurementPlanFormData;
  selectedObjectives: Objective[];
  projects: Project[];
  isCreatingPlan: boolean;
  onFinalize: (planData: BundledPlanData) => Promise<void>;
  onBack: () => void;
}

export const Step5: React.FC<Step5Props> = ({
  measurementPlanForm,
  selectedObjectives,
  projects,
  isCreatingPlan,
  onFinalize,
  onBack,
}) => {
  const { t } = useTranslation("plans");
  const [showDetailed, setShowDetailed] = useState(false);

  const getProjectName = () => {
    const project = projects.find(p => p._id === measurementPlanForm.associatedProject);
    return project?.name || measurementPlanForm.associatedProject;
  };

  // Convert data to MeasurementPlan format for PlanVisualization
  const convertToPlanFormat = (): MeasurementPlan => {
    return {
      planName: measurementPlanForm.planName,
      associatedProject: measurementPlanForm.associatedProject,
      planResponsible: measurementPlanForm.planResponsible,
      objectives: selectedObjectives.map((objective) => ({
        objectiveTitle: objective.objectiveTitle,
        questions: objective.questions.map((question) => ({
          questionText: question.questionText,
          metrics: question.metrics.map((metric, mIndex) => {
            // Extract the metric name from the full key (e.g., "metrics.leadTimeForChanges" -> "leadTimeForChanges")
            const metricKey = metric.metricName.replace(/^metrics\./, '');

            return {
              metricName: metric.metricName,
              metricDescription: `metrics.descriptions.${metricKey}`,
              metricMnemonic: `M${mIndex + 1}`,
              metricFormula: metric.metricName,
              metricControlRange: [0, 100] as [number, number],
              analysisProcedure: `analysis.procedures.${metricKey}`,
              analysisFrequency: "analysis.frequency.weekly",
              analysisResponsible: measurementPlanForm.planResponsible,
              measurements: metric.measurements.map((measurement, measIndex) => ({
                measurementEntity: `Entity ${measIndex + 1}`,
                measurementAcronym: `M${measIndex + 1}`,
                measurementProperties: `measurements.properties.${metricKey}`,
                measurementUnit: measurement.measurementUnit,
                measurementScale: "scales.continuous",
                measurementProcedure: `measurements.procedures.${metricKey}`,
                measurementFrequency: metricKey === 'leadTimeForChanges' ? "measurements.frequency.perCommit" : "measurements.frequency.continuousIteration",
                measurementResponsible: measurementPlanForm.planResponsible,
              }))
            };
          })
        }))
      })),
    };
  };

  const handleFinalizePlan = async () => {
    const bundledData: BundledPlanData = {
      planName: measurementPlanForm.planName,
      associatedProject: measurementPlanForm.associatedProject,
      planResponsible: measurementPlanForm.planResponsible,
      objectives: selectedObjectives,
    };

    await onFinalize(bundledData);
  };

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
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">{t("workflow.planSummary")}</h4>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowDetailed(!showDetailed)}
              className="flex items-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              {showDetailed ? "Ver Resumo" : "Visualizar Detalhes"}
            </Button>
          </div>
          {!showDetailed ? (
            <>
              <div className="space-y-2 text-sm mb-4">
                <div>
                  <strong>{t("measurementPlan.planName")}:</strong>{" "}
                  {measurementPlanForm.planName}
                </div>
                <div>
                  <strong>{t("measurementPlan.associatedProject")}:</strong>{" "}
                  {getProjectName()}
                </div>
                <div>
                  <strong>{t("measurementPlan.planResponsible")}:</strong>{" "}
                  {measurementPlanForm.planResponsible}
                </div>
              </div>

              <PlanGQMStructure plan={convertToPlanFormat()} />

              {selectedObjectives.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    {t("workflow.noDataWarning")}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4">
              <PlanVisualization
                plan={convertToPlanFormat()}
                projects={projects}
                showNavigation={true}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={onBack}
            disabled={isCreatingPlan}
          >
            {t("back")}
          </Button>

          <Button
            onClick={handleFinalizePlan}
            disabled={isCreatingPlan || selectedObjectives.length === 0}
            variant="primary"
          >
            {isCreatingPlan ? t("workflow.creating") : t("workflow.finalizePlan")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};