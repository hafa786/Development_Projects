export type TenantRole =
  | "COMPANY_ADMIN"
  | "RECRUITER"
  | "HIRING_MANAGER"
  | "INTERVIEWER"
  | "VIEWER";

export type UserTenant = {
  id: string;
  name: string;
  slug: string;
  role: TenantRole;
};

export type TenantResponse = {
  id: string;
  name: string;
  slug: string;
};

export type CreateTenantRequest = {
  name: string;
  slug: string;
};