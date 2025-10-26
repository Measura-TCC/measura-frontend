import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  SearchableDropdown,
  type SearchableDropdownItem,
} from "@/presentation/components/primitives";
import { TargetIcon } from "@/presentation/assets/icons";
import { gqmTemplates, commonQuestions, metricTemplates } from "@/core/utils/gqmItems";

interface ObjectiveSelection {
  id: string;
  name: string;
  description: string;
  purpose: string;
  issue: string;
  object: string;
  viewpoint: string;
  context: string;
}

interface QuestionSelection {
  id: string;
  objectiveId: string;
  question: string;
  category: string;
}

interface MetricSelection {
  id: string;
  questionId: string;
  name: string;
  unit: string;
  description: string;
  type: "objective" | "subjective";
  scale: string;
  measurementMethod?: string;
}

interface SelectionState {
  objective: ObjectiveSelection | null;
  question: QuestionSelection | null;
  metric: MetricSelection | null;
}

interface ObjectiveQuestionMetricSelectorProps {
  onSelectionComplete: (selection: SelectionState) => void;
  onCancel: () => void;
}

export const ObjectiveQuestionMetricSelector: React.FC<ObjectiveQuestionMetricSelectorProps> = ({
  onSelectionComplete,
  onCancel,
}) => {
  const { t } = useTranslation(["plans", "gqm"]);
  const [selection, setSelection] = useState<SelectionState>({
    objective: null,
    question: null,
    metric: null,
  });

  const [showCreateObjective, setShowCreateObjective] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [showCreateMetric, setShowCreateMetric] = useState(false);

  const [newObjective, setNewObjective] = useState({
    name: "",
    description: "",
    purpose: "",
    issue: "",
    object: "",
    viewpoint: "",
    context: "",
  });

  const [newQuestion, setNewQuestion] = useState({
    question: "",
  });

  const [newMetric, setNewMetric] = useState({
    name: "",
    description: "",
    unit: "",
    measurementMethod: "",
  });

  const objectiveItems: SearchableDropdownItem[] = gqmTemplates.map((template) => ({
    id: template.id,
    label: template.name,
    value: template.id,
  }));

  const questionItems: SearchableDropdownItem[] = selection.objective
    ? commonQuestions
        .find((q) => q.category === selection.objective!.id)
        ?.questions.map((question, index) => ({
          id: `${selection.objective!.id}-q${index}`,
          label: question,
          value: `${selection.objective!.id}-q${index}`,
        })) || []
    : [];

  const metricItems: SearchableDropdownItem[] = selection.question
    ? metricTemplates
        .filter((metric) => 
          metric.name.toLowerCase().includes(selection.objective?.issue.toLowerCase() || "") ||
          metric.description.toLowerCase().includes(selection.objective?.issue.toLowerCase() || "")
        )
        .map((metric, index) => ({
          id: `metric-${index}`,
          label: metric.name,
          value: `metric-${index}`,
        }))
    : [];

  const handleObjectiveSelect = (value: string | null) => {
    if (!value) {
      setSelection({ objective: null, question: null, metric: null });
      return;
    }

    const selectedObjective = gqmTemplates.find((template) => template.id === value);
    if (selectedObjective) {
      const objectiveSelection: ObjectiveSelection = {
        id: selectedObjective.id,
        name: selectedObjective.name,
        description: selectedObjective.description,
        purpose: selectedObjective.purpose,
        issue: selectedObjective.issue,
        object: selectedObjective.object,
        viewpoint: selectedObjective.viewpoint,
        context: selectedObjective.context,
      };
      setSelection({
        objective: objectiveSelection,
        question: null,
        metric: null,
      });
    }
  };

  const handleQuestionSelect = (value: string | null) => {
    if (!value || !selection.objective) {
      setSelection({ ...selection, question: null, metric: null });
      return;
    }

    const questionIndex = parseInt(value.split('-q')[1]);
    const questionCategory = commonQuestions.find((q) => q.category === selection.objective?.id);
    
    if (questionCategory && questionCategory.questions[questionIndex]) {
      const questionSelection: QuestionSelection = {
        id: value,
        objectiveId: selection.objective.id,
        question: questionCategory.questions[questionIndex],
        category: selection.objective.id,
      };
      setSelection({
        ...selection,
        question: questionSelection,
        metric: null,
      });
    }
  };

  const handleMetricSelect = (value: string | null) => {
    if (!value || !selection.question) {
      setSelection({ ...selection, metric: null });
      return;
    }

    const metricIndex = parseInt(value.split('-')[1]);
    const selectedMetric = metricTemplates[metricIndex];
    
    if (selectedMetric) {
      const metricSelection: MetricSelection = {
        id: value,
        questionId: selection.question.id,
        name: selectedMetric.name,
        unit: selectedMetric.unit,
        description: selectedMetric.description,
        type: "objective",
        scale: "ratio",
        measurementMethod: "Automated",
      };
      setSelection({
        ...selection,
        metric: metricSelection,
      });
    }
  };

  const handleCreateNewObjective = () => {
    const objectiveSelection: ObjectiveSelection = {
      id: `custom-${Date.now()}`,
      name: newObjective.name,
      description: newObjective.description,
      purpose: newObjective.purpose,
      issue: newObjective.issue,
      object: newObjective.object,
      viewpoint: newObjective.viewpoint,
      context: newObjective.context,
    };
    
    setSelection({
      objective: objectiveSelection,
      question: null,
      metric: null,
    });
    
    setShowCreateObjective(false);
    setNewObjective({
      name: "",
      description: "",
      purpose: "",
      issue: "",
      object: "",
      viewpoint: "",
      context: "",
    });
  };

  const handleCreateNewQuestion = () => {
    const questionSelection: QuestionSelection = {
      id: `custom-q-${Date.now()}`,
      objectiveId: selection.objective?.id || "",
      question: newQuestion.question,
      category: "custom",
    };
    
    setSelection({
      ...selection,
      question: questionSelection,
      metric: null,
    });
    
    setShowCreateQuestion(false);
    setNewQuestion({ question: "" });
  };

  const handleCreateNewMetric = () => {
    const metricSelection: MetricSelection = {
      id: `custom-m-${Date.now()}`,
      questionId: selection.question?.id || "",
      name: newMetric.name,
      unit: newMetric.unit,
      description: newMetric.description,
      type: "objective",
      scale: "ratio",
      measurementMethod: newMetric.measurementMethod,
    };
    
    setSelection({
      ...selection,
      metric: metricSelection,
    });
    
    setShowCreateMetric(false);
    setNewMetric({
      name: "",
      description: "",
      unit: "",
      measurementMethod: "",
    });
  };

  const isSelectionComplete = selection.objective && selection.question && selection.metric;

  const handleComplete = () => {
    if (isSelectionComplete) {
      onSelectionComplete(selection);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-primary" />
            {t("gqm.selectMeasurementFocus", "Select Measurement Focus")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary mb-6">
            {t("gqm.selectMeasurementFocusDescription", "Choose an organizational objective, then select a specific question to answer, and finally pick the metric to measure it.")}
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default">
                1. {t("gqm.selectObjective", "Select Objective")}
              </label>
              <SearchableDropdown
                items={objectiveItems}
                value={selection.objective?.id || ""}
                placeholder={t("gqm.chooseObjective", "Choose an organizational objective...")}
                searchPlaceholder={t("gqm.searchObjectives", "Search objectives...")}
                emptyMessage={t("gqm.noObjectivesFound", "No objectives found")}
                onChange={handleObjectiveSelect}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setShowCreateObjective(true)}
              >
                + Criar Novo Objetivo
              </Button>
              {selection.objective && (
                <div className="mt-3 p-3 bg-background-secondary rounded-lg">
                  <p className="text-sm text-secondary">{selection.objective.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-default">
                2. {t("gqm.selectQuestion", "Select Question")}
              </label>
              <SearchableDropdown
                items={questionItems}
                value={selection.question?.id || ""}
                placeholder={t("gqm.chooseQuestion", "Choose a question to answer...")}
                searchPlaceholder={t("gqm.searchQuestions", "Search questions...")}
                emptyMessage={t("gqm.noQuestionsFound", "No questions found")}
                disabled={!selection.objective}
                onChange={handleQuestionSelect}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 cursor-pointer"
                disabled={!selection.objective}
                onClick={() => setShowCreateQuestion(true)}
              >
                + Criar Nova Questão
              </Button>
              {selection.question && (
                <div className="mt-3 p-3 bg-background-secondary rounded-lg">
                  <p className="text-sm font-medium text-default mb-1">
                    {t("gqm.selectedQuestion", "Selected Question")}:
                  </p>
                  <p className="text-sm text-secondary">{selection.question.question}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-default">
                3. {t("gqm.selectMetric", "Select Metric")}
              </label>
              <SearchableDropdown
                items={metricItems}
                value={selection.metric?.id || ""}
                placeholder={t("gqm.chooseMetric", "Choose a metric to measure...")}
                searchPlaceholder={t("gqm.searchMetrics", "Search metrics...")}
                emptyMessage={t("gqm.noMetricsFound", "No metrics found")}
                disabled={!selection.question}
                onChange={handleMetricSelect}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                disabled={!selection.question}
                onClick={() => setShowCreateMetric(true)}
              >
                + Criar Nova Métrica
              </Button>
              {selection.metric && (
                <div className="mt-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-default">{selection.metric.name}</h4>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {selection.metric.unit}
                      </span>
                    </div>
                    <p className="text-sm text-secondary">{selection.metric.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted">
                      <div>
                        <span className="font-medium">{t("gqm.type", "Type")}:</span> {selection.metric.type}
                      </div>
                      <div>
                        <span className="font-medium">{t("gqm.scale", "Scale")}:</span> {selection.metric.scale}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              onClick={onCancel}
              variant="secondary"
              size="md"
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!isSelectionComplete}
              variant="primary"
              size="md"
            >
              {t("gqm.confirmSelection", "Confirm Selection")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSelectionComplete && (
        <Card>
          <CardHeader>
            <CardTitle>{t("gqm.selectionSummary", "Selection Summary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-default">{selection.objective?.name}</p>
                  <p className="text-sm text-secondary">{selection.objective?.description}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-sm text-secondary">{selection.question?.question}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-default">{selection.metric?.name}</p>
                  <p className="text-sm text-secondary">{selection.metric?.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para criar novo objetivo */}
      {showCreateObjective && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Criar Novo Objetivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Nome</label>
                <input
                  type="text"
                  value={newObjective.name}
                  onChange={(e) => setNewObjective({...newObjective, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Nome do objetivo..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Propósito</label>
                <input
                  type="text"
                  value={newObjective.purpose}
                  onChange={(e) => setNewObjective({...newObjective, purpose: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Analisar, Avaliar, Melhorar..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Questão</label>
                <input
                  type="text"
                  value={newObjective.issue}
                  onChange={(e) => setNewObjective({...newObjective, issue: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="produtividade, qualidade, custo..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Objeto</label>
                <input
                  type="text"
                  value={newObjective.object}
                  onChange={(e) => setNewObjective({...newObjective, object: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="produto de software, processo..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Ponto de Vista</label>
                <input
                  type="text"
                  value={newObjective.viewpoint}
                  onChange={(e) => setNewObjective({...newObjective, viewpoint: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="desenvolvedor, gerente, usuário..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Contexto</label>
                <input
                  type="text"
                  value={newObjective.context}
                  onChange={(e) => setNewObjective({...newObjective, context: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="ambiente do projeto..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">Descrição</label>
              <textarea
                value={newObjective.description}
                onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-md"
                rows={3}
                placeholder="Descrição do objetivo..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateNewObjective} variant="primary">
                Criar Objetivo
              </Button>
              <Button onClick={() => setShowCreateObjective(false)} variant="secondary">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para criar nova questão */}
      {showCreateQuestion && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Criar Nova Questão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">Questão</label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({question: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-md"
                rows={3}
                placeholder="Qual é a questão que você quer responder?"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateNewQuestion} variant="primary">
                Criar Questão
              </Button>
              <Button onClick={() => setShowCreateQuestion(false)} variant="secondary">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para criar nova métrica */}
      {showCreateMetric && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Criar Nova Métrica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Nome</label>
                <input
                  type="text"
                  value={newMetric.name}
                  onChange={(e) => setNewMetric({...newMetric, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Nome da métrica..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Unidade</label>
                <input
                  type="text"
                  value={newMetric.unit}
                  onChange={(e) => setNewMetric({...newMetric, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="ms, %, linhas..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">Método de Medição</label>
                <input
                  type="text"
                  value={newMetric.measurementMethod}
                  onChange={(e) => setNewMetric({...newMetric, measurementMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Ferramenta, manual, automático..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">Descrição</label>
              <textarea
                value={newMetric.description}
                onChange={(e) => setNewMetric({...newMetric, description: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-md"
                rows={3}
                placeholder="O que esta métrica mede?"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateNewMetric} variant="primary">
                Criar Métrica
              </Button>
              <Button onClick={() => setShowCreateMetric(false)} variant="secondary">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};