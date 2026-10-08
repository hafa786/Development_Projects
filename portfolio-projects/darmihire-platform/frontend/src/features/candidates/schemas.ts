import { z } from "zod";

export const candidateSources = [
  "CAREERS_PAGE",
  "LINKEDIN",
  "REFERRAL",
  "RECRUITER",
  "AGENCY",
  "JOB_BOARD",
  "MANUAL",
  "OTHER",
] as const;

export const candidateSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(255),

  phone: z.string().max(50).optional(),

  location: z.string().max(255).optional(),

  linkedinUrl: z
    .string()
    .max(500)
    .optional(),

  portfolioUrl: z
    .string()
    .max(500)
    .optional(),

  source: z.enum(candidateSources),

  notes: z.string().optional(),
});

export type CandidateFormValues =
  z.infer<typeof candidateSchema>;