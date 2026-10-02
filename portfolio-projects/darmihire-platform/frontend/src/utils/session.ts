const ACCESS_TOKEN =
  "darmihire_access_token";

const REFRESH_TOKEN =
  "darmihire_refresh_token";

const TENANT_ID =
  "darmihire_tenant_id";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export function setTokens(
  tokens: AuthTokens,
): void {
  sessionStorage.setItem(
    ACCESS_TOKEN,
    tokens.accessToken,
  );

  sessionStorage.setItem(
    REFRESH_TOKEN,
    tokens.refreshToken,
  );
}

export function getAccessToken():
  | string
  | null {
  return sessionStorage.getItem(
    ACCESS_TOKEN,
  );
}

export function getRefreshToken():
  | string
  | null {
  return sessionStorage.getItem(
    REFRESH_TOKEN,
  );
}

export function setTenantId(
  tenantId: string,
): void {
  sessionStorage.setItem(
    TENANT_ID,
    tenantId,
  );
}

export function getTenantId():
  | string
  | null {
  return sessionStorage.getItem(
    TENANT_ID,
  );
}

export function removeTenantId(): void {
  sessionStorage.removeItem(
    TENANT_ID,
  );
}

export function clearSession(): void {
  sessionStorage.removeItem(
    ACCESS_TOKEN,
  );

  sessionStorage.removeItem(
    REFRESH_TOKEN,
  );

  sessionStorage.removeItem(
    TENANT_ID,
  );
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}