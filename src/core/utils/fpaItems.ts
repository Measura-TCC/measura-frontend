import { FunctionType, ComplexityLevel } from "@/core/types/fpa";

export const getFunctionTypes = (t: (key: string) => string) => [
  {
    value: "EI" as FunctionType,
    label: t("functionTypeLabels.EI"),
    description: t("functionTypeDescriptions.EI") || "External Input",
    points: {
      simple: 3,
      average: 4,
      complex: 6,
    },
  },
  {
    value: "EO" as FunctionType,
    label: t("functionTypeLabels.EO"),
    description: t("functionTypeDescriptions.EO") || "External Output",
    points: {
      simple: 4,
      average: 5,
      complex: 7,
    },
  },
  {
    value: "EQ" as FunctionType,
    label: t("functionTypeLabels.EQ"),
    description: t("functionTypeDescriptions.EQ") || "External Query",
    points: {
      simple: 3,
      average: 4,
      complex: 6,
    },
  },
  {
    value: "ILF" as FunctionType,
    label: t("functionTypeLabels.ILF"),
    description: t("functionTypeDescriptions.ILF") || "Internal Logical File",
    points: {
      simple: 7,
      average: 10,
      complex: 15,
    },
  },
  {
    value: "EIF" as FunctionType,
    label: t("functionTypeLabels.EIF"),
    description: t("functionTypeDescriptions.EIF") || "External Interface File",
    points: {
      simple: 5,
      average: 7,
      complex: 10,
    },
  },
];

export const getComplexityLevels = (t: (key: string) => string) => [
  {
    value: "simple" as ComplexityLevel,
    label: t("complexityLabels.LOW"),
    description: t("complexityDescriptions.LOW") || "Low complexity",
  },
  {
    value: "average" as ComplexityLevel,
    label: t("complexityLabels.AVERAGE"),
    description: t("complexityDescriptions.AVERAGE") || "Average complexity",
  },
  {
    value: "complex" as ComplexityLevel,
    label: t("complexityLabels.HIGH"),
    description: t("complexityDescriptions.HIGH") || "High complexity",
  },
];

export const functionTypes = [
  { value: "EI" as FunctionType, label: "External Input (EI)" },
  { value: "EO" as FunctionType, label: "External Output (EO)" },
  { value: "EQ" as FunctionType, label: "External Inquiry (EQ)" },
  { value: "ILF" as FunctionType, label: "Internal Logical File (ILF)" },
  { value: "EIF" as FunctionType, label: "External Interface File (EIF)" },
];

export const complexityLevels = [
  { value: "simple" as ComplexityLevel, label: "Baixa", multiplier: 1 },
  { value: "average" as ComplexityLevel, label: "Média", multiplier: 2 },
  { value: "complex" as ComplexityLevel, label: "Alta", multiplier: 3 },
] as const;

export const fpaPointsMatrix: Record<
  FunctionType,
  Record<ComplexityLevel, number>
> = {
  EI: {
    simple: 3,
    average: 4,
    complex: 6,
  },
  EO: {
    simple: 4,
    average: 5,
    complex: 7,
  },
  EQ: {
    simple: 3,
    average: 4,
    complex: 6,
  },
  ILF: {
    simple: 7,
    average: 10,
    complex: 15,
  },
  EIF: {
    simple: 5,
    average: 7,
    complex: 10,
  },
};

export const getAdjustmentFactors = (t: (key: string) => string) => [
  {
    id: "data_communications",
    label: t("adjustmentFactors.data_communications"),
    weight: 1,
  },
  {
    id: "distributed_processing",
    label: t("adjustmentFactors.distributed_processing"),
    weight: 1,
  },
  { id: "performance", label: t("adjustmentFactors.performance"), weight: 1 },
  {
    id: "configuration",
    label: t("adjustmentFactors.configuration"),
    weight: 1,
  },
  {
    id: "transaction_rate",
    label: t("adjustmentFactors.transaction_rate"),
    weight: 1,
  },
  {
    id: "online_data_entry",
    label: t("adjustmentFactors.online_data_entry"),
    weight: 1,
  },
  {
    id: "end_user_efficiency",
    label: t("adjustmentFactors.end_user_efficiency"),
    weight: 1,
  },
  {
    id: "online_update",
    label: t("adjustmentFactors.online_update"),
    weight: 1,
  },
  {
    id: "complex_processing",
    label: t("adjustmentFactors.complex_processing"),
    weight: 1,
  },
  { id: "reusability", label: t("adjustmentFactors.reusability"), weight: 1 },
  {
    id: "installation_ease",
    label: t("adjustmentFactors.installation_ease"),
    weight: 1,
  },
  {
    id: "operational_ease",
    label: t("adjustmentFactors.operational_ease"),
    weight: 1,
  },
  {
    id: "multiple_sites",
    label: t("adjustmentFactors.multiple_sites"),
    weight: 1,
  },
  {
    id: "facilitate_change",
    label: t("adjustmentFactors.facilitate_change"),
    weight: 1,
  },
];

export const adjustmentFactors = [
  {
    key: "dataTransmission",
    label: "Comunicação de Dados",
    description: "Grau de comunicação de dados",
  },
  {
    key: "distributedProcessing",
    label: "Processamento Distribuído",
    description: "Processamento distribuído ou transferência de dados",
  },
  {
    key: "performance",
    label: "Performance",
    description: "Objetivos de performance",
  },
  {
    key: "heavilyUsedConfiguration",
    label: "Configuração Utilizada",
    description: "Configuração de hardware altamente utilizada",
  },
  {
    key: "transactionRate",
    label: "Taxa de Transações",
    description: "Taxa de transações",
  },
  {
    key: "onlineDataEntry",
    label: "Entrada de Dados Online",
    description: "Entrada de dados online",
  },
  {
    key: "endUserEfficiency",
    label: "Eficiência do Usuário Final",
    description: "Eficiência do usuário final",
  },
  {
    key: "onlineUpdate",
    label: "Atualização Online",
    description: "Atualização online",
  },
  {
    key: "complexProcessing",
    label: "Processamento Complexo",
    description: "Processamento lógico complexo",
  },
  {
    key: "reusability",
    label: "Reusabilidade",
    description: "Reusabilidade do código",
  },
  {
    key: "installationEase",
    label: "Facilidade de Instalação",
    description: "Facilidade de instalação",
  },
  {
    key: "operationalEase",
    label: "Facilidade Operacional",
    description: "Facilidade operacional",
  },
  {
    key: "multipleSites",
    label: "Múltiplos Sites",
    description: "Múltiplos sites",
  },
  {
    key: "facilitateChange",
    label: "Facilitar Mudanças",
    description: "Facilitar mudanças",
  },
] as const;

export const calculateFunctionPoints = (
  type: FunctionType,
  complexity: ComplexityLevel
): number => {
  return fpaPointsMatrix[type][complexity];
};

export const calculateAdjustmentFactor = (ratings: number[]): number => {
  const totalInfluence = ratings.reduce((sum, rating) => sum + rating, 0);
  return 0.65 + totalInfluence * 0.01;
};

export const calculateAdjustedFunctionPoints = (
  unadjustedPoints: number,
  adjustmentFactor: number
): number => {
  return Math.round(unadjustedPoints * adjustmentFactor);
};

export const COMPLEXITY_LEVELS = complexityLevels;
export const FUNCTION_TYPES = functionTypes;
export const ADJUSTMENT_FACTORS = adjustmentFactors;

export const EXTERNAL_INPUTS = [
  { complexity: "simple" as ComplexityLevel, label: "Simples", count: 0 },
  { complexity: "average" as ComplexityLevel, label: "Médio", count: 0 },
  { complexity: "complex" as ComplexityLevel, label: "Complexo", count: 0 },
];

export const EXTERNAL_OUTPUTS = [
  { complexity: "simple" as ComplexityLevel, label: "Simples", count: 0 },
  { complexity: "average" as ComplexityLevel, label: "Médio", count: 0 },
  { complexity: "complex" as ComplexityLevel, label: "Complexo", count: 0 },
];

export const EXTERNAL_INQUIRIES = [
  { complexity: "simple" as ComplexityLevel, label: "Simples", count: 0 },
  { complexity: "average" as ComplexityLevel, label: "Médio", count: 0 },
  { complexity: "complex" as ComplexityLevel, label: "Complexo", count: 0 },
];

export const INTERNAL_LOGICAL_FILES = [
  { complexity: "simple" as ComplexityLevel, label: "Simples", count: 0 },
  { complexity: "average" as ComplexityLevel, label: "Médio", count: 0 },
  { complexity: "complex" as ComplexityLevel, label: "Complexo", count: 0 },
];

export const EXTERNAL_INTERFACE_FILES = [
  { complexity: "simple" as ComplexityLevel, label: "Simples", count: 0 },
  { complexity: "average" as ComplexityLevel, label: "Médio", count: 0 },
  { complexity: "complex" as ComplexityLevel, label: "Complexo", count: 0 },
];
