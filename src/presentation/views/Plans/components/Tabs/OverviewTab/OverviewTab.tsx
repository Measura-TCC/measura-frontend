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
  PlanFormData,
  PlansStatistics,
} from "@/core/types/plans";

import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { Step5 } from "./steps/Step5";
import { StepIndicator } from "./components/StepIndicator";

import type { PlanStep, StepData, GoalForm } from "./utils/types";
import { availableObjectives, availableQuestions, availableMetrics } from "./utils/stepData";
import { canNavigateToStep } from "./utils/stepValidation";

interface OverviewTabProps {
  statistics: PlansStatistics;
  canCreatePlan: boolean;
  isCreatingPlan: boolean;
  planForm: UseFormReturn<PlanFormData>;
  formErrors: Record<string, { message?: string }>;
  onCreatePlan: (data: PlanFormData) => Promise<void>;
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
  const [currentStep, setCurrentStep] = useState<PlanStep>(1);
  const [stepData, setStepData] = useState<StepData>({});
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedQuestionsPerObjective, setSelectedQuestionsPerObjective] = useState<Record<string, string[]>>({});
  const [selectedMetricsPerQuestion, setSelectedMetricsPerQuestion] = useState<Record<string, string[]>>({});

  const { setValue, handleSubmit } = planForm;

  const [goalForm, setGoalForm] = useState<GoalForm>({
    purpose: "",
    issue: "",
    object: "",
    viewpoint: "",
    context: "",
  });

  setValue("type", "measurement");

  const handleAddObjective = (objectiveId: string) => {
    if (objectiveId && !selectedObjectives.includes(objectiveId)) {
      setSelectedObjectives(prev => [...prev, objectiveId]);
    }
  };

  const handleRemoveObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => prev.filter(id => id !== objectiveId));
  };

  const getObjectiveName = (id: string) => {
    const objective = availableObjectives.find(obj => obj.id === id);
    return objective ? t(objective.name) : id;
  };

  const handleAddQuestionToObjective = (objectiveId: string, questionId: string) => {
    if (questionId && !selectedQuestionsPerObjective[objectiveId]?.includes(questionId)) {
      setSelectedQuestionsPerObjective(prev => ({
        ...prev,
        [objectiveId]: [...(prev[objectiveId] || []), questionId]
      }));
    }
  };

  const handleRemoveQuestionFromObjective = (objectiveId: string, questionId: string) => {
    setSelectedQuestionsPerObjective(prev => ({
      ...prev,
      [objectiveId]: prev[objectiveId]?.filter(id => id !== questionId) || []
    }));
  };

  const getQuestionName = (id: string) => {
    const question = availableQuestions.find(q => q.id === id);
    return question ? t(question.name) : id;
  };

  const handleAddMetricToQuestion = (questionId: string, metricId: string) => {
    if (metricId && !selectedMetricsPerQuestion[questionId]?.includes(metricId)) {
      setSelectedMetricsPerQuestion(prev => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), metricId]
      }));
    }
  };

  const handleRemoveMetricFromQuestion = (questionId: string, metricId: string) => {
    setSelectedMetricsPerQuestion(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.filter(id => id !== metricId) || []
    }));
  };

  const getMetricName = (id: string) => {
    const metric = availableMetrics.find(m => m.id === id);
    return metric ? t(metric.name) : id;
  };

  const getMetricUnit = (id: string) => {
    const metric = availableMetrics.find(m => m.id === id);
    return metric ? t(metric.unit) : "";
  };

  const handleStepClick = (step: PlanStep) => {
    if (canNavigateToStep(step, stepData, selectedObjectives, selectedQuestionsPerObjective, selectedMetricsPerQuestion)) {
      setCurrentStep(step);
    }
  };

  const handleBasicsSubmit = async (data: PlanFormData) => {
    setStepData((prev) => ({ ...prev, planBasics: data }));
    setCurrentStep(2);
  };

  const handleFinalizePlan = async () => {
    if (stepData.planBasics) {
      await onCreatePlan(stepData.planBasics);
      setShowWorkflow(false);
      setCurrentStep(1);
      setStepData({});
      setSelectedObjectives([]);
      setSelectedQuestionsPerObjective({});
      setSelectedMetricsPerQuestion({});
      setGoalForm({
        purpose: "",
        issue: "",
        object: "",
        viewpoint: "",
        context: "",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            planForm={planForm}
            formErrors={formErrors}
            canCreatePlan={canCreatePlan}
            goalForm={goalForm}
            setGoalForm={setGoalForm}
            onNext={handleSubmit(handleBasicsSubmit)}
          />
        );

      case 2:
        return (
          <Step2
            selectedObjectives={selectedObjectives}
            onAddObjective={handleAddObjective}
            onRemoveObjective={handleRemoveObjective}
            getObjectiveName={getObjectiveName}
            onNext={() => setCurrentStep(3)}
          />
        );

      case 3:
        return (
          <Step3
            selectedObjectives={selectedObjectives}
            selectedQuestionsPerObjective={selectedQuestionsPerObjective}
            onAddQuestionToObjective={handleAddQuestionToObjective}
            onRemoveQuestionFromObjective={handleRemoveQuestionFromObjective}
            getObjectiveName={getObjectiveName}
            getQuestionName={getQuestionName}
            onNext={() => setCurrentStep(4)}
          />
        );

      case 4:
        return (
          <Step4
            selectedObjectives={selectedObjectives}
            selectedQuestionsPerObjective={selectedQuestionsPerObjective}
            selectedMetricsPerQuestion={selectedMetricsPerQuestion}
            onAddMetricToQuestion={handleAddMetricToQuestion}
            onRemoveMetricFromQuestion={handleRemoveMetricFromQuestion}
            getObjectiveName={getObjectiveName}
            getQuestionName={getQuestionName}
            getMetricName={getMetricName}
            getMetricUnit={getMetricUnit}
            onNext={() => setCurrentStep(5)}
          />
        );

      case 5:
        return (
          <Step5
            stepData={stepData}
            selectedObjectives={selectedObjectives}
            selectedQuestionsPerObjective={selectedQuestionsPerObjective}
            selectedMetricsPerQuestion={selectedMetricsPerQuestion}
            getObjectiveName={getObjectiveName}
            getQuestionName={getQuestionName}
            getMetricName={getMetricName}
            getMetricUnit={getMetricUnit}
            isCreatingPlan={isCreatingPlan}
            onFinalize={handleFinalizePlan}
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
          canNavigateToStep={(step: PlanStep) => canNavigateToStep(step, stepData, selectedObjectives, selectedQuestionsPerObjective, selectedMetricsPerQuestion)}
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
                {statistics.totalGoals}
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