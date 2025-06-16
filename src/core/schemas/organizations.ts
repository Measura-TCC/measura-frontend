import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500)
    .optional(),
  website: z.string().url("Must be a valid URL").optional(),
  industry: z.string().max(100).optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>;
