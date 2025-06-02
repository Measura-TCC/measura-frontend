import { FunctionType, ComplexityLevel } from '@/core/types';

export const getFunctionTypes = (t: (key: string) => string) => [
  { value: FunctionType.EI, label: t('functionTypeLabels.EI') },
  { value: FunctionType.EO, label: t('functionTypeLabels.EO') },
  { value: FunctionType.EQ, label: t('functionTypeLabels.EQ') },
  { value: FunctionType.ILF, label: t('functionTypeLabels.ILF') },
  { value: FunctionType.EIF, label: t('functionTypeLabels.EIF') },
];

export const getComplexityLevels = (t: (key: string) => string) => [
  { value: ComplexityLevel.LOW, label: t('complexityLabels.LOW') },
  { value: ComplexityLevel.AVERAGE, label: t('complexityLabels.AVERAGE') },
  { value: ComplexityLevel.HIGH, label: t('complexityLabels.HIGH') },
];

// Keep original arrays for backwards compatibility
export const functionTypes = [
  { value: FunctionType.EI, label: 'External Input (EI)' },
  { value: FunctionType.EO, label: 'External Output (EO)' },
  { value: FunctionType.EQ, label: 'External Inquiry (EQ)' },
  { value: FunctionType.ILF, label: 'Internal Logical File (ILF)' },
  { value: FunctionType.EIF, label: 'External Interface File (EIF)' },
];

export const complexityLevels = [
  { value: ComplexityLevel.LOW, label: 'Low' },
  { value: ComplexityLevel.AVERAGE, label: 'Average' },
  { value: ComplexityLevel.HIGH, label: 'High' },
];

export const fpaPointsMatrix: Record<FunctionType, Record<ComplexityLevel, number>> = {
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
  { id: 'data_communications', label: t('adjustmentFactors.data_communications'), weight: 1 },
  { id: 'distributed_processing', label: t('adjustmentFactors.distributed_processing'), weight: 1 },
  { id: 'performance', label: t('adjustmentFactors.performance'), weight: 1 },
  { id: 'configuration', label: t('adjustmentFactors.configuration'), weight: 1 },
  { id: 'transaction_rate', label: t('adjustmentFactors.transaction_rate'), weight: 1 },
  { id: 'online_data_entry', label: t('adjustmentFactors.online_data_entry'), weight: 1 },
  { id: 'end_user_efficiency', label: t('adjustmentFactors.end_user_efficiency'), weight: 1 },
  { id: 'online_update', label: t('adjustmentFactors.online_update'), weight: 1 },
  { id: 'complex_processing', label: t('adjustmentFactors.complex_processing'), weight: 1 },
  { id: 'reusability', label: t('adjustmentFactors.reusability'), weight: 1 },
  { id: 'installation_ease', label: t('adjustmentFactors.installation_ease'), weight: 1 },
  { id: 'operational_ease', label: t('adjustmentFactors.operational_ease'), weight: 1 },
  { id: 'multiple_sites', label: t('adjustmentFactors.multiple_sites'), weight: 1 },
  { id: 'facilitate_change', label: t('adjustmentFactors.facilitate_change'), weight: 1 },
];

// Keep original array for backwards compatibility
export const adjustmentFactors = [
  { id: 'data_communications', label: 'Data Communications', weight: 1 },
  { id: 'distributed_processing', label: 'Distributed Data Processing', weight: 1 },
  { id: 'performance', label: 'Performance', weight: 1 },
  { id: 'configuration', label: 'Heavily Used Configuration', weight: 1 },
  { id: 'transaction_rate', label: 'Transaction Rate', weight: 1 },
  { id: 'online_data_entry', label: 'On-Line Data Entry', weight: 1 },
  { id: 'end_user_efficiency', label: 'End-User Efficiency', weight: 1 },
  { id: 'online_update', label: 'On-Line Update', weight: 1 },
  { id: 'complex_processing', label: 'Complex Processing', weight: 1 },
  { id: 'reusability', label: 'Reusability', weight: 1 },
  { id: 'installation_ease', label: 'Installation Ease', weight: 1 },
  { id: 'operational_ease', label: 'Operational Ease', weight: 1 },
  { id: 'multiple_sites', label: 'Multiple Sites', weight: 1 },
  { id: 'facilitate_change', label: 'Facilitate Change', weight: 1 },
];

export const calculateFunctionPoints = (type: FunctionType, complexity: ComplexityLevel): number => {
  return fpaPointsMatrix[type][complexity];
};

export const calculateAdjustmentFactor = (ratings: number[]): number => {
  const totalInfluence = ratings.reduce((sum, rating) => sum + rating, 0);
  return 0.65 + (totalInfluence * 0.01);
};

export const calculateAdjustedFunctionPoints = (unadjustedPoints: number, adjustmentFactor: number): number => {
  return Math.round(unadjustedPoints * adjustmentFactor);
}; 