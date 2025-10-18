import { z } from "zod";

export const createOrganizationSchemaFactory = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(3, t("validation:organization.name.minLength"))
      .max(100, t("validation:organization.name.maxLength")),
    description: z
      .string()
      .min(10, t("validation:organization.description.minLength"))
      .max(500, t("validation:organization.description.maxLength")),
    website: z
      .string()
      .min(1, t("validation:common.required"))
      .regex(
        /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        t("validation:organization.website.invalid")
      ),
    industry: z
      .string()
      .min(2, t("validation:common.required"))
      .max(100, t("validation:organization.industry.maxLength")),
    // Additional descriptive fields (stored in backend with English keys)
    mission: z
      .string()
      .min(3, t("validation:common.required"))
      .max(1000, t("validation:common.invalidFormat")),
    vision: z
      .string()
      .min(3, t("validation:common.required"))
      .max(1000, t("validation:common.invalidFormat")),
    values: z
      .string()
      .min(1, t("validation:common.required"))
      .max(1000, t("validation:common.invalidFormat")),
    objectives: z
      .array(
        z.object({
          title: z.string().min(1, t("validation:common.required")),
          description: z.string().optional(),
          priority: z
            .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
            .optional(),
          status: z
            .enum([
              "PLANNING",
              "IN_PROGRESS",
              "COMPLETED",
              "ON_HOLD",
              "CANCELLED",
            ])
            .optional(),
          targetDate: z.string().optional(),
          progress: z.number().min(0).max(100).optional(),
        })
      )
      .optional(),
    strategicObjectives: z
      .string()
      .min(1, t("validation:common.required"))
      .max(2000, t("validation:common.invalidFormat"))
      .optional(),
  });

export const createUpdateOrganizationSchemaFactory = (
  t: (key: string) => string
) => createOrganizationSchemaFactory(t).partial();

// Create default schemas with dummy translation function for types
const dummyT = (key: string) => key;
export const createOrganizationSchema = createOrganizationSchemaFactory(dummyT);
export const updateOrganizationSchema = createUpdateOrganizationSchemaFactory(dummyT);

export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>;
