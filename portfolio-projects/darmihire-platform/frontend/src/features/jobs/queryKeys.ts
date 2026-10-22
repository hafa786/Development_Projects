export const jobQueryKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobQueryKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  list: (tenantId: string | null) => [...jobQueryKeys.lists()] as const,
  details: () => [...jobQueryKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...jobQueryKeys.details(), id] as const,
};