import {
  apiRequest,
} from "@/api/client";

import type {
  CreateDepartmentRequest,
  Department,
  UpdateDepartmentRequest,
} from "@/features/departments/types";

export async function getDepartments():
  Promise<Department[]> {
  return apiRequest<Department[]>(
    "/departments",
    {
      tenantScoped: true,
    },
  );
}

export async function createDepartment(
  request: CreateDepartmentRequest,
): Promise<Department> {
  return apiRequest<Department>(
    "/departments",
    {
      method: "POST",
      tenantScoped: true,
      body: request,
    },
  );
}

export async function updateDepartment(
  departmentId: string,
  request: UpdateDepartmentRequest,
): Promise<Department> {
  return apiRequest<Department>(
    `/departments/${departmentId}`,
    {
      method: "PATCH",
      tenantScoped: true,
      body: request,
    },
  );
}

export async function deleteDepartment(
  departmentId: string,
): Promise<void> {
  await apiRequest<void>(
    `/departments/${departmentId}`,
    {
      method: "DELETE",
      tenantScoped: true,
    },
  );
}