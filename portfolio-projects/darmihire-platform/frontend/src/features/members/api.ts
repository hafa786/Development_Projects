import { apiRequest } from "@/api/client";

import type {
  Member,
  UpdateMemberRoleRequest,
  UpdateMemberStatusRequest,
} from "@/features/members/types";

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