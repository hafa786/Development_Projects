import { apiRequest } from "@/api/client";

import type {
  CreateLocationRequest,
  Location,
  UpdateLocationRequest,
} from "@/features/locations/types";

export async function getLocations(): Promise<Location[]> {
  return apiRequest<Location[]>("/locations", {
    tenantScoped: true,
  });
}

export async function createLocation(
  request: CreateLocationRequest,
): Promise<Location> {
  return apiRequest<Location>("/locations", {
    method: "POST",
    tenantScoped: true,
    body: request,
  });
}

export async function updateLocation(
  locationId: string,
  request: UpdateLocationRequest,
): Promise<Location> {
  return apiRequest<Location>(`/locations/${locationId}`, {
    method: "PATCH",
    tenantScoped: true,
    body: request,
  });
}

export async function deleteLocation(
  locationId: string,
): Promise<void> {
  await apiRequest<void>(`/locations/${locationId}`, {
    method: "DELETE",
    tenantScoped: true,
  });
}