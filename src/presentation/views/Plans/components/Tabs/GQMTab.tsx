import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import { TargetIcon } from "@/presentation/assets/icons";
import {
  Plan,
  GQMData,
  GQMGoal,
  GQMQuestion,
  GQMMetric,
} from "@/core/types/plans";

type GQMStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface GQMStepData {
  step: GQMStep;
  key: string;
  title: string;
  description: string;
  completed: boolean;
}

interface GoalFormData {
  purpose: string;
  issue: string;
  object: string;
  viewpoint: string;
  context: string;
}

interface QuestionFormData {
  question: string;
  rationale: string;
  priority: "high" | "medium" | "low";
}

interface MetricFormData {
  name: string;
  description: string;
  type: "objective" | "subjective";
  scale: string;
  unit: string;
  measurementMethod: string;
  collectionFrequency: string;
  responsible: string;
}

interface GQMTabProps {
  plans: Plan[] | undefined;
  selectedPlanId?: string;
  gqmData: GQMData;
  onSelectPlan: (planId: string) => void;
  onCreateGoal: (goalData: Partial<GQMGoal>) => Promise<void>;
  onCreateQuestion: (questionData: Partial<GQMQuestion>) => Promise<void>;
  onCreateMetric: (metricData: Partial<GQMMetric>) => Promise<void>;
  onCompleteStep: (step: GQMStep) => Promise<void>;
}

export const GQMTab: React.FC<GQMTabProps> = ({
  plans,
  selectedPlanId,
  gqmData,
  onSelectPlan,
  onCreateGoal,
  onCreateQuestion,
  onCreateMetric,
  onCompleteStep,
}) => {
  const { t } = useTranslation("plans");
  const [currentStep, setCurrentStep] = useState<GQMStep>(1);
  const [goalForm, setGoalForm] = useState<GoalFormData>({
    purpose: "",
    issue: "",
    object: "",
    viewpoint: "",
    context: "",
  });
  const [questionForm, setQuestionForm] = useState<QuestionFormData>({
    question: "",
    rationale: "",
    priority: "medium",
  });
  const [metricForm, setMetricForm] = useState<MetricFormData>({
    name: "",
    description: "",
    type: "objective",
    scale: "",
    unit: "",
    measurementMethod: "",
    collectionFrequency: "",
    responsible: "",
  });

  const selectedPlan = plans?.find((p) => p.id === selectedPlanId);

  const gqmSteps: GQMStepData[] = [
    {
      step: 1,
      key: "defineGoals",
      title: t("gqm.steps.defineGoals"),
      description: t("gqm.stepDescriptions.defineGoals"),
      completed: gqmData.goals.length > 0,
    },
    {
      step: 2,
      key: "applyGQM",
      title: t("gqm.steps.applyGQM"),
      description: t("gqm.stepDescriptions.applyGQM"),
      completed: gqmData.goals.some((g) => g.purpose && g.issue && g.object),
    },
    {
      step: 3,
      key: "deriveQuestions",
      title: t("gqm.steps.deriveQuestions"),
      description: t("gqm.stepDescriptions.deriveQuestions"),
      completed: gqmData.questions.length > 0,
    },
    {
      step: 4,
      key: "defineMetrics",
      title: t("gqm.steps.defineMetrics"),
      description: t("gqm.stepDescriptions.defineMetrics"),
      completed: gqmData.metrics.length > 0,
    },
    {
      step: 5,
      key: "establishCollection",
      title: t("gqm.steps.establishCollection"),
      description: t("gqm.stepDescriptions.establishCollection"),
      completed: gqmData.metrics.some(
        (m) => m.measurementMethod && m.collectionFrequency
      ),
    },
    {
      step: 6,
      key: "analyzeData",
      title: t("gqm.steps.analyzeData"),
      description: t("gqm.stepDescriptions.analyzeData"),
      completed: false,
    },
    {
      step: 7,
      key: "takeAction",
      title: t("gqm.steps.takeAction"),
      description: t("gqm.stepDescriptions.takeAction"),
      completed: false,
    },
    {
      step: 8,
      key: "reviewIterate",
      title: t("gqm.steps.reviewIterate"),
      description: t("gqm.stepDescriptions.reviewIterate"),
      completed: false,
    },
  ];

  const currentStepData = gqmSteps.find((s) => s.step === currentStep);
  const completedSteps = gqmSteps.filter((s) => s.completed).length;
  const progressPercentage = (completedSteps / gqmSteps.length) * 100;

  const handleCreateGoal = async () => {
    if (!selectedPlanId) return;

    const goalData = {
      planId: selectedPlanId,
      purpose: goalForm.purpose,
      issue: goalForm.issue,
      object: goalForm.object,
      viewpoint: goalForm.viewpoint,
      context: goalForm.context,
      status: "draft" as const,
    };

    await onCreateGoal(goalData);
    setGoalForm({
      purpose: "",
      issue: "",
      object: "",
      viewpoint: "",
      context: "",
    });
  };

  const handleCreateQuestion = async () => {
    const questionData = {
      goalId: gqmData.goals[0]?.id || "",
      question: questionForm.question,
      rationale: questionForm.rationale,
      priority: questionForm.priority,
      status: "draft" as const,
    };

    await onCreateQuestion(questionData);
    setQuestionForm({ question: "", rationale: "", priority: "medium" });
  };

  const handleCreateMetric = async () => {
    const metricData = {
      questionId: gqmData.questions[0]?.id || "",
      ...metricForm,
      status: "planned" as const,
    };

    await onCreateMetric(metricData);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("gqm.steps.defineGoals")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button onClick={handleCreateGoal} className="w-full md:w-auto">
                Create Goal
              </Button>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("gqm.steps.deriveQuestions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        priority: e.target
                          .value as QuestionFormData["priority"],
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
              <Button
                onClick={handleCreateQuestion}
                className="w-full md:w-auto"
              >
                Create Question
              </Button>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("gqm.steps.defineMetrics")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    Type
                  </label>
                  <select
                    value={metricForm.type}
                    onChange={(e) =>
                      setMetricForm((prev) => ({
                        ...prev,
                        type: e.target.value as MetricFormData["type"],
                      }))
                    }
                    className="w-full p-2 border border-border rounded-md"
                  >
                    <option value="objective">Objective</option>
                    <option value="subjective">Subjective</option>
                  </select>
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
                    Scale
                  </label>
                  <Input
                    value={metricForm.scale}
                    onChange={(e) =>
                      setMetricForm((prev) => ({
                        ...prev,
                        scale: e.target.value,
                      }))
                    }
                    placeholder="0-100, 1-5, ratio..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Responsible
                </label>
                <Input
                  value={metricForm.responsible}
                  onChange={(e) =>
                    setMetricForm((prev) => ({
                      ...prev,
                      responsible: e.target.value,
                    }))
                  }
                  placeholder="Team or person responsible for collection"
                />
              </div>
              <Button onClick={handleCreateMetric} className="w-full md:w-auto">
                Create Metric
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{currentStepData?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary mb-4">
                {currentStepData?.description}
              </p>
              <Button
                onClick={() => onCompleteStep(currentStep)}
                disabled={currentStepData?.completed}
              >
                {currentStepData?.completed ? "Completed" : "Mark as Complete"}
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <TargetIcon className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-default mb-2">
            {t("gqm.noPlansForGQM")}
          </h3>
          <p className="text-secondary">{t("gqm.createPlanFirst")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-primary" />
            {t("gqm.selectPlan")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedPlanId || ""}
            onChange={(e) => onSelectPlan(e.target.value)}
            className="w-full p-2 border border-border rounded-md"
          >
            <option value="">{t("gqm.choosePlan")}</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - {t(`gqm.phases.${plan.gqmPhase || "planning"}`)}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedPlan && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Measurement Plan Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {gqmSteps.map((step) => (
                      <button
                        key={step.step}
                        onClick={() => setCurrentStep(step.step)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          currentStep === step.step
                            ? "bg-primary text-white"
                            : step.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {step.completed && (
                            <span className="text-green-600">✓</span>
                          )}
                          <span>{step.step}</span>
                        </div>
                        <div className="text-xs mt-1 opacity-80">
                          {step.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {renderStepContent()}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("gqm.goals")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {gqmData.goals.length}
                    </div>
                    <p className="text-sm text-muted">
                      {t("gqm.goalsDefinedForPlan")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("gqm.questions")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {gqmData.questions.length}
                    </div>
                    <p className="text-sm text-muted">
                      {t("gqm.questionsDefinedForGoals")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("gqm.metrics")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {gqmData.metrics.length}
                    </div>
                    <p className="text-sm text-muted">
                      {t("gqm.metricsDefinedForQuestions")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
