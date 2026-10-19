export const offerQueryKeys = {
    all: ["offers"] as const,

    lists: () =>
        [
            ...offerQueryKeys.all,
            "list",
        ] as const,

    list: (
        tenantId: string | null,
        status?: string,
    ) =>
        [
            ...offerQueryKeys.lists(),
            tenantId,
            status ?? "ALL",
        ] as const,

    applications: () =>
        [
            ...offerQueryKeys.all,
            "application",
        ] as const,

    application: (
        tenantId: string | null,
        applicationId: string,
    ) =>
        [
            ...offerQueryKeys.applications(),
            tenantId,
            applicationId,
        ] as const,

    details: () =>
        [
            ...offerQueryKeys.all,
            "detail",
        ] as const,

    detail: (
        tenantId: string | null,
        offerId: string,
    ) =>
        [
            ...offerQueryKeys.details(),
            tenantId,
            offerId,
        ] as const,
};