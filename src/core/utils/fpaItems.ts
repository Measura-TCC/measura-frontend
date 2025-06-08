import { FunctionType, ComplexityLevel } from "@/core/types";

export const getFunctionTypes = (t: (key: string) => string) => [
  { value: FunctionType.EI, label: t("functionTypeLabels.EI") },
  { value: FunctionType.EO, label: t("functionTypeLabels.EO") },
  { value: FunctionType.EQ, label: t("functionTypeLabels.EQ") },
  { value: FunctionType.ILF, label: t("functionTypeLabels.ILF") },
  { value: FunctionType.EIF, label: t("functionTypeLabels.EIF") },
];

export const getComplexityLevels = (t: (key: string) => string) => [
  { value: ComplexityLevel.LOW, label: t("complexityLabels.LOW") },
  { value: ComplexityLevel.AVERAGE, label: t("complexityLabels.AVERAGE") },
  { value: ComplexityLevel.HIGH, label: t("complexityLabels.HIGH") },
];

export const functionTypes = [
  { value: FunctionType.EI, label: "External Input (EI)" },
  { value: FunctionType.EO, label: "External Output (EO)" },
  { value: FunctionType.EQ, label: "External Inquiry (EQ)" },
  { value: FunctionType.ILF, label: "Internal Logical File (ILF)" },
  { value: FunctionType.EIF, label: "External Interface File (EIF)" },
];

export const complexityLevels = [
  { value: ComplexityLevel.LOW, label: "Baixa", multiplier: 1 },
  { value: ComplexityLevel.AVERAGE, label: "Média", multiplier: 2 },
  { value: ComplexityLevel.HIGH, label: "Alta", multiplier: 3 },
] as const;

export const fpaPointsMatrix: Record<
  FunctionType,
  Record<ComplexityLevel, number>
> = {
  [FunctionType.EI]: {
    [ComplexityLevel.LOW]: 3,
    [ComplexityLevel.AVERAGE]: 4,
    [ComplexityLevel.HIGH]: 6,
  },
  [FunctionType.EO]: {
    [ComplexityLevel.LOW]: 4,
    [ComplexityLevel.AVERAGE]: 5,
    [ComplexityLevel.HIGH]: 7,
  },
  [FunctionType.EQ]: {
    [ComplexityLevel.LOW]: 3,
    [ComplexityLevel.AVERAGE]: 4,
    [ComplexityLevel.HIGH]: 6,
  },
  [FunctionType.ILF]: {
    [ComplexityLevel.LOW]: 7,
    [ComplexityLevel.AVERAGE]: 10,
    [ComplexityLevel.HIGH]: 15,
  },
  [FunctionType.EIF]: {
    [ComplexityLevel.LOW]: 5,
    [ComplexityLevel.AVERAGE]: 7,
    [ComplexityLevel.HIGH]: 10,
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
  { complexity: ComplexityLevel.LOW, label: "Simples", count: 0 },
  { complexity: ComplexityLevel.AVERAGE, label: "Médio", count: 0 },
  { complexity: ComplexityLevel.HIGH, label: "Complexo", count: 0 },
];

export const EXTERNAL_OUTPUTS = [
  { complexity: ComplexityLevel.LOW, label: "Simples", count: 0 },
  { complexity: ComplexityLevel.AVERAGE, label: "Médio", count: 0 },
  { complexity: ComplexityLevel.HIGH, label: "Complexo", count: 0 },
];

export const EXTERNAL_INQUIRIES = [
  { complexity: ComplexityLevel.LOW, label: "Simples", count: 0 },
  { complexity: ComplexityLevel.AVERAGE, label: "Médio", count: 0 },
  { complexity: ComplexityLevel.HIGH, label: "Complexo", count: 0 },
];

export const INTERNAL_LOGICAL_FILES = [
  { complexity: ComplexityLevel.LOW, label: "Simples", count: 0 },
  { complexity: ComplexityLevel.AVERAGE, label: "Médio", count: 0 },
  { complexity: ComplexityLevel.HIGH, label: "Complexo", count: 0 },
];

export const EXTERNAL_INTERFACE_FILES = [
  { complexity: ComplexityLevel.LOW, label: "Simples", count: 0 },
  { complexity: ComplexityLevel.AVERAGE, label: "Médio", count: 0 },
  { complexity: ComplexityLevel.HIGH, label: "Complexo", count: 0 },
];
