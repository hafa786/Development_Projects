import { apiRequest } from "@/api/client";

import type {
  AddTeamMemberRequest,
  CreateTeamRequest,
  Team,
  UpdateTeamRequest,
} from "@/features/teams/types";

export async function getTeams(): Promise<Team[]> {
  return apiRequest<Team[]>("/teams", {
    tenantScoped: true,
  });
}

export async function getTeam(
  teamId: string,
): Promise<Team> {
  return apiRequest<Team>(`/teams/${teamId}`, {
    tenantScoped: true,
  });
}

export async function createTeam(
  request: CreateTeamRequest,
): Promise<Team> {
  return apiRequest<Team>("/teams", {
    method: "POST",
    tenantScoped: true,
    body: request,
  });
}

export async function updateTeam(
  teamId: string,
  request: UpdateTeamRequest,
): Promise<Team> {
  return apiRequest<Team>(`/teams/${teamId}`, {
    method: "PATCH",
    tenantScoped: true,
    body: request,
  });
}

export async function deleteTeam(
  teamId: string,
): Promise<void> {
  await apiRequest<void>(`/teams/${teamId}`, {
    method: "DELETE",
    tenantScoped: true,
  });
}

export async function addTeamMember(
  teamId: string,
  request: AddTeamMemberRequest,
): Promise<void> {
  await apiRequest<void>(
    `/teams/${teamId}/members`,
    {
      method: "POST",
      tenantScoped: true,
      body: request,
    },
  );
}

export async function removeTeamMember(
  teamId: string,
  tenantUserId: string,
): Promise<void> {
  await apiRequest<void>(
    `/teams/${teamId}/members/${tenantUserId}`,
    {
      method: "DELETE",
      tenantScoped: true,
    },
  );
}