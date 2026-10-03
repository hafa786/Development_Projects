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

export type AddTeamMemberRequest = {
  tenantUserId: string;
};