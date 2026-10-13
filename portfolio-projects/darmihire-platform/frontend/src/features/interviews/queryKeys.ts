export const interviewQueryKeys = {
  all: ["interviews"] as const,

  lists: () => [...interviewQueryKeys.all, "list"] as const,

  list: (tenantId?: string | null) =>
    [...interviewQueryKeys.lists(), tenantId] as const,

  details: () => [...interviewQueryKeys.all, "detail"] as const,

  detail: (
    tenantId: string | null | undefined,
    interviewId: string,
  ) =>
    [
      ...interviewQueryKeys.details(),
      tenantId,
      interviewId,
    ] as const,

  application: (
    tenantId: string | null | undefined,
    applicationId: string,
  ) =>
    [
      ...interviewQueryKeys.all,
      "application",
      tenantId,
      applicationId,
    ] as const,

  upcoming: (
    tenantId: string | null | undefined,
    from?: string,
    to?: string,
  ) =>
    [
      ...interviewQueryKeys.all,
      "upcoming",
      tenantId,
      from ?? null,
      to ?? null,
    ] as const,
};