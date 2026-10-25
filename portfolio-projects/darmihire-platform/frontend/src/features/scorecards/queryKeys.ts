export const scorecardQueryKeys = {
    all: ["scorecard-templates"] as const,

    lists: () => [...scorecardQueryKeys.all, "list"] as const,

    list: (tenantId?: string | null) => [...scorecardQueryKeys.lists(), tenantId] as const,

    active: (tenantId?: string | null) => [...scorecardQueryKeys.all, "active", tenantId] as const,

    details: () => [...scorecardQueryKeys.all, "detail"] as const,

    detail: (tenantId: string | null | undefined, templateId: string) =>
        [...scorecardQueryKeys.details(), tenantId, templateId] as const,
};
