import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500),
  website: z.string().url("Must be a valid URL"),
  industry: z.string().min(2, "Industry is required").max(100),
  // Additional descriptive fields (stored in backend with English keys)
  mission: z.string().min(3, "Mission is required").max(1000),
  vision: z.string().min(3, "Vision is required").max(1000),
  values: z.string().min(1, "Values are required").max(1000),
  strategicObjectives: z
    .string()
    .min(1, "Strategic objectives are required")
    .max(2000),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>;
