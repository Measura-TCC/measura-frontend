import { z } from "zod";

export const createProjectSchemaWithTranslation = (
  t: (key: string) => string
) =>
  z.object({
    name: z
      .string()
      .min(3, t("validation.nameMinLength"))
      .max(100, t("validation.nameMaxLength")),
    description: z
      .string()
      .min(10, t("validation.descriptionMinLength"))
      .max(1000, t("validation.descriptionMaxLength")),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    teamMembers: z.string().optional(),
  });

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  teamMembers: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),
  status: z
    .enum(["PLANNING", "IN_PROGRESS", "COMPLETED", "ARCHIVED"])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  teamMembers: z.array(z.string()).optional(),
});

export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectSchema>;

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
