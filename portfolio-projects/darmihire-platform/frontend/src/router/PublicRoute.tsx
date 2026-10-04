import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import {
  getTenantId,
  isAuthenticated,
} from "@/utils/session";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({
  children,
}: PublicRouteProps) {
  /*
   * Not logged in:
   * allow access to login/register pages.
   */
  if (!isAuthenticated()) {
    return children;
  }

  /*
   * Already logged in.
   */
  const tenantId = getTenantId();

  /*
   * Authenticated but workspace hasn't
   * been selected/created yet.
   */
  if (!tenantId) {
    return (
      <Navigate
        to="/onboarding"
        replace
      />
    );
  }

  /*
   * Fully authenticated user.
   */
  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}