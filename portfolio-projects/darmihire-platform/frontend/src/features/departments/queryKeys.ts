export const departmentQueryKeys = {
  all: ["departments"] as const,

  list: (tenantId: string) =>
    [
      ...departmentQueryKeys.all,
      tenantId,
      "list",
    ] as const,

  detail: (
    tenantId: string,
    departmentId: string,
  ) =>
    [
      ...departmentQueryKeys.all,
      tenantId,
      "detail",
      departmentId,
    ] as const,
};