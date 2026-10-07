export const jobQueryKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobQueryKeys.all, "list"] as const,
  list: () => [...jobQueryKeys.lists()] as const,
  details: () => [...jobQueryKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...jobQueryKeys.details(), id] as const,
};