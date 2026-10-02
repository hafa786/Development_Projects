export const tenantQueryKeys = {
  all: ["tenants"] as const,

  mine: () =>
    [...tenantQueryKeys.all, "mine"] as const,
};