export const FPA_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },
  VALIDATION: {
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
  },
  FUNCTION_POINTS: {
    DEFAULT_POINTS: {
      EI: { simple: 3, average: 4, complex: 6 },
      EO: { simple: 4, average: 5, complex: 7 },
      EQ: { simple: 3, average: 4, complex: 6 },
      ILF: { simple: 7, average: 10, complex: 15 },
      EIF: { simple: 5, average: 7, complex: 10 },
    },
  },
} as const;

export const ESTIMATE_STATUSES = {
  DRAFT: "draft",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export const FUNCTION_TYPES = {
  EI: "EI",
  EO: "EO",
  EQ: "EQ",
  ILF: "ILF",
  EIF: "EIF",
} as const;

export const COMPLEXITY_LEVELS = {
  SIMPLE: "simple",
  AVERAGE: "average",
  COMPLEX: "complex",
} as const;
