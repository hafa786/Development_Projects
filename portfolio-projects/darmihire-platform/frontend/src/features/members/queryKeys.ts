export const memberQueryKeys = {
  all: ["members"] as const,

  lists: () =>
    [...memberQueryKeys.all, "list"] as const,

  list: (tenantId: string | null) =>
    [
      ...memberQueryKeys.lists(),
      tenantId,
    ] as const,

  details: () =>
    [...memberQueryKeys.all, "detail"] as const,

  detail: (
    tenantId: string | null,
    tenantUserId: string,
  ) =>
    [
      ...memberQueryKeys.details(),
      tenantId,
      tenantUserId,
    ] as const,

  invitations: () =>
    [
      ...memberQueryKeys.all,
      "invitations",
    ] as const,

  invitationList: (
    tenantId: string | null,
  ) =>
    [
      ...memberQueryKeys.invitations(),
      tenantId,
    ] as const,

  invitation: (token: string) =>
    [
      ...memberQueryKeys.invitations(),
      "token",
      token,
    ] as const,
};