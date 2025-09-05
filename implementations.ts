//src/app/(app)/plans
"use client";

import { PlansView } from "@/presentation/views/Plans";

const PlansPage = () => {
  return <PlansView />;
};

export default PlansPage;

// src/core/i18n/locales/pt/plans.json
{
  "title": "Planos de Medição",
  "subtitle": "Crie e gerencie planos de medição para seus projetos",
  "createNewPlan": "Criar Novo Plano",
  "planName": "Nome do Plano",
  "planDescription": "Descrição",
  "description": "Descrição",
  "type": "Tipo",
  "owner": "Responsável",
  "enterPlanName": "Digite o nome do plano",
  "enterOwnerName": "Digite o nome do responsável",
  "enterDescription": "Digite a descrição",
  "descriptionPlaceholder": "Breve descrição do plano de medição",
  "enterPlanType": "Digite o tipo do plano",
  "enterPlanOwner": "Digite o responsável pelo plano",
  "createPlan": "Criar Plano",
  "creating": "Criando...",
  "yourPlans": "Seus Planos",
  "noPlansYet": "Nenhum Plano Ainda",
  "noPlansDescription": "Crie seu primeiro plano de medição para organizar e acompanhar suas atividades de medição de software",
  "progress": "Progresso",
  "dates": "Datas",
  "goals": "objetivos",
  "metrics": "métricas",
  "edit": "Editar",
  "duplicate": "Duplicar",
  "delete": "Excluir",
  "manageGQM": "Gerenciar GQM",
  "templates": "Modelos de Plano",
  "planTemplates": "Modelos de Plano",
  "duration": "Duração",
  "days": "dias",
  "useTemplate": "Usar Modelo",
  "statistics": "Estatísticas",
  "totalPlans": "Total de Planos",
  "activePlans": "Planos Ativos",
  "completedPlans": "Planos Concluídos",
  "averageProgress": "Progresso Médio",
  "totalGoals": "Total de Objetivos",
  "totalMetrics": "Total de Métricas",
  "qualityAssurance": "Plano de Garantia de Qualidade",
  "qualityDescription": "Foco em métricas de qualidade e rastreamento de defeitos",
  "productivityAnalysis": "Plano de Análise de Produtividade",
  "productivityDescription": "Medir produtividade e eficiência da equipe",
  "projectPerformance": "Plano de Performance do Projeto",
  "performanceDescription": "Acompanhar entrega do projeto e métricas de cronograma",
  "organizationRequired": "Organização Necessária",
  "organizationRequiredDescription": "Você precisa criar ou ingressar em uma organização para criar planos de medição e gerenciar atividades de planejamento",
  "createOrganization": "Criar Organização",
  "tabs": {
    "overview": "Visão Geral",
    "plans": "Planos",
    "templates": "Modelos",
    "gqm": "GQM"
  },
  "types": {
    "measurement": "Medição",
    "quality": "Qualidade",
    "performance": "Performance",
    "estimation": "Estimativa"
  },
  "status": {
    "active": "ativo",
    "completed": "concluído",
    "draft": "rascunho",
    "scheduled": "agendado"
  },
  "gqm": {
    "notStarted": "Não Iniciado",
    "noPlansForGQM": "Nenhum Plano para GQM",
    "createPlanFirst": "Crie um plano primeiro para começar a definir objetivos, questões e métricas",
    "selectPlan": "Selecionar Plano",
    "choosePlan": "Escolha um plano",
    "workflow": "Fluxo GQM",
    "currentPhase": "Fase Atual",
    "nextPhase": "Próxima Fase",
    "goals": "Objetivos",
    "questions": "Questões",
    "metrics": "Métricas",
    "goalsDefinedForPlan": "Objetivos definidos para este plano",
    "questionsDefinedForGoals": "Questões definidas para objetivos",
    "metricsDefinedForQuestions": "Métricas definidas para questões",
    "manageGoals": "Gerenciar Objetivos",
    "manageQuestions": "Gerenciar Questões",
    "manageMetrics": "Gerenciar Métricas",
    "phases": {
      "planning": "Planejamento",
      "definition": "Definição",
      "data_collection": "Coleta de Dados",
      "interpretation": "Interpretação",
      "completed": "Concluído"
    },
    "phaseDescriptions": {
      "planning": "Definir objetivos de negócio e software alinhados com objetivos estratégicos",
      "definition": "Aplicar estrutura GQM para derivar questões-chave e definir métricas",
      "data_collection": "Estabelecer procedimentos de coleta de dados e reunir medições",
      "interpretation": "Analisar dados e interpretar descobertas no contexto dos objetivos originais",
      "completed": "Revisar resultados, tomar ações e iterar no plano de medição"
    },
    "selectMeasurementFocus": "Selecionar Foco de Medição",
    "selectMeasurementFocusDescription": "Escolha um objetivo organizacional, então selecione uma pergunta específica para responder, e finalmente escolha a métrica para medi-la.",
    "selectObjective": "Selecionar Objetivo",
    "selectQuestion": "Selecionar Questão",
    "selectMetric": "Selecionar Métrica",
    "chooseObjective": "Escolha um objetivo organizacional...",
    "chooseQuestion": "Escolha uma questão para responder...",
    "chooseMetric": "Escolha uma métrica para medir...",
    "searchObjectives": "Buscar objetivos...",
    "searchQuestions": "Buscar questões...",
    "searchMetrics": "Buscar métricas...",
    "noObjectivesFound": "Nenhum objetivo encontrado",
    "noQuestionsFound": "Nenhuma questão encontrada",
    "noMetricsFound": "Nenhuma métrica encontrada",
    "selectedQuestion": "Questão Selecionada",
    "confirmSelection": "Confirmar Seleção",
    "selectionSummary": "Resumo da Seleção",
    "currentSelection": "Seleção Atual",
    "changeSelection": "Alterar Seleção",
    "startSelection": "Iniciar Processo de Seleção",
    "selectFocusDescription": "Comece selecionando um objetivo organizacional, a pergunta que você quer responder, e a métrica para medi-la.",
    "objective": "Objetivo",
    "question": "Questão",
    "metric": "Métrica",
    "type": "Tipo",
    "scale": "Escala",
    "steps": {
      "selectFocus": "Selecionar Foco",
      "defineGoals": "Definir Objetivos de Negócio e Software",
      "applyGQM": "Aplicar Estrutura GQM",
      "deriveQuestions": "Derivar Questões-Chave",
      "defineMetrics": "Definir Métricas",
      "establishCollection": "Estabelecer Coleta de Dados",
      "analyzeData": "Analisar e Interpretar Dados",
      "takeAction": "Tomar Ações e Relatar",
      "reviewIterate": "Revisar e Iterar"
    },
    "stepDescriptions": {
      "selectFocus": "Escolha objetivo, questão e métrica",
      "defineGoals": "Identificar o que você quer alcançar com medição e alinhar objetivos com metas estratégicas",
      "applyGQM": "Usar o template GQM para estruturar seus objetivos com propósito, foco de qualidade, ponto de vista e contexto",
      "deriveQuestions": "Traduzir cada objetivo em questões-chave que exploram a intenção do objetivo e guiam medições",
      "defineMetrics": "Definir o que medir para responder cada questão, incluindo métricas quantitativas e qualitativas",
      "establishCollection": "Determinar ferramentas, frequência e responsabilidade pelos procedimentos de coleta de dados",
      "analyzeData": "Usar métricas coletadas para responder questões definidas e interpretar descobertas",
      "takeAction": "Apresentar resultados, comparar com linhas de base e recomendar ações baseadas na análise",
      "reviewIterate": "Refinar objetivos, questões ou métricas conforme necessário e adicionar novos objetivos conforme projetos evoluem"
    }
  },
  "errors": {
    "createFailed": "Falha ao criar plano",
    "updateFailed": "Falha ao atualizar plano",
    "deleteFailed": "Falha ao excluir plano",
    "duplicateFailed": "Falha ao duplicar plano"
  },
  "workflow": {
    "title": "Fluxo de Trabalho do Plano de Medição",
    "subtitle": "Crie seu plano de medição seguindo estes passos guiados",
    "step1Title": "1. Definir Básicos do Plano",
    "step1Description": "Estabeleça a base para seu plano de medição com informações básicas",
    "step2Title": "2. Aplicar Estrutura GQM",
    "step2Description": "Defina objetivos de medição usando a abordagem Goal-Question-Metric",
    "step3Title": "3. Derivar Questões-Chave",
    "step3Description": "Crie questões que irão guiar suas atividades de medição",
    "step4Title": "4. Definir Métricas",
    "step4Description": "Especifique as métricas que irão responder suas questões",
    "step5Title": "5. Configurar Coleta de Dados",
    "step5Description": "Revise e finalize seu plano de medição",
    "nextStep": "Próximo Passo",
    "backToOverview": "Voltar ao Resumo",
    "startWorkflow": "Iniciar Criação do Plano",
    "finalizePlan": "Criar Plano"
  }
}

// src/core/utils/navigation.ts
import { UserRole } from "@/core/types";
import {
  HomeIcon,
  ChartIcon,
  DocumentIcon,
  BuildingIcon,
  UserIcon,
} from "@/presentation/assets/icons";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: UserRole[];
  badge?: number;
  disabled?: boolean;
}

export const getNavigationItems = (
  t: (key: string) => string
): NavigationItem[] => [
  {
    name: t("nav.overview"),
    href: "/overview",
    icon: HomeIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
  {
    name: t("nav.organization"),
    href: "/organization",
    icon: BuildingIcon,
    requiredRoles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t("nav.projects"),
    href: "/projects",
    icon: DocumentIcon,
    requiredRoles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t("nav.fpa"),
    href: "/fpa",
    icon: ChartIcon,
    requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t("nav.plans"),
    href: "/plans",
    icon: DocumentIcon,
    requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t("nav.account"),
    href: "/account",
    icon: UserIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
];

export const getFilteredNavigation = (
  userRole?: UserRole,
  t?: (key: string) => string
): NavigationItem[] => {
  if (!t) {
    return [
      {
        name: "Overview",
        href: "/overview",
        icon: HomeIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
      {
        name: "Organization",
        href: "/organization",
        icon: BuildingIcon,
        requiredRoles: [UserRole.MANAGER, UserRole.ADMIN],
      },
      {
        name: "Projects",
        href: "/projects",
        icon: DocumentIcon,
        requiredRoles: [UserRole.MANAGER, UserRole.ADMIN],
      },
      {
        name: "FPA",
        href: "/fpa",
        icon: ChartIcon,
        requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
      },
      {
        name: "Plans",
        href: "/plans",
        icon: DocumentIcon,
        requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
      },
      {
        name: "Account",
        href: "/account",
        icon: UserIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
    ];
  }

  const navigationItems = getNavigationItems(t);

  if (!userRole) return navigationItems;

  return navigationItems.filter(
    (item) => !item.requiredRoles || item.requiredRoles.includes(userRole)
  );
};

export const getNavigationByHref = (
  href: string,
  t?: (key: string) => string
): NavigationItem | undefined => {
  if (!t) return undefined;
  return getNavigationItems(t).find((item) => item.href === href);
};

export const isActiveNavigation = (pathname: string, href: string): boolean => {
  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const normalizedHref = href.replace(/\/$/, "") || "/";

  if (normalizedHref === "/overview") {
    return normalizedPathname === "/overview";
  }

  return normalizedPathname.startsWith(normalizedHref);
};

// src/presentation/components/primitives/index.ts
export { Button } from './Button/Button';
export { Card, CardHeader, CardContent, CardTitle } from './Card/Card';
export { Input } from './Input/Input';
export { Dropdown } from './Dropdown/Dropdown';
export type { DropdownItem, DropdownProps } from './Dropdown/Dropdown';
export { SearchableDropdown } from './SearchableDropdown/SearchableDropdown';
export type { SearchableDropdownItem, SearchableDropdownProps } from './SearchableDropdown/SearchableDropdown'; 

// src/presentation/components/primitives/SearchableDropdown (index.ts file)
export { SearchableDropdown, type SearchableDropdownItem, type SearchableDropdownProps } from "./SearchableDropdown";

//// src/presentation/components/primitives/SearchableDropdown/SearchableDropdown.tsx
"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/core/utils";
import { SearchIcon, ChevronDownIcon, XIcon } from "@/presentation/assets/icons";

export interface SearchableDropdownItem {
  id: string;
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SearchableDropdownProps {
  items: SearchableDropdownItem[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  dropdownClassName?: string;
  onChange: (value: string | null) => void;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  items,
  value,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  disabled = false,
  loading = false,
  className,
  dropdownClassName,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  const filteredItems = items.filter((item) =>
    item.label
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSelect = (item: SearchableDropdownItem) => {
    if (item.disabled) return;
    onChange(item.value);
    closeDropdown();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <div
      className={cn("relative w-full", className)}
      ref={dropdownRef}
    >
      <div
        onClick={toggleDropdown}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 border rounded-md cursor-pointer transition-colors",
          "bg-background text-default border-border",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          loading && "cursor-wait",
          isOpen && "border-primary ring-2 ring-primary/20"
        )}
      >
        <span className={cn(
          "text-sm",
          !selectedItem && "text-muted"
        )}>
          {loading ? "Loading..." : selectedItem?.label || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedItem && !disabled && !loading && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-background-secondary rounded"
            >
              <XIcon className="w-3 h-3 text-muted" />
            </button>
          )}
          <ChevronDownIcon className={cn(
            "w-4 h-4 text-muted transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </div>
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg",
            "max-h-60 overflow-hidden",
            dropdownClassName
          )}
        >
          <div className="p-2 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-background text-default placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer transition-colors",
                    "hover:bg-background-secondary",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    item.value === value && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {item.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// src/presentation/views/PLans (index.ts file)
export { PlansView } from "./Plans";

// src/presentation/views/Plans

"use client";

import { useState } from "react";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { usePlans } from "@/core/hooks/plans/usePlans";
import {
  PlanTab,
  Plan,
  PlanType,
  GQMGoal,
  GQMQuestion,
  GQMMetric,
} from "@/core/types/plans";
import { PlansTabs, PlansPageHeader, OrganizationAlert } from "./components";
import { OverviewTab, PlansTab, TemplatesTab, GQMTab } from "./components/Tabs";

export const PlansView = () => {
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();
  const plansHook = usePlans();
  const [activeTab, setActiveTab] = useState<PlanTab>("overview");
  const [selectedPlanForGQM, setSelectedPlanForGQM] = useState<string>("");

  const {
    plans,
    templates,
    statistics,
    isLoadingPlans,
    isCreatingPlan,
    plansError,
    canCreatePlan,
    hasOrganization,
    planForm,
    formErrors,
    createPlan,
    deletePlan,
    duplicatePlan,
    applyTemplate,
    getGQMDataForPlan,
    formatDate,
    getStatusColor,
    getTypeLabel,
  } = plansHook;

  const handleCreateGoal = async (goalData: Partial<GQMGoal>) => {
    console.log("Create goal:", goalData);
  };

  const handleCreateQuestion = async (questionData: Partial<GQMQuestion>) => {
    console.log("Create question:", questionData);
  };

  const handleCreateMetric = async (metricData: Partial<GQMMetric>) => {
    console.log("Create metric:", metricData);
  };

  const handleCompleteStep = async (step: number) => {
    console.log("Complete step:", step);
  };

  const handleSelectionComplete = async (selection: import("@/core/types/plans").GQMSelectionState) => {
    console.log("Selection complete:", selection);
  };

  const componentMap = {
    overview: (
      <OverviewTab
        statistics={statistics}
        canCreatePlan={canCreatePlan}
        isCreatingPlan={isCreatingPlan}
        planForm={planForm}
        formErrors={formErrors}
        onCreatePlan={createPlan}
      />
    ),
    plans: (
      <PlansTab
        plans={plans}
        isLoadingPlans={isLoadingPlans}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        getTypeLabel={(type: string) => getTypeLabel(type as PlanType)}
        onEditPlan={(plan: Plan) => console.log("Edit plan:", plan)}
        onDeletePlan={deletePlan}
        onDuplicatePlan={duplicatePlan}
        onManageGQM={(plan: Plan) => {
          setSelectedPlanForGQM(plan.id);
          setActiveTab("gqm");
        }}
      />
    ),
    templates: (
      <TemplatesTab
        templates={templates}
        canCreatePlan={canCreatePlan}
        onApplyTemplate={applyTemplate}
      />
    ),
    gqm: (
      <GQMTab
        plans={plans}
        selectedPlanId={selectedPlanForGQM}
        gqmData={getGQMDataForPlan(selectedPlanForGQM)}
        onSelectPlan={setSelectedPlanForGQM}
        onCreateGoal={handleCreateGoal}
        onCreateQuestion={handleCreateQuestion}
        onCreateMetric={handleCreateMetric}
        onCompleteStep={handleCompleteStep}
        onSelectionComplete={handleSelectionComplete}
      />
    ),
  };

  if (isLoadingUserOrganization) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="space-y-6">
        <PlansPageHeader
          organizationName={userOrganization?.name}
          hasOrganization={hasOrganization}
          isLoadingOrganization={isLoadingUserOrganization}
        />
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-default mb-2">
            Error loading plans
          </h3>
          <p className="text-secondary">{plansError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlansPageHeader
        organizationName={userOrganization?.name}
        hasOrganization={hasOrganization}
        isLoadingOrganization={isLoadingUserOrganization}
      />

      <OrganizationAlert hasOrganization={hasOrganization} />

      <PlansTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasOrganization={hasOrganization}
      />

      {componentMap[activeTab]}
    </div>
  );
};


// src/presentation/views/Plans/components
export { PlansTabs } from "./PlansTabs";
export { PlansPageHeader } from "./PlansPageHeader";
export { OrganizationAlert } from "./OrganizationAlert";
export { ObjectiveQuestionMetricSelector } from "./ObjectiveQuestionMetricSelector";


// src/presentation/views/Plans/components
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
                className="mt-2"
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

//src/presentation/views/Plans/components/Tabs

import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { TargetIcon } from "@/presentation/assets/icons";
import {
  Plan,
  GQMData,
  GQMGoal,
  GQMQuestion,
  GQMMetric,
  GQMSelectionState,
} from "@/core/types/plans";
import { ObjectiveQuestionMetricSelector } from "../ObjectiveQuestionMetricSelector";

interface GQMTabProps {
  plans: Plan[] | undefined;
  selectedPlanId?: string;
  gqmData: GQMData;
  onSelectPlan: (planId: string) => void;
  onCreateGoal: (goalData: Partial<GQMGoal>) => Promise<void>;
  onCreateQuestion: (questionData: Partial<GQMQuestion>) => Promise<void>;
  onCreateMetric: (metricData: Partial<GQMMetric>) => Promise<void>;
  onCompleteStep: (step: number) => Promise<void>;
  onSelectionComplete?: (selection: GQMSelectionState) => Promise<void>;
}

export const GQMTab: React.FC<GQMTabProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  onSelectionComplete,
}) => {
  const { t } = useTranslation("plans");

  const handleSelectionComplete = async (selection: GQMSelectionState) => {
    if (onSelectionComplete) {
      await onSelectionComplete(selection);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-primary" />
            Goal-Question-Metric (GQM)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary mb-4">
            {t("gqm.noPlansForGQM")}
          </p>
          <select
            value={selectedPlanId || ""}
            onChange={(e) => onSelectPlan(e.target.value)}
            className="w-full p-2 border border-border rounded-md"
          >
            <option value="">{t("gqm.choosePlan")}</option>
            {plans?.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedPlanId && (
        <ObjectiveQuestionMetricSelector
          onSelectionComplete={handleSelectionComplete}
          onCancel={() => {}}
        />
      )}
    </div>
  );
};


// src/presentation/views/Plans/components/Tabs
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

