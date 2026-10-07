export const jobQueryKeys = {
  all: ["jobs"] as const,

  lists: () =>
    [...jobQueryKeys.all, "list"] as const,

  list: (tenantId: string | null) =>
    [...jobQueryKeys.lists(), tenantId] as const,

  details: () =>
    [...jobQueryKeys.all, "detail"] as const,

  detail: (
    tenantId: string | null,
    jobId: string,
  ) =>
    [
      ...jobQueryKeys.details(),
      tenantId,
      jobId,
    ] as const,
};