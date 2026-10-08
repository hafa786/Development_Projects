export const candidateQueryKeys = {
  all: ["candidates"] as const,

  lists: () =>
    [...candidateQueryKeys.all, "list"] as const,

  list: (tenantId?: string | null) =>
    [...candidateQueryKeys.lists(), tenantId] as const,

  details: () =>
    [...candidateQueryKeys.all, "detail"] as const,

  detail: (
    tenantId: string | null | undefined,
    candidateId: string,
  ) =>
    [
      ...candidateQueryKeys.details(),
      tenantId,
      candidateId,
    ] as const,
};