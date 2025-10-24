import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import {
  PlusIcon,
  TrashIcon,
  GearIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@/presentation/assets/icons";
import type {
  MeasurementPlanResponseDto,
} from "@/core/types/plans";
import { CustomQuestionModal } from "../../components/Tabs/NewPlanTab/components/CustomQuestionModal";
import { CustomMetricModal } from "../../components/Tabs/NewPlanTab/components/CustomMetricModal";
import { CustomMeasurementModal } from "../../components/Tabs/NewPlanTab/components/CustomMeasurementModal";
import { availableObjectives } from "../../components/Tabs/NewPlanTab/utils/stepData";

interface PlanContentManagerProps {
  plan: MeasurementPlanResponseDto;
  onUpdatePlan: (planId: string, updates: any) => Promise<MeasurementPlanResponseDto>;
  isReadOnly?: boolean;
}

interface ExpandedState {
  [key: string]: boolean;
}

export const PlanContentManager: React.FC<PlanContentManagerProps> = ({
  plan,
  onUpdatePlan,
  isReadOnly = false,
}) => {
  const { t } = useTranslation("plans");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [editingItem, setEditingItem] = useState<{
    type: "objective" | "question" | "metric" | "measurement";
    id?: string;
    parentIds?: string[];
  } | null>(null);
  const [showObjectiveDropdown, setShowObjectiveDropdown] = useState(false);

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddObjective = (objective: any) => {
    const updatedObjectives = [...(plan.objectives || []), objective];
    onUpdatePlan(plan.id, { objectives: updatedObjectives });
    setShowObjectiveDropdown(false);
  };

  const handleDeleteObjective = async (objectiveTitle: string) => {
    if (!confirm(t("confirmDeleteObjective"))) return;
    const updatedObjectives = plan.objectives?.filter(obj => obj.objectiveTitle !== objectiveTitle);
    await onUpdatePlan(plan.id, { objectives: updatedObjectives });
  };

  const handleAddQuestion = (objectiveTitle: string) => {
    setEditingItem({ type: "question", parentIds: [objectiveTitle] });
  };

  const handleSaveQuestion = async (question: any) => {
    if (!editingItem?.parentIds) return;

    const [objectiveTitle] = editingItem.parentIds;
    const updatedObjectives = plan.objectives?.map(obj => {
      if (obj.objectiveTitle === objectiveTitle) {
        return {
          ...obj,
          questions: [...(obj.questions || []), question],
        };
      }
      return obj;
    });

    await onUpdatePlan(plan.id, { objectives: updatedObjectives });
    setEditingItem(null);
  };

  const handleDeleteQuestion = async (objectiveTitle: string, questionText: string) => {
    if (!confirm(t("confirmDeleteQuestion"))) return;

    const updatedObjectives = plan.objectives?.map(obj => {
      if (obj.objectiveTitle === objectiveTitle) {
        return {
          ...obj,
          questions: obj.questions?.filter(q => q.questionText !== questionText),
        };
      }
      return obj;
    });

    await onUpdatePlan(plan.id, { objectives: updatedObjectives });
  };

  const handleAddMetric = (objectiveTitle: string, questionText: string) => {
    setEditingItem({ type: "metric", parentIds: [objectiveTitle, questionText] });
  };

  const handleSaveMetric = async (metric: any) => {
    if (!editingItem?.parentIds) return;

    const [objectiveTitle, questionText] = editingItem.parentIds;
    const updatedObjectives = plan.objectives?.map(obj => {
      if (obj.objectiveTitle === objectiveTitle) {
        return {
          ...obj,
          questions: obj.questions?.map(q => {
            if (q.questionText === questionText) {
              return {
                ...q,
                metrics: [...(q.metrics || []), metric],
              };
            }
            return q;
          }),
        };
      }
      return obj;
    });

    await onUpdatePlan(plan.id, { objectives: updatedObjectives });
    setEditingItem(null);
  };

  const handleDeleteMetric = async (objectiveTitle: string, questionText: string, metricMnemonic: string) => {
    if (!confirm(t("confirmDeleteMetric"))) return;

    const updatedObjectives = plan.objectives?.map(obj => {
      if (obj.objectiveTitle === objectiveTitle) {
        return {
          ...obj,
          questions: obj.questions?.map(q => {
            if (q.questionText === questionText) {
              return {
                ...q,
                metrics: q.metrics?.filter(m => m.metricMnemonic !== metricMnemonic),
              };
            }
            return q;
          }),
        };
      }
      return obj;
    });

    await onUpdatePlan(plan.id, { objectives: updatedObjectives });
  };

  const handleAddMeasurement = (objectiveTitle: string, questionText: string, metricMnemonic: string) => {
    setEditingItem({
      type: "measurement",
      parentIds: [objectiveTitle, questionText, metricMnemonic]
    });
  };

  const handleSaveMeasurement = async (measurement: any) => {
    if (!editingItem?.parentIds) return;

    const [objectiveTitle, questionText, metricMnemonic] = editingItem.parentIds;
    const updatedObjectives = plan.objectives?.map(obj => {
      if (obj.objectiveTitle === objectiveTitle) {
        return {
          ...obj,
          questions: obj.questions?.map(q => {
            if (q.questionText === questionText) {
              return {
                ...q,
                metrics: q.metrics?.map(m => {
                  if (m.metricMnemonic === metricMnemonic) {
                    return {
                      ...m,
                      measurements: [...(m.measurements || []), measurement],
                    };
                  }
                  return m;
                }),
              };
            }
            return q;
          }),
        };
      }
      return obj;
    });

    await onUpdatePlan(plan.id, { objectives: updatedObjectives });
    setEditingItem(null);
  };

  const handleDeleteMeasurement = async (
    objectiveTitle: string,
    questionText: string,
    metricMnemonic: string,
    measurementAcronym: string
  ) => {
    if (!confirm(t("confirmDeleteMeasurement"))) return;

    const updatedObjectives = plan.objectives?.map(obj => {
      if (obj.objectiveTitle === objectiveTitle) {
        return {
          ...obj,
          questions: obj.questions?.map(q => {
            if (q.questionText === questionText) {
              return {
                ...q,
                metrics: q.metrics?.map(m => {
                  if (m.metricMnemonic === metricMnemonic) {
                    return {
                      ...m,
                      measurements: m.measurements?.filter(meas => meas.measurementAcronym !== measurementAcronym),
                    };
                  }
                  return m;
                }),
              };
            }
            return q;
          }),
        };
      }
      return obj;
    });

    await onUpdatePlan(plan.id, { objectives: updatedObjectives });
  };

  const renderObjective = (objective: any, index: number) => {
    const objId = `obj-${index}`;
    const isExpanded = expanded[objId];

    return (
      <div key={objId} className="border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-4 bg-blue-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleExpanded(objId)}
              className="p-1 hover:bg-blue-100 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                O{index + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {objective.objectiveTitle}
                </h3>
                <p className="text-sm text-gray-500">
                  {objective.questions?.length || 0} {t("workflow.questions")}
                </p>
              </div>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddQuestion(objective.objectiveTitle)}
                className="text-blue-600 hover:text-blue-700"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                {t("addQuestion")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem({ type: "objective", id: objective.objectiveTitle })}
              >
                <GearIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteObjective(objective.objectiveTitle)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="p-4 space-y-4">
            {objective.questions?.map((question: any, qIndex: number) =>
              renderQuestion(question, qIndex, objective.objectiveTitle)
            )}
            {(!objective.questions || objective.questions.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <p>{t("noQuestionsYet")}</p>
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddQuestion(objective.objectiveTitle)}
                    className="mt-2"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    {t("addFirstQuestion")}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = (question: any, index: number, objectiveTitle: string) => {
    const qId = `q-${objectiveTitle}-${index}`;
    const isExpanded = expanded[qId];

    return (
      <div key={qId} className="border border-gray-200 rounded-lg ml-4">
        <div className="flex items-center justify-between p-3 bg-green-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleExpanded(qId)}
              className="p-1 hover:bg-green-100 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                Q{index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">
                  {question.questionText}
                </h4>
                <p className="text-xs text-gray-500">
                  {question.metrics?.length || 0} {t("workflow.metrics")}
                </p>
              </div>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddMetric(objectiveTitle, question.questionText)}
                className="text-green-600 hover:text-green-700"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                {t("addMetric")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem({
                  type: "question",
                  id: question.questionText,
                  parentIds: [objectiveTitle]
                })}
              >
                <GearIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteQuestion(objectiveTitle, question.questionText)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="p-3 space-y-3">
            {question.metrics?.map((metric: any, mIndex: number) =>
              renderMetric(metric, mIndex, objectiveTitle, question.questionText)
            )}
            {(!question.metrics || question.metrics.length === 0) && (
              <div className="text-center py-3 text-gray-500">
                <p className="text-sm">{t("noMetricsYet")}</p>
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddMetric(objectiveTitle, question.questionText)}
                    className="mt-2"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    {t("addFirstMetric")}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMetric = (metric: any, index: number, objectiveTitle: string, questionText: string) => {
    const mId = `m-${objectiveTitle}-${questionText}-${index}`;
    const isExpanded = expanded[mId];

    return (
      <div key={mId} className="border border-gray-200 rounded-lg ml-4">
        <div className="flex items-center justify-between p-3 bg-orange-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleExpanded(mId)}
              className="p-1 hover:bg-orange-100 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                M{index + 1}
              </div>
              <div>
                <h5 className="font-medium text-gray-900 text-sm">
                  {metric.metricName} ({metric.metricMnemonic})
                </h5>
                <p className="text-xs text-gray-500">
                  {metric.measurements?.length || 0} {t("workflow.measurements")}
                </p>
              </div>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddMeasurement(objectiveTitle, questionText, metric.metricMnemonic)}
                className="text-orange-600 hover:text-orange-700"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                {t("addMeasurement")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem({
                  type: "metric",
                  id: metric.metricMnemonic,
                  parentIds: [objectiveTitle, questionText]
                })}
              >
                <GearIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMetric(objectiveTitle, questionText, metric.metricMnemonic)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="font-medium text-gray-700">{t("description")}:</span>
                <p className="text-gray-600">{metric.metricDescription}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t("formula")}:</span>
                <p className="font-mono text-gray-600">{metric.metricFormula}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t("controlRange")}:</span>
                <p className="text-gray-600">
                  {metric.metricControlRange?.[0]} - {metric.metricControlRange?.[1]}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">{t("analysisFreq")}:</span>
                <p className="text-gray-600">{metric.analysisFrequency}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h6 className="font-medium text-gray-700 text-sm">{t("workflow.measurements")}:</h6>
              {metric.measurements?.map((measurement: any, measIndex: number) =>
                renderMeasurement(measurement, measIndex, objectiveTitle, questionText, metric.metricMnemonic)
              )}
              {(!metric.measurements || metric.measurements.length === 0) && (
                <div className="text-center py-2 text-gray-500">
                  <p className="text-sm">{t("noMeasurementsYet")}</p>
                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddMeasurement(objectiveTitle, questionText, metric.metricMnemonic)}
                      className="mt-1"
                    >
                      <PlusIcon className="w-3 h-3 mr-1" />
                      {t("addFirstMeasurement")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMeasurement = (
    measurement: any,
    index: number,
    objectiveTitle: string,
    questionText: string,
    metricMnemonic: string
  ) => {
    return (
      <div key={index} className="border border-gray-200 rounded p-2 ml-4 bg-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </div>
            <div>
              <h6 className="font-medium text-gray-900 text-sm">
                {measurement.measurementEntity} ({measurement.measurementAcronym})
              </h6>
              <p className="text-xs text-gray-500">
                {measurement.measurementUnit} • {measurement.measurementFrequency}
              </p>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem({
                  type: "measurement",
                  id: measurement.measurementAcronym,
                  parentIds: [objectiveTitle, questionText, metricMnemonic]
                })}
              >
                <GearIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMeasurement(objectiveTitle, questionText, metricMnemonic, measurement.measurementAcronym)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <p><strong>{t("properties")}:</strong> {measurement.measurementProperties}</p>
          <p><strong>{t("procedure")}:</strong> {measurement.measurementProcedure}</p>
        </div>
      </div>
    );
  };

  if (!plan.objectives || plan.objectives.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("planContent")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("noPlanContent")}
              </h3>
              <p className="text-gray-500 mb-6">
                {t("startByAddingObjective")}
              </p>
            </div>
            {!isReadOnly && (
              <div className="relative inline-block">
                <select
                  className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer appearance-none pr-10"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      const objective = availableObjectives.find(
                        (obj) => obj.objectiveTitle === e.target.value
                      );
                      if (objective) {
                        handleAddObjective(objective);
                      }
                    }
                  }}
                >
                  <option value="">{t("addFirstObjective")}</option>
                  {availableObjectives
                    .filter(
                      (obj) =>
                        !plan.objectives?.some(
                          (selected) => selected.objectiveTitle === obj.objectiveTitle
                        )
                    )
                    .map((objective) => (
                      <option key={objective.objectiveTitle} value={objective.objectiveTitle}>
                        {t(objective.objectiveTitle)}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <PlusIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("planContent")}</CardTitle>
          {!isReadOnly && (
            <div className="relative">
              <select
                className="px-3 py-2 bg-primary text-white rounded-md cursor-pointer appearance-none pr-8 text-sm"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const objective = availableObjectives.find(
                      (obj) => obj.objectiveTitle === e.target.value
                    );
                    if (objective) {
                      handleAddObjective(objective);
                    }
                  }
                }}
              >
                <option value="">{t("addObjective")}</option>
                {availableObjectives
                  .filter(
                    (obj) =>
                      !plan.objectives?.some(
                        (selected) => selected.objectiveTitle === obj.objectiveTitle
                      )
                  )
                  .map((objective) => (
                    <option key={objective.objectiveTitle} value={objective.objectiveTitle}>
                      {t(objective.objectiveTitle)}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <PlusIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan.objectives.map((objective: any, index: number) =>
          renderObjective(objective, index)
        )}
      </CardContent>

      {/* Modals */}
      {editingItem?.type === "question" && (
        <CustomQuestionModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onAddQuestion={handleSaveQuestion}
        />
      )}

      {editingItem?.type === "metric" && (
        <CustomMetricModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onAddMetric={handleSaveMetric}
        />
      )}

      {editingItem?.type === "measurement" && editingItem.parentIds && (
        <CustomMeasurementModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onAddMeasurement={handleSaveMeasurement}
          existingMeasurements={[]}
        />
      )}
    </Card>
  );
};