import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import { PlusIcon, ChartIcon } from "@/presentation/assets/icons";
import {
  PlanFormData,
  PlansStatistics,
  PlanType,
  GQMGoal,
  GQMQuestion,
  GQMMetric,
} from "@/core/types/plans";

type PlanStep = 1 | 2 | 3 | 4 | 5;

interface StepData {
  planBasics?: {
    name: string;
    description: string;
    type: PlanType;
    owner: string;
  };
  goals?: GQMGoal[];
  questions?: GQMQuestion[];
  metrics?: GQMMetric[];
  collectionSetup?: boolean;
}

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

  const { register, handleSubmit, watch, setValue } = planForm;
  const selectedType = watch("type");

  const [goalForm, setGoalForm] = useState({
    purpose: "",
    issue: "",
    object: "",
    viewpoint: "",
    context: "",
  });

  const [questionForm, setQuestionForm] = useState({
    question: "",
    rationale: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  const [metricForm, setMetricForm] = useState({
    name: "",
    description: "",
    type: "objective" as "objective" | "subjective",
    scale: "",
    unit: "",
    measurementMethod: "",
    collectionFrequency: "",
    responsible: "",
  });

  const steps = [
    {
      number: 1,
      name: t("workflow.step1Title").replace("1. ", ""),
      description: t("workflow.step1Description"),
    },
    {
      number: 2,
      name: t("workflow.step2Title").replace("2. ", ""),
      description: t("workflow.step2Description"),
    },
    {
      number: 3,
      name: t("workflow.step3Title").replace("3. ", ""),
      description: t("workflow.step3Description"),
    },
    {
      number: 4,
      name: t("workflow.step4Title").replace("4. ", ""),
      description: t("workflow.step4Description"),
    },
    {
      number: 5,
      name: t("workflow.step5Title").replace("5. ", ""),
      description: t("workflow.step5Description"),
    },
  ];

  const canNavigateToStep = (step: PlanStep): boolean => {
    if (step === 1) return true;
    if (step === 2) return !!stepData.planBasics;
    if (step === 3) return !!stepData.goals && stepData.goals.length > 0;
    if (step === 4)
      return !!stepData.questions && stepData.questions.length > 0;
    if (step === 5) return !!stepData.metrics && stepData.metrics.length > 0;
    return false;
  };

  const handleStepClick = (step: PlanStep) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const handleBasicsSubmit = async (data: PlanFormData) => {
    setStepData((prev) => ({ ...prev, planBasics: data }));
    setCurrentStep(2);
  };

  const handleCreateGoal = () => {
    const newGoal: GQMGoal = {
      id: Date.now().toString(),
      planId: "temp",
      purpose: goalForm.purpose,
      issue: goalForm.issue,
      object: goalForm.object,
      viewpoint: goalForm.viewpoint,
      context: goalForm.context,
      status: "draft",
    };

    setStepData((prev) => ({
      ...prev,
      goals: [...(prev.goals || []), newGoal],
    }));

    setGoalForm({
      purpose: "",
      issue: "",
      object: "",
      viewpoint: "",
      context: "",
    });
  };

  const handleCreateQuestion = () => {
    const newQuestion: GQMQuestion = {
      id: Date.now().toString(),
      goalId: stepData.goals?.[0]?.id || "",
      question: questionForm.question,
      rationale: questionForm.rationale,
      priority: questionForm.priority,
      status: "draft",
    };

    setStepData((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));

    setQuestionForm({ question: "", rationale: "", priority: "medium" });
  };

  const handleCreateMetric = () => {
    const newMetric: GQMMetric = {
      id: Date.now().toString(),
      questionId: stepData.questions?.[0]?.id || "",
      name: metricForm.name,
      description: metricForm.description,
      type: metricForm.type,
      scale: metricForm.scale,
      unit: metricForm.unit,
      measurementMethod: metricForm.measurementMethod,
      collectionFrequency: metricForm.collectionFrequency,
      responsible: metricForm.responsible,
      status: "planned",
    };

    setStepData((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), newMetric],
    }));

    setMetricForm({
      name: "",
      description: "",
      type: "objective",
      scale: "",
      unit: "",
      measurementMethod: "",
      collectionFrequency: "",
      responsible: "",
    });
  };

  const handleFinalizePlan = async () => {
    if (stepData.planBasics) {
      await onCreatePlan(stepData.planBasics);
      setShowWorkflow(false);
      setCurrentStep(1);
      setStepData({});
    }
  };

  const planTypes: { value: PlanType; label: string }[] = [
    { value: "measurement", label: t("types.measurement") },
    { value: "quality", label: t("types.quality") },
    { value: "performance", label: t("types.performance") },
    { value: "estimation", label: t("types.estimation") },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("workflow.step1Title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                {t("workflow.step1Description")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    {t("planName")}
                  </label>
                  <Input
                    {...register("name")}
                    placeholder={t("enterPlanName")}
                    disabled={!canCreatePlan}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600">
                      {formErrors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    {t("owner")}
                  </label>
                  <Input
                    {...register("owner")}
                    placeholder={t("enterOwnerName")}
                    disabled={!canCreatePlan}
                  />
                  {formErrors.owner && (
                    <p className="text-sm text-red-600">
                      {formErrors.owner.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("description")}
                </label>
                <Input
                  {...register("description")}
                  placeholder={t("enterDescription")}
                  disabled={!canCreatePlan}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-600">
                    {formErrors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("type")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {planTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        value={type.value}
                        checked={selectedType === type.value}
                        onChange={() => setValue("type", type.value)}
                        disabled={!canCreatePlan}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-default">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleSubmit(handleBasicsSubmit)}
                disabled={!canCreatePlan}
                className="w-full md:w-auto"
              >
                {t("workflow.nextStep")}
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("workflow.step2Title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                {t("workflow.step2Description")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Purpose
                  </label>
                  <Input
                    value={goalForm.purpose}
                    onChange={(e) =>
                      setGoalForm((prev) => ({
                        ...prev,
                        purpose: e.target.value,
                      }))
                    }
                    placeholder="Analyze, Evaluate, Improve..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Issue
                  </label>
                  <Input
                    value={goalForm.issue}
                    onChange={(e) =>
                      setGoalForm((prev) => ({
                        ...prev,
                        issue: e.target.value,
                      }))
                    }
                    placeholder="productivity, quality, cost..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Object
                  </label>
                  <Input
                    value={goalForm.object}
                    onChange={(e) =>
                      setGoalForm((prev) => ({
                        ...prev,
                        object: e.target.value,
                      }))
                    }
                    placeholder="software product, process..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Viewpoint
                  </label>
                  <Input
                    value={goalForm.viewpoint}
                    onChange={(e) =>
                      setGoalForm((prev) => ({
                        ...prev,
                        viewpoint: e.target.value,
                      }))
                    }
                    placeholder="developer, manager, user..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  Context
                </label>
                <textarea
                  value={goalForm.context}
                  onChange={(e) =>
                    setGoalForm((prev) => ({
                      ...prev,
                      context: e.target.value,
                    }))
                  }
                  placeholder="project environment..."
                  rows={3}
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>

              {stepData.goals && stepData.goals.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Created Goals ({stepData.goals.length})
                  </h4>
                  {stepData.goals.map((goal, index) => (
                    <div key={goal.id} className="text-sm text-secondary">
                      {index + 1}. {goal.purpose} {goal.issue} for {goal.object}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCreateGoal}>Add Goal</Button>
                {stepData.goals && stepData.goals.length > 0 && (
                  <Button onClick={() => setCurrentStep(3)} variant="secondary">
                    {t("workflow.nextStep")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("workflow.step3Title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                {t("workflow.step3Description")}
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  Question
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  placeholder="What is the average load time on mobile devices?"
                  rows={3}
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Rationale
                  </label>
                  <Input
                    value={questionForm.rationale}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        rationale: e.target.value,
                      }))
                    }
                    placeholder="Why this question is important"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Priority
                  </label>
                  <select
                    value={questionForm.priority}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        priority: e.target.value as "high" | "medium" | "low",
                      }))
                    }
                    className="w-full p-2 border border-border rounded-md"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {stepData.questions && stepData.questions.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Created Questions ({stepData.questions.length})
                  </h4>
                  {stepData.questions.map((question, index) => (
                    <div key={question.id} className="text-sm text-secondary">
                      {index + 1}. {question.question}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCreateQuestion}>Add Question</Button>
                {stepData.questions && stepData.questions.length > 0 && (
                  <Button onClick={() => setCurrentStep(4)} variant="secondary">
                    {t("workflow.nextStep")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("workflow.step4Title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                {t("workflow.step4Description")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Metric Name
                  </label>
                  <Input
                    value={metricForm.name}
                    onChange={(e) =>
                      setMetricForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Load time (ms)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Unit
                  </label>
                  <Input
                    value={metricForm.unit}
                    onChange={(e) =>
                      setMetricForm((prev) => ({
                        ...prev,
                        unit: e.target.value,
                      }))
                    }
                    placeholder="ms, %, seconds..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Measurement Method
                  </label>
                  <Input
                    value={metricForm.measurementMethod}
                    onChange={(e) =>
                      setMetricForm((prev) => ({
                        ...prev,
                        measurementMethod: e.target.value,
                      }))
                    }
                    placeholder="Lighthouse, Analytics, Manual..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Collection Frequency
                  </label>
                  <Input
                    value={metricForm.collectionFrequency}
                    onChange={(e) =>
                      setMetricForm((prev) => ({
                        ...prev,
                        collectionFrequency: e.target.value,
                      }))
                    }
                    placeholder="Daily, Weekly, Monthly..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  Description
                </label>
                <textarea
                  value={metricForm.description}
                  onChange={(e) =>
                    setMetricForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Detailed description of what this metric measures"
                  rows={3}
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>

              {stepData.metrics && stepData.metrics.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Created Metrics ({stepData.metrics.length})
                  </h4>
                  {stepData.metrics.map((metric, index) => (
                    <div key={metric.id} className="text-sm text-secondary">
                      {index + 1}. {metric.name} ({metric.unit})
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCreateMetric}>Add Metric</Button>
                {stepData.metrics && stepData.metrics.length > 0 && (
                  <Button onClick={() => setCurrentStep(5)} variant="secondary">
                    {t("workflow.nextStep")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("workflow.step5Title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                {t("workflow.step5Description")}
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-4">Plan Summary</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> {stepData.planBasics?.name}
                  </div>
                  <div>
                    <strong>Type:</strong> {stepData.planBasics?.type}
                  </div>
                  <div>
                    <strong>Owner:</strong> {stepData.planBasics?.owner}
                  </div>
                  <div>
                    <strong>Goals:</strong> {stepData.goals?.length || 0}
                  </div>
                  <div>
                    <strong>Questions:</strong>{" "}
                    {stepData.questions?.length || 0}
                  </div>
                  <div>
                    <strong>Metrics:</strong> {stepData.metrics?.length || 0}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleFinalizePlan}
                disabled={isCreatingPlan}
                className="w-full"
              >
                {isCreatingPlan ? t("creating") : t("workflow.finalizePlan")}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (showWorkflow) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col items-center flex-1"
            >
              <button
                onClick={() => handleStepClick(step.number as PlanStep)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep === step.number
                    ? "bg-primary text-white"
                    : canNavigateToStep(step.number as PlanStep)
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-gray-200 text-gray-400"
                }`}
                disabled={!canNavigateToStep(step.number as PlanStep)}
              >
                {step.number}
              </button>
              <div className="text-xs text-center mt-1 max-w-20">
                {step.name}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mt-4 mx-2" />
              )}
            </div>
          ))}
        </div>

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
