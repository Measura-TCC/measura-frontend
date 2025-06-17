type TranslationFunction = (key: string) => string;

export const getGqmTemplates = (t: TranslationFunction) => [
  {
    id: "productivity",
    name: t("gqmTemplates.productivity.name"),
    description: t("gqmTemplates.productivity.description"),
    purpose: t("gqmTemplates.productivity.purpose"),
    issue: t("gqmTemplates.productivity.issue"),
    object: t("gqmTemplates.productivity.object"),
    viewpoint: t("gqmTemplates.productivity.viewpoint"),
    context: t("gqmTemplates.productivity.context"),
  },
  {
    id: "quality",
    name: t("gqmTemplates.quality.name"),
    description: t("gqmTemplates.quality.description"),
    purpose: t("gqmTemplates.quality.purpose"),
    issue: t("gqmTemplates.quality.issue"),
    object: t("gqmTemplates.quality.object"),
    viewpoint: t("gqmTemplates.quality.viewpoint"),
    context: t("gqmTemplates.quality.context"),
  },
  {
    id: "delivery",
    name: t("gqmTemplates.delivery.name"),
    description: t("gqmTemplates.delivery.description"),
    purpose: t("gqmTemplates.delivery.purpose"),
    issue: t("gqmTemplates.delivery.issue"),
    object: t("gqmTemplates.delivery.object"),
    viewpoint: t("gqmTemplates.delivery.viewpoint"),
    context: t("gqmTemplates.delivery.context"),
  },
  {
    id: "maintenance",
    name: t("gqmTemplates.maintenance.name"),
    description: t("gqmTemplates.maintenance.description"),
    purpose: t("gqmTemplates.maintenance.purpose"),
    issue: t("gqmTemplates.maintenance.issue"),
    object: t("gqmTemplates.maintenance.object"),
    viewpoint: t("gqmTemplates.maintenance.viewpoint"),
    context: t("gqmTemplates.maintenance.context"),
  },
];

export const getCommonQuestions = (t: TranslationFunction) => [
  {
    category: "productivity",
    questions: [
      t("commonQuestions.productivity.0"),
      t("commonQuestions.productivity.1"),
      t("commonQuestions.productivity.2"),
      t("commonQuestions.productivity.3"),
    ],
  },
  {
    category: "quality",
    questions: [
      t("commonQuestions.quality.0"),
      t("commonQuestions.quality.1"),
      t("commonQuestions.quality.2"),
      t("commonQuestions.quality.3"),
    ],
  },
  {
    category: "delivery",
    questions: [
      t("commonQuestions.delivery.0"),
      t("commonQuestions.delivery.1"),
      t("commonQuestions.delivery.2"),
      t("commonQuestions.delivery.3"),
    ],
  },
];

export const getMetricTemplates = (t: TranslationFunction) => [
  {
    name: t("metricTemplates.0.name"),
    unit: t("metricTemplates.0.unit"),
    description: t("metricTemplates.0.description"),
  },
  {
    name: t("metricTemplates.1.name"),
    unit: t("metricTemplates.1.unit"),
    description: t("metricTemplates.1.description"),
  },
  {
    name: t("metricTemplates.2.name"),
    unit: t("metricTemplates.2.unit"),
    description: t("metricTemplates.2.description"),
  },
  {
    name: t("metricTemplates.3.name"),
    unit: t("metricTemplates.3.unit"),
    description: t("metricTemplates.3.description"),
  },
  {
    name: t("metricTemplates.4.name"),
    unit: t("metricTemplates.4.unit"),
    description: t("metricTemplates.4.description"),
  },
  {
    name: t("metricTemplates.5.name"),
    unit: t("metricTemplates.5.unit"),
    description: t("metricTemplates.5.description"),
  },
];

export const gqmTemplates = [
  {
    id: "productivity",
    name: "Productivity Measurement",
    description: "Measure and improve development team productivity",
    purpose: "Analyze",
    issue: "productivity",
    object: "development process",
    viewpoint: "project manager",
    context: "software development project",
  },
  {
    id: "quality",
    name: "Quality Assessment",
    description: "Monitor and improve software quality",
    purpose: "Evaluate",
    issue: "quality",
    object: "software product",
    viewpoint: "quality assurance",
    context: "software development lifecycle",
  },
  {
    id: "delivery",
    name: "Delivery Performance",
    description: "Track delivery timelines and performance",
    purpose: "Monitor",
    issue: "delivery performance",
    object: "project timeline",
    viewpoint: "stakeholder",
    context: "project management",
  },
  {
    id: "maintenance",
    name: "Maintenance Efficiency",
    description: "Measure maintenance effort and efficiency",
    purpose: "Improve",
    issue: "maintenance cost",
    object: "software system",
    viewpoint: "development team",
    context: "maintenance phase",
  },
];

export const commonQuestions = [
  {
    category: "productivity",
    questions: [
      "How many function points are delivered per developer per month?",
      "What is the average time to complete a user story?",
      "How many defects are introduced per function point?",
      "What is the code review efficiency?",
    ],
  },
  {
    category: "quality",
    questions: [
      "What is the defect density in the delivered software?",
      "How many defects are found in testing vs production?",
      "What is the code coverage percentage?",
      "How long does it take to fix a defect?",
    ],
  },
  {
    category: "delivery",
    questions: [
      "What percentage of deliveries are on time?",
      "How accurate are effort estimates?",
      "What is the velocity trend over sprints?",
      "How many scope changes occur during development?",
    ],
  },
];

export const metricTemplates = [
  {
    name: "Function Points per Developer",
    unit: "FP/person/month",
    description:
      "Productivity metric measuring function points delivered per developer per month",
  },
  {
    name: "Defect Density",
    unit: "defects/KLOC",
    description: "Quality metric measuring defects per thousand lines of code",
  },
  {
    name: "Code Coverage",
    unit: "%",
    description: "Quality metric measuring percentage of code covered by tests",
  },
  {
    name: "Story Cycle Time",
    unit: "days",
    description:
      "Delivery metric measuring time from story start to completion",
  },
  {
    name: "Velocity",
    unit: "story points/sprint",
    description: "Delivery metric measuring story points completed per sprint",
  },
  {
    name: "Defect Resolution Time",
    unit: "hours",
    description: "Quality metric measuring average time to resolve defects",
  },
];

export const getTemplateByCategory = (category: string) => {
  return gqmTemplates.filter((template) =>
    template.name.toLowerCase().includes(category.toLowerCase())
  );
};

export const getQuestionsByCategory = (category: string) => {
  const categoryData = commonQuestions.find((q) => q.category === category);
  return categoryData?.questions || [];
};

export const getMetricsByKeyword = (keyword: string) => {
  return metricTemplates.filter(
    (metric) =>
      metric.name.toLowerCase().includes(keyword.toLowerCase()) ||
      metric.description.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const generateGoalStatement = (
  purpose: string,
  issue: string,
  object: string,
  viewpoint: string,
  context: string
) => {
  return `${purpose} the ${issue} of the ${object} from the ${viewpoint} point of view in the ${context} context.`;
};

export const gqmPurposes = [
  { value: "characterize", label: "Caracterizar" },
  { value: "evaluate", label: "Avaliar" },
  { value: "predict", label: "Prever" },
  { value: "motivate", label: "Motivar" },
] as const;

export const gqmViewpoints = [
  { value: "developer", label: "Desenvolvedor" },
  { value: "manager", label: "Gerente" },
  { value: "customer", label: "Cliente" },
  { value: "user", label: "Usuário" },
  { value: "maintainer", label: "Mantenedor" },
] as const;

export const gqmContexts = [
  { value: "project", label: "Projeto" },
  { value: "organization", label: "Organização" },
  { value: "process", label: "Processo" },
  { value: "product", label: "Produto" },
  { value: "resource", label: "Recurso" },
] as const;

export const metricTypes = [
  { value: "objective", label: "Objetiva" },
  { value: "subjective", label: "Subjetiva" },
] as const;

export const metricScales = [
  { value: "nominal", label: "Nominal" },
  { value: "ordinal", label: "Ordinal" },
  { value: "interval", label: "Intervalar" },
  { value: "ratio", label: "Razão" },
] as const;

export const commonMetrics = [
  {
    name: "Linhas de Código (LOC)",
    type: "objective",
    scale: "ratio",
    unit: "linhas",
    description: "Número total de linhas de código",
  },
  {
    name: "Complexidade Ciclomática",
    type: "objective",
    scale: "ratio",
    unit: "número",
    description: "Medida de complexidade estrutural do código",
  },
  {
    name: "Cobertura de Testes",
    type: "objective",
    scale: "ratio",
    unit: "percentual",
    description: "Percentual de código coberto por testes",
  },
  {
    name: "Densidade de Defeitos",
    type: "objective",
    scale: "ratio",
    unit: "defeitos/KLOC",
    description: "Número de defeitos por mil linhas de código",
  },
  {
    name: "Tempo de Resposta",
    type: "objective",
    scale: "ratio",
    unit: "segundos",
    description: "Tempo médio de resposta do sistema",
  },
  {
    name: "Satisfação do Usuário",
    type: "subjective",
    scale: "ordinal",
    unit: "escala",
    description: "Nível de satisfação dos usuários",
  },
  {
    name: "Facilidade de Uso",
    type: "subjective",
    scale: "ordinal",
    unit: "escala",
    description: "Facilidade percebida de uso do sistema",
  },
  {
    name: "Manutenibilidade",
    type: "subjective",
    scale: "ordinal",
    unit: "escala",
    description: "Facilidade de manutenção do código",
  },
] as const;

export const questionTemplates = [
  "Qual é o nível de [atributo] do [objeto] com relação ao [aspecto de qualidade]?",
  "Quão eficiente é o [processo] em termos de [métrica]?",
  "O [objeto] atende aos requisitos de [aspecto de qualidade]?",
  "Qual é a percepção dos [stakeholders] sobre [atributo]?",
  "Como [fator] afeta [aspecto de qualidade] do [objeto]?",
] as const;

export const GQM_PURPOSES = gqmPurposes;
export const GQM_VIEWPOINTS = gqmViewpoints;
export const GQM_CONTEXTS = gqmContexts;
export const METRIC_TYPES = metricTypes;
export const METRIC_SCALES = metricScales;
export const COMMON_METRICS = commonMetrics;
export const QUESTION_TEMPLATES = questionTemplates;
