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
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedQuestionsPerObjective, setSelectedQuestionsPerObjective] = useState<Record<string, string[]>>({});
  const [selectedMetricsPerQuestion, setSelectedMetricsPerQuestion] = useState<Record<string, string[]>>({});
  const [showDetailedView, setShowDetailedView] = useState(false);

  const { register, handleSubmit, setValue } = planForm;

  // Lista de objetivos disponíveis
  const availableObjectives = [
    { id: "objetivo1", name: "Melhorar qualidade do software" },
    { id: "objetivo2", name: "Reduzir tempo de desenvolvimento" },
    { id: "objetivo3", name: "Aumentar produtividade da equipe" },
    { id: "objetivo4", name: "Diminuir quantidade de bugs" },
  ];

  // Lista de questões disponíveis
  const availableQuestions = [
    { id: "questao1", name: "Qual é a taxa de defeitos encontrados em produção?" },
    { id: "questao2", name: "Quanto tempo leva para corrigir um bug crítico?" },
    { id: "questao3", name: "Qual é o tempo médio de desenvolvimento de uma feature?" },
    { id: "questao4", name: "Quantas linhas de código são produzidas por dia?" },
    { id: "questao5", name: "Qual é a cobertura de testes automatizados?" },
    { id: "questao6", name: "Quantos bugs são encontrados durante os testes?" },
  ];

  // Lista de métricas disponíveis
  const availableMetrics = [
    { id: "metrica1", name: "Número de defeitos por release", unit: "defeitos" },
    { id: "metrica2", name: "Tempo médio de correção", unit: "horas" },
    { id: "metrica3", name: "Tempo de desenvolvimento por story point", unit: "horas/sp" },
    { id: "metrica4", name: "Linhas de código por desenvolvedor", unit: "loc/dev" },
    { id: "metrica5", name: "Porcentagem de cobertura de código", unit: "%" },
    { id: "metrica6", name: "Número de bugs por sprint", unit: "bugs" },
    { id: "metrica7", name: "Taxa de sucesso de builds", unit: "%" },
    { id: "metrica8", name: "Tempo de resposta da aplicação", unit: "ms" },
  ];

  const handleAddObjective = (objectiveId: string) => {
    if (objectiveId && !selectedObjectives.includes(objectiveId)) {
      setSelectedObjectives(prev => [...prev, objectiveId]);
    }
  };

  const handleRemoveObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => prev.filter(id => id !== objectiveId));
  };

  const getObjectiveName = (id: string) => {
    return availableObjectives.find(obj => obj.id === id)?.name || id;
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
    return availableQuestions.find(q => q.id === id)?.name || id;
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
    return availableMetrics.find(m => m.id === id)?.name || id;
  };

  const getMetricUnit = (id: string) => {
    return availableMetrics.find(m => m.id === id)?.unit || "";
  };
  
  // Set default type to measurement
  setValue("type", "measurement");

  const [goalForm, setGoalForm] = useState({
    purpose: "",
    issue: "",
    object: "",
    viewpoint: "",
    context: "",
  });



  const steps = [
    {
      number: 1,
      name: "Definir Plano de Medição",
      description: "Estabeleça a base para seu plano de medição com informações básicas",
    },
    {
      number: 2,
      name: "Identificar Objetivos Organizacionais",
      description: "Defina objetivos de medição usando a abordagem Goal-Question-Metric",
    },
    {
      number: 3,
      name: "Identificar Questões",
      description: "Crie questões que irão guiar suas atividades de medição",
    },
    {
      number: 4,
      name: "Identificar Métricas",
      description: "Especifique as métricas que irão responder suas questões",
    },
    {
      number: 5,
      name: "Visualizar Plano de Medição",
      description: "Revise e finalize seu plano de medição",
    },
  ];

  const canNavigateToStep = (step: PlanStep): boolean => {
    if (step === 1) return true;
    if (step === 2) return !!stepData.planBasics;
    if (step === 3) return selectedObjectives.length > 0;
    if (step === 4) return Object.values(selectedQuestionsPerObjective).some(questions => questions.length > 0);
    if (step === 5) return Object.values(selectedMetricsPerQuestion).some(metrics => metrics.length > 0);
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




  const handleFinalizePlan = async () => {
    if (stepData.planBasics) {
      await onCreatePlan(stepData.planBasics);
      setShowWorkflow(false);
      setCurrentStep(1);
      setStepData({});
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>1. Definir Plano de Medição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                Estabeleça a base para seu plano de medição com informações básicas e definição GQM
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default">
                    Nome do Plano
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="Digite o nome do plano"
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
                    Responsável
                  </label>
                  <Input
                    {...register("owner")}
                    placeholder="Digite o nome do responsável"
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
                  Descrição
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Breve descrição do plano de medição"
                  disabled={!canCreatePlan}
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
                />
                {formErrors.description && (
                  <p className="text-sm text-red-600">
                    {formErrors.description.message}
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-default">
                      Propósito
                    </label>
                    <select
                      value={goalForm.purpose}
                      onChange={(e) => setGoalForm(prev => ({...prev, purpose: e.target.value}))}
                      disabled={!canCreatePlan}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
                    >
                      <option value="">Selecione o propósito...</option>
                      <option value="Conhecer">Conhecer</option>
                      <option value="Analisar">Analisar</option>
                      <option value="Avaliar">Avaliar</option>
                      <option value="Melhorar">Melhorar</option>
                      <option value="Controlar">Controlar</option>
                      <option value="Monitorar">Monitorar</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-default">
                      Com respeito a
                    </label>
                    <textarea
                      value={goalForm.issue}
                      onChange={(e) => setGoalForm(prev => ({...prev, issue: e.target.value}))}
                      placeholder="produtividade, qualidade, custo, desempenho..."
                      disabled={!canCreatePlan}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-default">
                      Do ponto de vista de
                    </label>
                    <textarea
                      value={goalForm.viewpoint}
                      onChange={(e) => setGoalForm(prev => ({...prev, viewpoint: e.target.value}))}
                      placeholder="desenvolvedor, gerente, usuário, cliente..."
                      disabled={!canCreatePlan}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-default">
                      No contexto de
                    </label>
                    <textarea
                      value={goalForm.context}
                      onChange={(e) => setGoalForm(prev => ({...prev, context: e.target.value}))}
                      placeholder="projeto web, aplicação móvel, sistema corporativo..."
                      disabled={!canCreatePlan}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit(handleBasicsSubmit)}
                disabled={!canCreatePlan}
                variant="primary"
                className="w-full md:w-auto"
              >
                Próximo: Identificar Objetivos Organizacionais
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>2. Identificar Objetivos Organizacionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                Defina objetivos de medição usando a abordagem Goal-Question-Metric
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Selecionar Objetivos</h4>
                  <div className="space-y-2">
                    <div className="relative">
                      <select
                        className="w-full p-2 border border-border rounded-md appearance-none bg-white"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddObjective(e.target.value);
                            e.target.value = ""; // Reset select
                          }
                        }}
                      >
                        <option value="">Escolha um objetivo organizacional...</option>
                        {availableObjectives
                          .filter(obj => !selectedObjectives.includes(obj.id))
                          .map(objective => (
                            <option key={objective.id} value={objective.id}>
                              {objective.name}
                            </option>
                          ))
                        }
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Lista de objetivos selecionados */}
                    {selectedObjectives.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {selectedObjectives.map(objectiveId => (
                            <div key={objectiveId} className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              <span>{getObjectiveName(objectiveId)}</span>
                              <button 
                                className="ml-2 text-primary hover:text-primary/70"
                                onClick={() => handleRemoveObjective(objectiveId)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button className="mt-2 text-primary text-sm hover:underline">
                    + Criar Novo Objetivo
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                {selectedObjectives.length > 0 && (
                  <Button onClick={() => setCurrentStep(3)} variant="primary">
                    Próximo: Identificar Questões
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
              <CardTitle>3. Identificar Questões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-secondary mb-4">
                Para cada objetivo selecionado, escolha as questões que irão guiar suas atividades de medição
              </p>

              {selectedObjectives.map((objectiveId, index) => (
                <div key={objectiveId} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <h4 className="font-medium text-default">
                      {getObjectiveName(objectiveId)}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-default block mb-2">
                        Selecionar Questões
                      </label>
                      <div className="relative">
                        <select
                          className="w-full p-2 border border-border rounded-md appearance-none bg-white"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddQuestionToObjective(objectiveId, e.target.value);
                              e.target.value = ""; // Reset select
                            }
                          }}
                        >
                          <option value="">Escolha uma questão...</option>
                          {availableQuestions
                            .filter(q => !selectedQuestionsPerObjective[objectiveId]?.includes(q.id))
                            .map(question => (
                              <option key={question.id} value={question.id}>
                                {question.name}
                              </option>
                            ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                      <button className="mt-2 text-primary text-sm hover:underline">
                        + Criar Nova Questão
                      </button>
                    </div>

                    {/* Lista de questões selecionadas para este objetivo */}
                    {selectedQuestionsPerObjective[objectiveId]?.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-default">
                          Questões Selecionadas ({selectedQuestionsPerObjective[objectiveId].length})
                        </label>
                        <div className="space-y-2">
                          {selectedQuestionsPerObjective[objectiveId].map((questionId, qIndex) => (
                            <div key={questionId} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-secondary">
                                  {qIndex + 1}.
                                </span>
                                <span className="text-sm">
                                  {getQuestionName(questionId)}
                                </span>
                              </div>
                              <button 
                                className="text-red-500 hover:text-red-700 text-sm"
                                onClick={() => handleRemoveQuestionFromObjective(objectiveId, questionId)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 mt-6">
                {Object.values(selectedQuestionsPerObjective).some(questions => questions.length > 0) && (
                  <Button onClick={() => setCurrentStep(4)} variant="primary">
                    Próximo: Identificar Métricas
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
              <CardTitle>4. Identificar Métricas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-secondary mb-4">
                Para cada questão selecionada, escolha as métricas que irão responder essas questões
              </p>

              {selectedObjectives.map((objectiveId, objIndex) => {
                const objectiveQuestions = selectedQuestionsPerObjective[objectiveId] || [];
                if (objectiveQuestions.length === 0) return null;

                return (
                  <div key={objectiveId} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {objIndex + 1}
                      </span>
                      <h4 className="font-medium text-default">
                        {getObjectiveName(objectiveId)}
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {objectiveQuestions.map((questionId, qIndex) => (
                        <div key={questionId} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                              Q{qIndex + 1}
                            </span>
                            <h5 className="font-medium text-sm">
                              {getQuestionName(questionId)}
                            </h5>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-default block mb-2">
                                Selecionar Métricas
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full p-2 border border-border rounded-md appearance-none bg-white"
                                  value=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAddMetricToQuestion(questionId, e.target.value);
                                      e.target.value = ""; // Reset select
                                    }
                                  }}
                                >
                                  <option value="">Escolha uma métrica...</option>
                                  {availableMetrics
                                    .filter(m => !selectedMetricsPerQuestion[questionId]?.includes(m.id))
                                    .map(metric => (
                                      <option key={metric.id} value={metric.id}>
                                        {metric.name} ({metric.unit})
                                      </option>
                                    ))
                                  }
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                  </svg>
                                </div>
                              </div>
                              <button className="mt-2 text-primary text-sm hover:underline">
                                + Criar Nova Métrica
                              </button>
                            </div>

                            {/* Lista de métricas selecionadas para esta questão */}
                            {selectedMetricsPerQuestion[questionId]?.length > 0 && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-default">
                                  Métricas Selecionadas ({selectedMetricsPerQuestion[questionId].length})
                                </label>
                                <div className="space-y-2">
                                  {selectedMetricsPerQuestion[questionId].map((metricId, mIndex) => (
                                    <div key={metricId} className="flex items-center justify-between bg-white p-3 rounded-md border">
                                      <div className="flex items-center gap-2">
                                        <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                          M{mIndex + 1}
                                        </span>
                                        <div className="text-sm">
                                          <span className="font-medium">{getMetricName(metricId)}</span>
                                          <span className="text-gray-500 ml-1">({getMetricUnit(metricId)})</span>
                                        </div>
                                      </div>
                                      <button 
                                        className="text-red-500 hover:text-red-700 text-sm"
                                        onClick={() => handleRemoveMetricFromQuestion(questionId, metricId)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-2 mt-6">
                {Object.values(selectedMetricsPerQuestion).some(metrics => metrics.length > 0) && (
                  <Button onClick={() => setCurrentStep(5)} variant="primary">
                    Próximo: Visualizar Plano de Medição
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        const totalObjectives = selectedObjectives.length;
        const totalQuestions = Object.values(selectedQuestionsPerObjective).reduce((sum, questions) => sum + questions.length, 0);
        const totalMetrics = Object.values(selectedMetricsPerQuestion).reduce((sum, metrics) => sum + metrics.length, 0);
        
        return (
          <Card>
            <CardHeader>
              <CardTitle>5. Visualizar Plano de Medição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary mb-4">
                Revise seu plano de medição completo com objetivos, questões e métricas
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-4">Resumo do Plano</h4>
                <div className="space-y-2 text-sm mb-4">
                  <div>
                    <strong>Nome:</strong> {stepData.planBasics?.name}
                  </div>
                  <div>
                    <strong>Responsável:</strong> {stepData.planBasics?.owner}
                  </div>
                  <div>
                    <strong>Descrição:</strong> {stepData.planBasics?.description}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-primary">Estrutura GQM</h4>
                  
                  {selectedObjectives.map((objectiveId, objIndex) => {
                    const objectiveQuestions = selectedQuestionsPerObjective[objectiveId] || [];
                    
                    return (
                      <div key={objectiveId} className="border border-border rounded-lg p-4">
                        <div className="font-medium text-default mb-2">
                          <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">
                            G{objIndex + 1}
                          </span>
                          <strong>Objetivo:</strong> {getObjectiveName(objectiveId)}
                        </div>
                        
                        {objectiveQuestions.length > 0 && (
                          <div className="ml-4 space-y-3">
                            {objectiveQuestions.map((questionId, qIndex) => {
                              const questionMetrics = selectedMetricsPerQuestion[questionId] || [];
                              
                              return (
                                <div key={questionId}>
                                  <div className="font-medium text-secondary mb-1">
                                    <span className="bg-secondary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">
                                      Q{qIndex + 1}
                                    </span>
                                    <strong>Questão:</strong> {getQuestionName(questionId)}
                                  </div>
                                  
                                  {questionMetrics.length > 0 && (
                                    <div className="ml-8 space-y-1">
                                      {questionMetrics.map((metricId, mIndex) => (
                                        <div key={metricId} className="text-sm">
                                          <span className="bg-green-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
                                            M{mIndex + 1}
                                          </span>
                                          <strong>Métrica:</strong> <span className="font-medium">{getMetricName(metricId)}</span> ({getMetricUnit(metricId)})
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{totalObjectives}</div>
                    <div className="text-sm text-secondary">Objetivos</div>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{totalQuestions}</div>
                    <div className="text-sm text-secondary">Questões</div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{totalMetrics}</div>
                    <div className="text-sm text-secondary">Métricas</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    onClick={() => setShowDetailedView(!showDetailedView)}
                    variant="ghost"
                    className="text-primary hover:text-primary/80"
                  >
                    {showDetailedView ? "Ocultar detalhes" : "Visualizar em mais detalhes"}
                  </Button>
                  <Button
                    onClick={() => {
                      // Implementação futura do export PDF
                      alert("Funcionalidade de exportar PDF será implementada em breve!");
                    }}
                    variant="secondary"
                    className="border border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    📄 Exportar PDF
                  </Button>
                </div>

                {showDetailedView && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-primary mb-4">Estrutura Detalhada GQM</h4>
                    
                    {selectedObjectives.map((objectiveId, objIndex) => {
                      const objectiveQuestions = selectedQuestionsPerObjective[objectiveId] || [];
                      
                      return (
                        <div key={objectiveId} className="mb-6 border border-border rounded-lg p-4">
                          {/* Objetivo */}
                          <div className="flex items-start gap-3 mb-4">
                            <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mt-1">
                              G{objIndex + 1}
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold text-lg text-default mb-2">
                                Objetivo {objIndex + 1}
                              </div>
                              <div className="text-default bg-primary/5 p-3 rounded-md">
                                {getObjectiveName(objectiveId)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Questões */}
                          {objectiveQuestions.length > 0 && (
                            <div className="ml-6 space-y-4">
                              {objectiveQuestions.map((questionId, qIndex) => {
                                const questionMetrics = selectedMetricsPerQuestion[questionId] || [];
                                
                                return (
                                  <div key={questionId}>
                                    <div className="flex items-start gap-3 mb-3">
                                      <span className="bg-secondary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-medium mt-1">
                                        Q{qIndex + 1}
                                      </span>
                                      <div className="flex-1">
                                        <div className="font-medium text-secondary mb-2">
                                          Questão {qIndex + 1}
                                        </div>
                                        <div className="text-default bg-secondary/5 p-3 rounded-md">
                                          {getQuestionName(questionId)}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Métricas */}
                                    {questionMetrics.length > 0 && (
                                      <div className="ml-6 space-y-3">
                                        {questionMetrics.map((metricId, mIndex) => (
                                          <div key={metricId} className="flex items-start gap-3">
                                            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-1">
                                              M{mIndex + 1}
                                            </span>
                                            <div className="flex-1">
                                              <div className="font-medium text-green-700 mb-2">
                                                Métrica {mIndex + 1}
                                              </div>
                                              <div className="text-default bg-green-50 p-3 rounded-md">
                                                <div className="font-medium mb-3">{getMetricName(metricId)}</div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                  Unidade: {getMetricUnit(metricId)}
                                                </div>
                                                
                                                {/* Campos detalhados da métrica */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                                                  <div className="space-y-2">
                                                    <div><strong>Definição:</strong> _____________________</div>
                                                    <div><strong>Mnemônico:</strong> _____________________</div>
                                                    <div><strong>Tipo de medida:</strong> _____________________</div>
                                                    <div><strong>Entidade medida:</strong> _____________________</div>
                                                    <div><strong>Propriedade medida:</strong> _____________________</div>
                                                    <div><strong>Unidade de medida:</strong> _____________________</div>
                                                    <div><strong>Tipo de escala:</strong> _____________________</div>
                                                    <div><strong>Valores da escala:</strong> _____________________</div>
                                                    <div><strong>Intervalo esperado dos dados:</strong> _____________________</div>
                                                  </div>
                                                  <div className="space-y-2">
                                                    <div><strong>Fórmula de cálculo de medida:</strong> _____________________</div>
                                                    <div><strong>Procedimento de medição:</strong> _____________________</div>
                                                    <div><strong>Momento da medição:</strong> _____________________</div>
                                                    <div><strong>Periodicidade da medição:</strong> _____________________</div>
                                                    <div><strong>Responsável pela medição:</strong> _____________________</div>
                                                    <div><strong>Procedimento de análise:</strong> _____________________</div>
                                                    <div><strong>Momento da análise:</strong> _____________________</div>
                                                    <div><strong>Periodicidade da análise:</strong> _____________________</div>
                                                    <div><strong>Responsável pela análise:</strong> _____________________</div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Button
                onClick={handleFinalizePlan}
                disabled={isCreatingPlan}
                className="w-full"
                variant="primary"
              >
                {isCreatingPlan ? "Criando..." : "Finalizar Plano de Medição"}
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
