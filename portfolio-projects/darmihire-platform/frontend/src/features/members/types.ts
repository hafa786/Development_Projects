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

/*
 * ---------------------------------------------------------
 * INVITATIONS
 * ---------------------------------------------------------
 */

export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "CANCELLED"
  | "EXPIRED";

export type Invitation = {
  id: string;
  email: string;
  role: MemberRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
};

export type CreateInvitationRequest = {
  email: string;
  role: MemberRole;
};

export type CreateInvitationResponse = {
  invitation: Invitation;
  token: string;
};

export type InvitationDetails = {
  email: string;
  tenantName: string;
  role: MemberRole;
  expiresAt: string;
};