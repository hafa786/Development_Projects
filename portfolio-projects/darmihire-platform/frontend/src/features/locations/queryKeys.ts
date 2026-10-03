export const locationQueryKeys = {
  all: ["locations"] as const,

  list: (tenantId: string) =>
    [
      ...locationQueryKeys.all,
      tenantId,
      "list",
    ] as const,

  detail: (
    tenantId: string,
    locationId: string,
  ) =>
    [
      ...locationQueryKeys.all,
      tenantId,
      "detail",
      locationId,
    ] as const,
};