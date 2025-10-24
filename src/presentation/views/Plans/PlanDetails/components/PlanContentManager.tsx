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
  PencilIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@/presentation/assets/icons";
import type {
  MeasurementPlanResponseDto,
  Objective,
  Question,
  Metric,
  Measurement,
} from "@/core/types/plans";
import { CustomQuestionModal } from "../../components/Tabs/NewPlanTab/components/CustomQuestionModal";
import { CustomMetricModal } from "../../components/Tabs/NewPlanTab/components/CustomMetricModal";
import { CustomMeasurementModal } from "../../components/Tabs/NewPlanTab/components/CustomMeasurementModal";
import { CustomObjectiveModal } from "../../components/Tabs/NewPlanTab/components/CustomObjectiveModal";
import { ConfirmDeleteModal } from "@/presentation/components/modals/ConfirmDeleteModal";
import { useMeasurementPlanOperations } from "@/core/hooks/measurementPlans/useMeasurementPlanOperations";

interface PlanContentManagerProps {
  plan: MeasurementPlanResponseDto;
  isReadOnly?: boolean;
}

interface ExpandedState {
  [key: string]: boolean;
}

export const PlanContentManager: React.FC<PlanContentManagerProps> = ({
  plan,
  isReadOnly = false,
}) => {
  const { t } = useTranslation("plans");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "objective" | "question" | "metric" | "measurement";
    id: string;
    title: string;
    parentIds?: string[];
  } | null>(null);
  const [editingItem, setEditingItem] = useState<{
    type: "objective" | "question" | "metric" | "measurement";
    id?: string;
    data?: Objective | Question | Metric | Measurement;
    parentIds?: string[];
  } | null>(null);

  const {
    addObjective,
    updateObjective,
    deleteObjective,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addMetric,
    updateMetric,
    deleteMetric,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
  } = useMeasurementPlanOperations({ planId: plan.id });

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddObjective = async (objective: any) => {
    try {
      if (editingObjective?._id) {
        // Update existing objective
        await updateObjective(editingObjective._id, { objectiveTitle: objective.objectiveTitle, questions: [] });
        setEditingObjective(null);
      } else {
        // Add new objective
        await addObjective({ objectiveTitle: objective.objectiveTitle, questions: [] });
      }
      setShowObjectiveModal(false);
    } catch (error) {
      console.error("Failed to add/update objective:", error);
    }
  };

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective);
    setShowObjectiveModal(true);
  };

  const handleDeleteObjective = async (objective: Objective) => {
    setDeleteConfirm({
      type: "objective",
      id: objective._id!,
      title: t(objective.objectiveTitle),
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      switch (deleteConfirm.type) {
        case "objective":
          await deleteObjective(deleteConfirm.id);
          break;
        case "question":
          if (deleteConfirm.parentIds) {
            await deleteQuestion(deleteConfirm.parentIds[0], deleteConfirm.id);
          }
          break;
        case "metric":
          if (deleteConfirm.parentIds) {
            await deleteMetric(deleteConfirm.parentIds[0], deleteConfirm.parentIds[1], deleteConfirm.id);
          }
          break;
        case "measurement":
          if (deleteConfirm.parentIds) {
            await deleteMeasurement(
              deleteConfirm.parentIds[0],
              deleteConfirm.parentIds[1],
              deleteConfirm.parentIds[2],
              deleteConfirm.id
            );
          }
          break;
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error(`Failed to delete ${deleteConfirm.type}:`, error);
    }
  };

  const handleAddQuestion = (objectiveId: string) => {
    setEditingItem({ type: "question", parentIds: [objectiveId] });
  };

  const handleSaveQuestion = async (question: any) => {
    if (!editingItem?.parentIds) return;

    const [objectiveId] = editingItem.parentIds;
    try {
      if (editingItem.id) {
        // Edit mode
        await updateQuestion(objectiveId, editingItem.id, { questionText: question.questionText, metrics: [] });
      } else {
        // Add mode
        await addQuestion(objectiveId, { questionText: question.questionText, metrics: [] });
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  };

  const handleEditQuestion = (objectiveId: string, question: Question) => {
    setEditingItem({
      type: "question",
      id: question._id,
      data: question,
      parentIds: [objectiveId]
    });
  };

  const handleDeleteQuestion = async (objectiveId: string, question: Question) => {
    setDeleteConfirm({
      type: "question",
      id: question._id!,
      title: question.questionText,
      parentIds: [objectiveId],
    });
  };

  const handleAddMetric = (objectiveId: string, questionId: string) => {
    setEditingItem({ type: "metric", parentIds: [objectiveId, questionId] });
  };

  const handleSaveMetric = async (metric: any) => {
    if (!editingItem?.parentIds) return;

    const [objectiveId, questionId] = editingItem.parentIds;
    try {
      if (editingItem.id) {
        // Edit mode
        await updateMetric(objectiveId, questionId, editingItem.id, {
          ...metric,
          measurements: metric.measurements || []
        });
      } else {
        // Add mode
        await addMetric(objectiveId, questionId, {
          ...metric,
          measurements: metric.measurements || []
        });
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save metric:", error);
    }
  };

  const handleEditMetric = (objectiveId: string, questionId: string, metric: Metric) => {
    setEditingItem({
      type: "metric",
      id: metric._id,
      data: metric,
      parentIds: [objectiveId, questionId]
    });
  };

  const handleDeleteMetric = async (objectiveId: string, questionId: string, metric: Metric) => {
    setDeleteConfirm({
      type: "metric",
      id: metric._id!,
      title: metric.metricName,
      parentIds: [objectiveId, questionId],
    });
  };

  const handleAddMeasurement = (objectiveId: string, questionId: string, metricId: string) => {
    setEditingItem({
      type: "measurement",
      parentIds: [objectiveId, questionId, metricId]
    });
  };

  const handleSaveMeasurement = async (measurement: any) => {
    if (!editingItem?.parentIds) return;

    const [objectiveId, questionId, metricId] = editingItem.parentIds;
    try {
      if (editingItem.id) {
        // Edit mode
        await updateMeasurement(objectiveId, questionId, metricId, editingItem.id, measurement);
      } else {
        // Add mode
        await addMeasurement(objectiveId, questionId, metricId, measurement);
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save measurement:", error);
    }
  };

  const handleEditMeasurement = (
    objectiveId: string,
    questionId: string,
    metricId: string,
    measurement: Measurement
  ) => {
    setEditingItem({
      type: "measurement",
      id: measurement._id,
      data: measurement,
      parentIds: [objectiveId, questionId, metricId]
    });
  };

  const handleDeleteMeasurement = async (
    objectiveId: string,
    questionId: string,
    metricId: string,
    measurement: Measurement
  ) => {
    setDeleteConfirm({
      type: "measurement",
      id: measurement._id!,
      title: measurement.measurementEntity,
      parentIds: [objectiveId, questionId, metricId],
    });
  };

  const renderObjective = (objective: any, index: number) => {
    const objId = `obj-${index}`;
    const isExpanded = expanded[objId];

    return (
      <div key={objId} className="border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-4 bg-blue-50">
          <div className="flex items-center space-x-2 flex-1 cursor-pointer" onClick={() => toggleExpanded(objId)}>
            <button
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
                  {t(objective.objectiveTitle)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddQuestion(objective._id!);
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                {t("addQuestion")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditObjective(objective);
                }}
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteObjective(objective);
                }}
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
              renderQuestion(question, qIndex, objective._id!)
            )}
            {(!objective.questions || objective.questions.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <p>{t("noQuestionsYet")}</p>
                {!isReadOnly && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddQuestion(objective._id!)}
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

  const renderQuestion = (question: any, index: number, objectiveId: string) => {
    const qId = `q-${objectiveId}-${index}`;
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
                onClick={() => handleAddMetric(objectiveId, question._id!)}
                className="text-green-600 hover:text-green-700"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                {t("addMetric")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditQuestion(objectiveId, question)}
              >
                <PencilIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteQuestion(objectiveId, question)}
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
              renderMetric(metric, mIndex, objectiveId, question._id!)
            )}
            {(!question.metrics || question.metrics.length === 0) && (
              <div className="text-center py-3 text-gray-500">
                <p className="text-sm">{t("noMetricsYet")}</p>
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddMetric(objectiveId, question._id!)}
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

  const renderMetric = (metric: any, index: number, objectiveId: string, questionId: string) => {
    const mId = `m-${objectiveId}-${questionId}-${index}`;
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
                onClick={() => handleAddMeasurement(objectiveId, questionId, metric._id!)}
                className="text-orange-600 hover:text-orange-700"
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                {t("measurement.addMeasurement")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditMetric(objectiveId, questionId, metric)}
              >
                <PencilIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMetric(objectiveId, questionId, metric)}
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
                renderMeasurement(measurement, measIndex, objectiveId, questionId, metric._id!)
              )}
              {(!metric.measurements || metric.measurements.length === 0) && (
                <div className="text-center py-2 text-gray-500">
                  <p className="text-sm">{t("noMeasurementsYet")}</p>
                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddMeasurement(objectiveId, questionId, metric._id!)}
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
    objectiveId: string,
    questionId: string,
    metricId: string
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
                onClick={() => handleEditMeasurement(objectiveId, questionId, metricId, measurement)}
              >
                <PencilIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMeasurement(objectiveId, questionId, metricId, measurement)}
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
              <Button
                variant="primary"
                onClick={() => setShowObjectiveModal(true)}
                className="mt-2"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {t("addFirstObjective")}
              </Button>
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
            <Button
              variant="primary"
              onClick={() => setShowObjectiveModal(true)}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("addObjective")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan.objectives.map((objective: any, index: number) =>
          renderObjective(objective, index)
        )}
      </CardContent>

      {/* Modals */}
      <CustomObjectiveModal
        isOpen={showObjectiveModal}
        onClose={() => {
          setShowObjectiveModal(false);
          setEditingObjective(null);
        }}
        onAddObjective={handleAddObjective}
        existingObjectives={plan.objectives || []}
        editingData={editingObjective as any}
      />

      {editingItem?.type === "question" && (
        <CustomQuestionModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onAddQuestion={handleSaveQuestion}
          editingData={editingItem.data as any}
        />
      )}

      {editingItem?.type === "metric" && (
        <CustomMetricModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onAddMetric={handleSaveMetric}
          editingData={editingItem.data as any}
        />
      )}

      {editingItem?.type === "measurement" && editingItem.parentIds && (
        <CustomMeasurementModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onAddMeasurement={handleSaveMeasurement}
          existingMeasurements={[]}
          editingData={editingItem.data as any}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title={t(`confirmDelete${deleteConfirm?.type?.charAt(0).toUpperCase()}${deleteConfirm?.type?.slice(1)}Title`)}
        message={t(`confirmDelete${deleteConfirm?.type?.charAt(0).toUpperCase()}${deleteConfirm?.type?.slice(1)}`)}
        itemName={deleteConfirm?.title}
      />
    </Card>
  );
};