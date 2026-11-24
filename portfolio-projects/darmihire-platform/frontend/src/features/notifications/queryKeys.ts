export const notificationQueryKeys = {
    all: ["notifications"] as const,

    list: (tenantId?: string | null) => [...notificationQueryKeys.all, "list", tenantId] as const,
};
