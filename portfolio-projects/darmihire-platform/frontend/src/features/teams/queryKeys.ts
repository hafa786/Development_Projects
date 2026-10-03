export const teamQueryKeys = {
  all: ["teams"] as const,

  list: (tenantId: string) =>
    [
      ...teamQueryKeys.all,
      tenantId,
      "list",
    ] as const,

  detail: (
    tenantId: string,
    teamId: string,
  ) =>
    [
      ...teamQueryKeys.all,
      tenantId,
      "detail",
      teamId,
    ] as const,

  members: (
    tenantId: string,
    teamId: string,
  ) =>
    [
      ...teamQueryKeys.all,
      tenantId,
      teamId,
      "members",
    ] as const,
};