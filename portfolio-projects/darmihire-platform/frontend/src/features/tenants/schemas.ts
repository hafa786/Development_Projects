import { z } from "zod";

export const createTenantSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Workspace name must be at least 2 characters.",
      )
      .max(
        150,
        "Workspace name must be 150 characters or less.",
      ),

    slug: z
      .string()
      .trim()
      .min(
        2,
        "Workspace URL must be at least 2 characters.",
      )
      .max(
        100,
        "Workspace URL must be 100 characters or less.",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens only.",
      ),
  });

export type CreateTenantFormData =
  z.infer<typeof createTenantSchema>;