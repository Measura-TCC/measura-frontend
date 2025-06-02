export enum UserRole {
  USER = 'user',
  ANALYST = 'analyst',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// FPA Types
export enum FunctionType {
  EI = 'External Input',
  EO = 'External Output',
  EQ = 'External Inquiry',
  ILF = 'Internal Logical File',
  EIF = 'External Interface File',
}

export enum ComplexityLevel {
  LOW = 'Low',
  AVERAGE = 'Average',
  HIGH = 'High',
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

// GQM Types
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

// Measurement Plan Types
export interface MeasurementPlan {
  id: string;
  name: string;
  description: string;
  projectId: string;
  goals: string[]; // Goal IDs
  estimates: string[]; // FPA Estimate IDs
  teamMembers: string[]; // User IDs
  deadline: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  teamMembers: string[]; // User IDs
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  requiredRole?: UserRole[];
}

// Form Types
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

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Activity Feed Types
export interface Activity {
  id: string;
  type: 'estimate_created' | 'goal_updated' | 'plan_completed' | 'user_joined';
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
} 