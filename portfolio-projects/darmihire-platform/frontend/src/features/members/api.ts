import { apiRequest } from "@/api/client";

import type {
  Member,
  MembershipStatus,
  MemberRole,
} from "./types";

export async function getMembers(): Promise<Member[]> {
  return apiRequest<Member[]>("/members", {
    method: "GET",
    authenticated: true,
    tenantScoped: true,
  });
}

export async function getMember(
  tenantUserId: string,
): Promise<Member> {
  return apiRequest<Member>(`/members/${tenantUserId}`, {
    method: "GET",
    authenticated: true,
    tenantScoped: true,
  });
}

export async function updateMemberRole(
  tenantUserId: string,
  role: MemberRole,
): Promise<Member> {
  return apiRequest<Member>(`/members/${tenantUserId}/role`, {
    method: "PATCH",
    authenticated: true,
    tenantScoped: true,
    body: {
      role,
    },
  });
}

export async function updateMemberStatus(
  tenantUserId: string,
  status: MembershipStatus,
): Promise<Member> {
  return apiRequest<Member>(`/members/${tenantUserId}/status`, {
    method: "PATCH",
    authenticated: true,
    tenantScoped: true,
    body: {
      status,
    },
  });
}

export async function removeMember(
  tenantUserId: string,
): Promise<void> {
  return apiRequest<void>(`/members/${tenantUserId}`, {
    method: "DELETE",
    authenticated: true,
    tenantScoped: true,
  });
}