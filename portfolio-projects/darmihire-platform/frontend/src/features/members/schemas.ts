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

export type MemberRoleFormValues =
  z.infer<typeof memberRoleSchema>;

export type MemberStatusFormValues =
  z.infer<typeof memberStatusSchema>;