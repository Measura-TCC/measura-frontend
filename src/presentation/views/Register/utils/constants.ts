export const REGISTER_CONFIG = {
  VALIDATION: {
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 8,
    MAX_USERNAME_LENGTH: 50,
  },
  TIMEOUTS: {
    REDIRECT_DELAY: 2000,
  },
  ROUTES: {
    SUCCESS_REDIRECT: "/overview",
    LOGIN_PAGE: "/login",
    TERMS_PAGE: "/terms",
    PRIVACY_PAGE: "/privacy",
  },
  REDIRECT: {
    SUCCESS_PATH: "/overview",
    LOGIN_PATH: "/login",
  },
  ROLES: {
    DEFAULT: "project-manager",
    AVAILABLE: ["project-manager", "measurement-analyst"],
  },
} as const;

export const REGISTRATION_STATUSES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /\d/,
  SPECIAL_CHAR: /[@$!%*?&]/,
} as const;

export const ROLE_DESCRIPTIONS = {
  PROJECT_MANAGER: "Manage projects and teams",
  MEASUREMENT_ANALYST: "Analyze and measure software metrics",
} as const;
