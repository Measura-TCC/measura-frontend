import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { PlusIcon, ChartIcon } from "@/presentation/assets/icons";
import type {
  CreateMeasurementPlanDto,
  PlansStatistics,
} from "@/core/types/plans";

import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { Step5 } from "./steps/Step5";
import { StepIndicator } from "./components/StepIndicator";

import type { PlanStep, StepData, Objective } from "./utils/types";
import type { GoalForm, MeasurementPlanFormData } from "@/core/types/measurement-plans";
import {
  availableObjectives,
  availableQuestions,
  availableMetrics,
} from "./utils/stepData";
import { canNavigateToStep } from "./utils/stepValidation";
import { useProjects } from "@/core/hooks/projects/useProjects";

interface OverviewTabProps {
  statistics: PlansStatistics;
  canCreatePlan: boolean;
  isCreatingPlan: boolean;
  planForm: UseFormReturn<CreateMeasurementPlanDto>;
  formErrors: Record<string, { message?: string }>;
  onCreatePlan: (data: CreateMeasurementPlanDto) => Promise<void>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  statistics,
  canCreatePlan,
  isCreatingPlan,
  planForm,
  formErrors,
  onCreatePlan,
}) => {
  const { t } = useTranslation("plans");
  const { projects } = useProjects();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepData, setStepData] = useState<StepData>({});
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState<Objective[]>([]);
  const [measurementPlanForm, setMeasurementPlanForm] =
    useState<MeasurementPlanFormData>({
      planName: "",
      associatedProject: "",
      planResponsible: "",
    });

  const { setValue } = planForm;

  const [goalForm, setGoalForm] = useState<GoalForm>({
    goal: "",
    purpose: "",
    issue: "",
    object: "",
    viewpoint: "",
    context: "",
  });

  // setValue("type", "measurement"); // Removed as not needed for MeasurementPlanFormData

  const handleStepClick = (step: number) => {
    if (
      canNavigateToStep(
        currentStep,
        step,
        stepData
      )
    ) {
      setCurrentStep(step);
    }
  };

  const handleFinalizePlan = async () => {
    await onCreatePlan({
      planName: measurementPlanForm.planName,
      associatedProject: measurementPlanForm.associatedProject,
      planResponsible: measurementPlanForm.planResponsible,
      objectives: selectedObjectives.map(obj => ({
        objectiveTitle: obj.objectiveTitle,
        questions: obj.questions || []
      }))
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
      goal: "",
      purpose: "",
      issue: "",
      object: "",
      viewpoint: "",
      context: "",
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            planForm={planForm}
            measurementPlanForm={measurementPlanForm}
            setMeasurementPlanForm={setMeasurementPlanForm}
            formErrors={formErrors}
            canCreatePlan={canCreatePlan}
            goalForm={goalForm}
            setGoalForm={setGoalForm}
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
            measurementPlan={{
              planName: measurementPlanForm.planName,
              associatedProject: measurementPlanForm.associatedProject,
              planResponsible: measurementPlanForm.planResponsible,
              objectives: selectedObjectives,
            }}
            onFinish={handleFinalizePlan}
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
          totalSteps={5}
          stepTitles={["Plan", "Objectives", "Questions", "Metrics", "Review"]}
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
              <span className="text-secondary">{t("approvedPlans")}</span>
              <span className="font-semibold text-default">
                {statistics.approvedPlans}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("finishedPlans")}</span>
              <span className="font-semibold text-default">
                {statistics.finishedPlans}
              </span>
            </div>
            {/* <div className="flex justify-between items-center">
              <span className="text-secondary">{t("averageProgress")}</span>
              <span className="font-semibold text-default">
                {statistics.averageProgress}%
              </span>
            </div> */}
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
