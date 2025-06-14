export enum ComplexityLevel {
  LOW = "LOW",
  AVERAGE = "AVERAGE",
  HIGH = "HIGH",
}

export interface FPACalculationData {
  ilf: {
    low: ComplexityLevel;
    average: ComplexityLevel;
    high: ComplexityLevel;
    points: number[];
  };
  eif: {
    low: ComplexityLevel;
    average: ComplexityLevel;
    high: ComplexityLevel;
    points: number[];
  };
  ei: {
    low: ComplexityLevel;
    average: ComplexityLevel;
    high: ComplexityLevel;
    points: number[];
  };
  eo: {
    low: ComplexityLevel;
    average: ComplexityLevel;
    high: ComplexityLevel;
    points: number[];
  };
  eq: {
    low: ComplexityLevel;
    average: ComplexityLevel;
    high: ComplexityLevel;
    points: number[];
  };
}
