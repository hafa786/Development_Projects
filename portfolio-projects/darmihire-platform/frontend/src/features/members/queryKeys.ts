export const memberQueryKeys = {
  all: ["members"] as const,

  lists: () =>
    [...memberQueryKeys.all, "list"] as const,

  list: (tenantId: string | null) =>
    [
      ...memberQueryKeys.lists(),
      tenantId,
    ] as const,

  details: () =>
    [...memberQueryKeys.all, "detail"] as const,

  detail: (
    tenantId: string | null,
    tenantUserId: string,
  ) =>
    [
      ...memberQueryKeys.details(),
      tenantId,
      tenantUserId,
    ] as const,
};