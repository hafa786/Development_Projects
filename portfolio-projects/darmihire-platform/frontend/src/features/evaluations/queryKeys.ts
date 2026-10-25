export const evaluationQueryKeys = {
    all: ["application-evaluations"] as const,

    summary: (tenantId: string | null | undefined, applicationId: string) =>
        [...evaluationQueryKeys.all, tenantId, applicationId] as const,
};
