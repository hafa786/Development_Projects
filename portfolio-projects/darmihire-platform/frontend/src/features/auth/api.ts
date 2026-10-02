import { apiRequest } from "@/api/client";

import type {
  AuthResponse,
  CurrentUser,
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types";

export async function login(
  request: LoginRequest,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(
    "/auth/login",
    {
      method: "POST",
      authenticated: false,
      body: request,
    },
  );
}

export async function registerUser(
  request: RegisterRequest,
): Promise<void> {
  await apiRequest<void>(
    "/auth/register",
    {
      method: "POST",
      authenticated: false,
      body: request,
    },
  );
}

export async function getCurrentUser():
  Promise<CurrentUser> {
  return apiRequest<CurrentUser>(
    "/auth/me",
  );
}

export async function logout(
  refreshToken: string,
): Promise<void> {
  await apiRequest<void>(
    "/auth/logout",
    {
      method: "POST",
      body: {
        refreshToken,
      },
    },
  );
}