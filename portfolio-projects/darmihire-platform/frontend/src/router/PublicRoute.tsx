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
  if (!isAuthenticated()) {
    return children;
  }

  const tenantId = getTenantId();

  if (!tenantId) {
    return (
      <Navigate
        to="/onboarding"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}