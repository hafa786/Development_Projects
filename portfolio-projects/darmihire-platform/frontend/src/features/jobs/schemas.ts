import { z } from "zod";

export const jobFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Job title is required")
    .max(200, "Maximum 200 characters"),

  jobCode: z
    .string()
    .trim()
    .max(50, "Maximum 50 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  departmentId: z.string().optional(),

  teamId: z.string().optional(),

  locationId: z.string().optional(),

  recruiterId: z.string().optional(),

  hiringManagerId: z.string().optional(),

  employmentType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "TEMPORARY",
    "INTERNSHIP",
  ]),

  workplaceType: z.enum([
    "ON_SITE",
    "HYBRID",
    "REMOTE",
  ]),

  openings: z.coerce
    .number()
    .int()
    .min(1, "At least one opening is required"),
});

export type JobFormValues =
  z.infer<typeof jobFormSchema>;