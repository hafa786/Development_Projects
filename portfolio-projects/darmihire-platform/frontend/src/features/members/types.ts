export type MemberRole =
  | "COMPANY_ADMIN"
  | "RECRUITER"
  | "HIRING_MANAGER"
  | "INTERVIEWER"
  | "VIEWER";

export type MembershipStatus =
  | "ACTIVE"
  | "INVITED"
  | "SUSPENDED";

export type Member = {
  tenantUserId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: MemberRole;
  status: MembershipStatus;
  joinedAt: string | null;
  active: boolean;
};

export type UpdateMemberRoleRequest = {
  role: MemberRole;
};

export type UpdateMemberStatusRequest = {
  status: MembershipStatus;
};