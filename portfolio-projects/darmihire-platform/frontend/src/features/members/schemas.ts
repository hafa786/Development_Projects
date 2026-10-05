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

export type MemberRoleFormData =
  z.infer<typeof memberRoleSchema>;

export type MemberStatusFormData =
  z.infer<typeof memberStatusSchema>;