export const PLANS_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },
  VALIDATION: {
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
  },
  DEFAULTS: {
    PLAN_DURATION_DAYS: 90,
    GQM_PHASE: "planning",
  },
  TIMEOUTS: {
    DEBOUNCE_SEARCH: 300,
    AUTO_REFRESH: 60000,
  },
} as const;

export const GQM_PHASE_ORDER: Record<string, number> = {
  planning: 0,
  definition: 1,
  data_collection: 2,
  interpretation: 3,
  completed: 4,
} as const;
