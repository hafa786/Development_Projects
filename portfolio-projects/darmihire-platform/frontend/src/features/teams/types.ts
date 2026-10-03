export type Team = {
  id: string;
  name: string;
  description: string | null;
};

export type CreateTeamRequest = {
  name: string;
  description?: string | null;
};

export type UpdateTeamRequest = {
  name: string;
  description?: string | null;
};

export type TeamMember = {
  tenantUserId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type AddTeamMemberRequest = {
  tenantUserId: string;
};