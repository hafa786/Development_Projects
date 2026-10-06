import { apiRequest } from "@/api/client";

import type {
  CreateInvitationRequest,
  CreateInvitationResponse,
  Invitation,
  InvitationDetails,
  Member,
  UpdateMemberRoleRequest,
  UpdateMemberStatusRequest,
} from "@/features/members/types";

/*
 * ---------------------------------------------------------
 * MEMBERS
 * ---------------------------------------------------------
 */

export async function getMembers(): Promise<Member[]> {
  return apiRequest<Member[]>("/members", {
    method: "GET",
    tenantScoped: true,
  });
}

export async function getMember(
  tenantUserId: string,
): Promise<Member> {
  return apiRequest<Member>(
    `/members/${tenantUserId}`,
    {
      method: "GET",
      tenantScoped: true,
    },
  );
}

export async function updateMemberRole(
  tenantUserId: string,
  request: UpdateMemberRoleRequest,
): Promise<Member> {
  return apiRequest<Member>(
    `/members/${tenantUserId}/role`,
    {
      method: "PATCH",
      body: request,
      tenantScoped: true,
    },
  );
}

export async function updateMemberStatus(
  tenantUserId: string,
  request: UpdateMemberStatusRequest,
): Promise<Member> {
  return apiRequest<Member>(
    `/members/${tenantUserId}/status`,
    {
      method: "PATCH",
      body: request,
      tenantScoped: true,
    },
  );
}

export async function removeMember(
  tenantUserId: string,
): Promise<void> {
  return apiRequest<void>(
    `/members/${tenantUserId}`,
    {
      method: "DELETE",
      tenantScoped: true,
    },
  );
}

/*
 * ---------------------------------------------------------
 * INVITATIONS
 * ---------------------------------------------------------
 */

export async function getInvitations(): Promise<
  Invitation[]
> {
  return apiRequest<Invitation[]>(
    "/invitations",
    {
      method: "GET",
      tenantScoped: true,
    },
  );
}

export async function createInvitation(
  request: CreateInvitationRequest,
): Promise<CreateInvitationResponse> {
  return apiRequest<CreateInvitationResponse>(
    "/invitations",
    {
      method: "POST",
      body: request,
      tenantScoped: true,
    },
  );
}

export async function getInvitationByToken(
  token: string,
): Promise<InvitationDetails> {
  return apiRequest<InvitationDetails>(
    `/invitations/token/${encodeURIComponent(token)}`,
    {
      method: "GET",
      authenticated: false,
      tenantScoped: false,
    },
  );
}

export async function acceptInvitation(
  token: string,
): Promise<void> {
  return apiRequest<void>(
    `/invitations/token/${encodeURIComponent(token)}/accept`,
    {
      method: "POST",
      authenticated: true,
      tenantScoped: false,
    },
  );
}

export async function cancelInvitation(
  invitationId: string,
): Promise<void> {
  return apiRequest<void>(
    `/invitations/${invitationId}`,
    {
      method: "DELETE",
      tenantScoped: true,
    },
  );
}