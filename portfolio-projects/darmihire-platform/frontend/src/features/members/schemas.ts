import { z } from "zod";

export const memberRoleSchema = z.object({
  role: z.enum([
    "COMPANY_ADMIN",
    "RECRUITER",
    "HIRING_MANAGER",
    "INTERVIEWER",
    "VIEWER",
  ]),
});

export const memberStatusSchema = z.object({
  status: z.enum([
    "ACTIVE",
    "INVITED",
    "SUSPENDED",
  ]),
});

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  role: z.enum([
    "COMPANY_ADMIN",
    "RECRUITER",
    "HIRING_MANAGER",
    "INTERVIEWER",
    "VIEWER",
  ]),
});

export type MemberRoleFormData =
  z.infer<typeof memberRoleSchema>;

export type MemberStatusFormData =
  z.infer<typeof memberStatusSchema>;

export type InviteMemberFormData =
  z.infer<typeof inviteMemberSchema>;