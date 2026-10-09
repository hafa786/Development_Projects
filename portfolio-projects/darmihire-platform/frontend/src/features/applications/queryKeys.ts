export const applicationQueryKeys = {
  all: ["applications"] as const,

  lists: () =>
    [...applicationQueryKeys.all, "list"] as const,

  list: (tenantId?: string | null) =>
    [
      ...applicationQueryKeys.lists(),
      tenantId,
    ] as const,

  job: (
    tenantId: string | null | undefined,
    jobId: string,
  ) =>
    [
      ...applicationQueryKeys.all,
      "job",
      tenantId,
      jobId,
    ] as const,

  candidate: (
    tenantId: string | null | undefined,
    candidateId: string,
  ) =>
    [
      ...applicationQueryKeys.all,
      "candidate",
      tenantId,
      candidateId,
    ] as const,

  detail: (
    tenantId: string | null | undefined,
    applicationId: string,
  ) =>
    [
      ...applicationQueryKeys.all,
      "detail",
      tenantId,
      applicationId,
    ] as const,

    activities: (
  tenantId: string | null | undefined,
  applicationId: string,
) =>
  [
    ...applicationQueryKeys.all,
    "activities",
    tenantId,
    applicationId,
  ] as const,
};