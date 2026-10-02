import { apiRequest } from "@/api/client";

import type {
  CreateTenantRequest,
  TenantResponse,
  UserTenant,
} from "@/features/tenants/types";

export async function getMyTenants():
  Promise<UserTenant[]> {
  return apiRequest<UserTenant[]>(
    "/tenants",
  );
}

export async function createTenant(
  request: CreateTenantRequest,
): Promise<TenantResponse> {
  return apiRequest<TenantResponse>(
    "/tenants",
    {
      method: "POST",
      body: request,
    },
  );
}