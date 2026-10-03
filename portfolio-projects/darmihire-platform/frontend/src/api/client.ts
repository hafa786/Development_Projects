import { ApiError, type ApiErrorResponse } from "@/api/errors";

import { getAccessToken, getTenantId } from "@/utils/session";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  authenticated?: boolean;
  tenantScoped?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    authenticated = true,
    tenantScoped = false,
    headers: customHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(customHeaders);

  headers.set("Accept", "application/json");

  if (body !== undefined && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const accessToken = getAccessToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  if (tenantScoped) {
    const tenantId = getTenantId();

    if (tenantId) {
      headers.set("X-Tenant-ID", tenantId);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");

    let details: ApiErrorResponse | undefined;
    let message = `Request failed with status ${response.status}.`;

    try {
      if (contentType?.includes("application/json")) {
        details = (await response.json()) as ApiErrorResponse;

        if (details?.message) {
          message = details.message;
        }
      } else {
        const text = await response.text();

        if (text.trim()) {
          message = text;
        }
      }
    } catch {
      // Keep default error message.
    }

    throw new ApiError(response.status, message, details);
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
