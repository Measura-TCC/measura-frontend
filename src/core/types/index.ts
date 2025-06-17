export enum UserRole {
  USER = "user",
  ANALYST = "measurement-analyst",
  MANAGER = "project-manager",
  ADMIN = "admin",
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "project-manager" | "measurement-analyst";
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    language: "pt" | "en";
    timezone: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export enum FunctionType {
  EI = "External Input",
  EO = "External Output",
  EQ = "External Inquiry",
  ILF = "Internal Logical File",
  EIF = "External Interface File",
}

export enum ComplexityLevel {
  LOW = "Low",
  AVERAGE = "Average",
  HIGH = "High",
}

export interface FunctionPoint {
  id: string;
  name: string;
  description: string;
  type: FunctionType;
  complexity: ComplexityLevel;
  points: number;
}

export interface FPAEstimate {
  id: string;
  name: string;
  description: string;
  projectId?: string;
  functions: FunctionPoint[];
  totalPoints: number;
  adjustmentFactor: number;
  finalPoints: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  unit: string;
  target?: number;
  currentValue?: number;
  goalId: string;
}

export interface Question {
  id: string;
  text: string;
  description: string;
  metrics: Metric[];
  goalId: string;
}

export interface Goal {
  id: string;
  purpose: string;
  issue: string;
  object: string;
  viewpoint: string;
  context: string;
  questions: Question[];
  parentId?: string;
  children?: Goal[];
  projectId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeasurementPlan {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "completed" | "archived";
  startDate: Date;
  endDate?: Date;
  goals: string[];
  estimates: string[];
  teamMembers: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  startDate?: string;
  endDate?: string;
  organizationId: string;
  teamMembers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  requiredRole?: UserRole[];
}

export interface FormError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: FormError[];
}

export type Theme = "light" | "dark" | "system";

export interface Activity {
  id: string;
  type: "estimate_created" | "goal_updated" | "plan_completed" | "user_joined";
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface FPACalculationData {
  id: string;
  name: string;
  description?: string;
  projectType: "new-development" | "enhancement" | "redevelopment";
  inputs: {
    externalInputs: { count: number; complexity: ComplexityLevel };
    externalOutputs: { count: number; complexity: ComplexityLevel };
    externalInquiries: { count: number; complexity: ComplexityLevel };
    internalLogicalFiles: { count: number; complexity: ComplexityLevel };
    externalInterfaceFiles: { count: number; complexity: ComplexityLevel };
  };
  adjustmentFactors: {
    dataTransmission: number;
    distributedProcessing: number;
    performance: number;
    heavilyUsedConfiguration: number;
    transactionRate: number;
    onlineDataEntry: number;
    endUserEfficiency: number;
    onlineUpdate: number;
    complexProcessing: number;
    reusability: number;
    installationEase: number;
    operationalEase: number;
    multipleSites: number;
    facilitateChange: number;
  };
  results: {
    rawFunctionPoints: number;
    adjustedFunctionPoints: number;
    complexity: ComplexityLevel;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GQMGoal {
  id: string;
  name: string;
  description?: string;
  purpose: "characterize" | "evaluate" | "predict" | "motivate";
  focus: string;
  viewpoint: string;
  context: string;
  questions: string[];
  metrics: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GQMQuestion {
  id: string;
  goalId: string;
  text: string;
  description?: string;
  metrics: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GQMMetric {
  id: string;
  questionId: string;
  name: string;
  description?: string;
  type: "objective" | "subjective";
  scale: "nominal" | "ordinal" | "interval" | "ratio";
  unit?: string;
  collectionMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  permissions?: string[];
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { label: string; value: string }[];
}

export interface ActivityFeedItem {
  id: string;
  type: "create" | "update" | "delete" | "complete";
  entity: "project" | "plan" | "goal" | "estimate";
  entityId: string;
  entityName: string;
  userId: string;
  userEmail: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export * from "./fpa";
export * from "./plans";
export * from "./register";
export * from "./account";
