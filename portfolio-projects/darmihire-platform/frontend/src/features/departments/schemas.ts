import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters.")
    .max(150, "Department name must be 150 characters or less."),

  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less."),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
