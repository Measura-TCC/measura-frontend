import { z } from "zod";

// Project objective schema factory (matches API validation)
export const createProjectObjectiveSchemaFactory = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(3, t("validation:project.objective.title.minLength"))
      .max(200, t("validation:project.objective.title.maxLength")),
    description: z
      .string()
      .min(10, t("validation:project.objective.description.minLength"))
      .max(1000, t("validation:project.objective.description.maxLength")),
    organizationalObjectiveIds: z.array(z.string()).optional(),
  });

// Create project schema factory (matches API validation)
export const createProjectSchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(3, t("validation:project.name.minLength"))
      .max(100, t("validation:project.name.maxLength")),
    description: z
      .string()
      .min(10, t("validation:project.description.minLength"))
      .max(1000, t("validation:project.description.maxLength")),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    teamMembers: z
      .array(z.string())
      .max(50, t("validation:project.teamMembers.maxLength"))
      .optional(),
    objectives: z.array(createProjectObjectiveSchemaFactory(t)).optional(),
  });

// Update project schema factory (matches API validation)
export const createUpdateProjectSchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(3, t("validation:project.name.minLength"))
      .max(100, t("validation:project.name.maxLength"))
      .optional(),
    description: z
      .string()
      .min(10, t("validation:project.description.minLength"))
      .max(1000, t("validation:project.description.maxLength"))
      .optional(),
    status: z
      .enum(["PLANNING", "IN_PROGRESS", "COMPLETED", "ARCHIVED"])
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    teamMembers: z
      .array(z.string())
      .max(50, t("validation:project.teamMembers.maxLength"))
      .optional(),
    objectives: z.array(createProjectObjectiveSchemaFactory(t)).optional(),
  });

// Legacy translation function support
export const createProjectSchemaWithTranslation = createProjectSchemaFactory;

// Default schemas with dummy translation function for types
const dummyT = (key: string) => key;
export const createProjectSchema = createProjectSchemaFactory(dummyT);
export const updateProjectSchema = createUpdateProjectSchemaFactory(dummyT);

export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectSchema>;

export interface ProjectObjective {
  _id: string;
  title: string;
  description: string;
  organizationalObjectiveIds: string[];
}

export interface CreateProjectObjectiveDto {
  title: string;
  description: string;
  organizationalObjectiveIds?: string[];
}

export interface MeasurementPlanSummary {
  _id: string;
  planName: string;
  associatedProject: string;
  planResponsible: string;
  organizationId: string;
  status: string;
  createdBy: string;
  objectives?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface EstimateSummary {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  organizationId: string;
  status: string;
  countType: string;
  unadjustedFunctionPoints: number;
  adjustedFunctionPoints: number;
  estimatedEffortHours: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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
  objectives: ProjectObjective[];
  measurementPlanId?: string | null;
  estimateId?: string | null;
  measurementPlans?: MeasurementPlanSummary[];
  estimates?: EstimateSummary[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
