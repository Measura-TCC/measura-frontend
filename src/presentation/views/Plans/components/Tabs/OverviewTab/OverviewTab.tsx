import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { PlusIcon, ChartIcon } from "@/presentation/assets/icons";
import type {
  PlansStatistics,
} from "@/core/types/plans";
import type { Objective } from "./utils/types";

import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { Step5 } from "./steps/Step5";
import { StepIndicator } from "./components/StepIndicator";

import type { PlanStep, StepData, GoalForm } from "./utils/types";

interface MeasurementPlanFormData {
  planName: string;
  associatedProject: string;
  planResponsible: string;
}

import {
  availableObjectives,
  availableQuestions,
  availableMetrics,
} from "./utils/stepData";
import { canNavigateToStep } from "./utils/stepValidation";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { useMeasurementPlans } from "@/core/hooks/measurementPlans";
import { translateObjectiveForAPI, validatePlanData } from "./utils/dataTranslation";

interface OverviewTabProps {
  statistics: PlansStatistics;
  canCreatePlan: boolean;
  isCreatingPlan: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  statistics,
  canCreatePlan,
  isCreatingPlan,
}) => {
  const { t } = useTranslation("plans");
  const { projects } = useProjects();
  const { createPlan: createMeasurementPlan } = useMeasurementPlans();
  const [currentStep, setCurrentStep] = useState<PlanStep>(1);
  const [stepData, setStepData] = useState<StepData>({});
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState<Objective[]>([]);
  const [measurementPlanForm, setMeasurementPlanForm] =
    useState<MeasurementPlanFormData>({
      planName: "",
      associatedProject: "",
      planResponsible: "",
    });


  const [goalForm, setGoalForm] = useState<GoalForm>({
    purpose: "",
    issue: "",
    object: "",
    viewpoint: "",
    context: "",
  });
  const [operationError, setOperationError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, { message?: string }>>({});

  // setValue("type", "measurement"); // Removed as not needed for MeasurementPlanFormData

  const handleStepClick = (step: PlanStep) => {
    if (
      canNavigateToStep(
        step,
        stepData,
        selectedObjectives,
        measurementPlanForm,
        goalForm
      )
    ) {
      setCurrentStep(step);
    }
  };

  const handleFinalizePlan = async (bundledData: {
    planName: string;
    associatedProject: string;
    planResponsible: string;
    objectives: any[];
  }) => {
    try {
      setOperationError(null);
      setFormErrors({});

      // Translate i18n keys to actual text
      const translatedObjectives = bundledData.objectives.map(obj =>
        translateObjectiveForAPI(obj, t)
      );

      const planDataToValidate = {
        ...bundledData,
        objectives: translatedObjectives
      };

      // Validate the data before sending to API
      const validation = validatePlanData(planDataToValidate);
      if (!validation.isValid) {
        setOperationError(`Validation failed: ${validation.errors.join(", ")}`);
        return;
      }

      await createMeasurementPlan({
        planName: bundledData.planName,
        planResponsible: bundledData.planResponsible,
        associatedProject: bundledData.associatedProject,
        objectives: translatedObjectives,
      });

      setShowWorkflow(false);
      setCurrentStep(1);
      setStepData({});
      setSelectedObjectives([]);
      setMeasurementPlanForm({
        planName: "",
        associatedProject: "",
        planResponsible: "",
      });
      setGoalForm({
        purpose: "",
        issue: "",
        object: "",
        viewpoint: "",
        context: "",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create plan";
      setOperationError(errorMessage);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            measurementPlanForm={measurementPlanForm}
            setMeasurementPlanForm={setMeasurementPlanForm}
            formErrors={formErrors}
            canCreatePlan={canCreatePlan}
            onNext={() => {
              setStepData((prev) => ({
                ...prev,
                planBasics: {
                  name: measurementPlanForm.planName,
                  description: measurementPlanForm.associatedProject,
                  owner: measurementPlanForm.planResponsible,
                  type: "measurement",
                },
              }));
              setCurrentStep(2);
            }}
          />
        );

      case 2:
        return (
          <Step2
            selectedObjectives={selectedObjectives}
            onAddObjective={(objective) => {
              setSelectedObjectives((prev) => [...prev, objective]);
            }}
            onRemoveObjective={(objectiveTitle) => {
              setSelectedObjectives((prev) =>
                prev.filter((obj) => obj.objectiveTitle !== objectiveTitle)
              );
            }}
            onNext={() => setCurrentStep(3)}
          />
        );

      case 3:
        return (
          <Step3
            selectedObjectives={selectedObjectives}
            onUpdateObjective={(index, objective) => {
              setSelectedObjectives((prev) =>
                prev.map((obj, i) => (i === index ? objective : obj))
              );
            }}
            onNext={() => setCurrentStep(4)}
          />
        );

      case 4:
        return (
          <Step4
            selectedObjectives={selectedObjectives}
            onUpdateObjective={(index, objective) => {
              setSelectedObjectives((prev) =>
                prev.map((obj, i) => (i === index ? objective : obj))
              );
            }}
            onNext={() => setCurrentStep(5)}
          />
        );

      case 5:
        return (
          <Step5
            measurementPlanForm={measurementPlanForm}
            selectedObjectives={selectedObjectives}
            projects={projects || []}
            isCreatingPlan={isCreatingPlan}
            onFinalize={handleFinalizePlan}
            onBack={() => setCurrentStep(4)}
          />
        );

      default:
        return null;
    }
  };

  if (showWorkflow) {
    return (
      <div className="space-y-6">
        <StepIndicator
          currentStep={currentStep}
          canNavigateToStep={(step: PlanStep) =>
            canNavigateToStep(
              step,
              stepData,
              selectedObjectives,
              measurementPlanForm,
              goalForm
            )
          }
          onStepClick={handleStepClick}
        />

        <div className="mt-6">
          <Button
            onClick={() => setShowWorkflow(false)}
            variant="ghost"
            size="sm"
          >
            ← {t("workflow.backToOverview")}
          </Button>
        </div>

        {operationError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
                <p className="text-sm text-red-700 mt-1">{operationError}</p>
              </div>
            </div>
          </div>
        )}

        {renderStepContent()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className={!canCreatePlan ? "opacity-50" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5 text-primary" />
              {t("createNewPlan")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-secondary">{t("workflow.subtitle")}</p>
            <Button
              onClick={() => setShowWorkflow(true)}
              className="w-full md:w-auto"
              disabled={!canCreatePlan}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("workflow.startWorkflow")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-primary" />
              {t("statistics")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("totalPlans")}</span>
              <span className="font-semibold text-default">
                {statistics.totalPlans}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("activePlans")}</span>
              <span className="font-semibold text-default">
                {statistics.activePlans}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("completedPlans")}</span>
              <span className="font-semibold text-default">
                {statistics.completedPlans}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("averageProgress")}</span>
              <span className="font-semibold text-default">
                {statistics.averageProgress}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("totalGoals")}</span>
              <span className="font-semibold text-default">
                {statistics.totalObjectives}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("totalMetrics")}</span>
              <span className="font-semibold text-default">
                {statistics.totalMetrics}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
