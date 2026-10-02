import type {
  ReactNode,
} from "react";
import {
  Navigate,
} from "react-router-dom";

import {
  getTenantId,
} from "@/utils/session";

type WorkspaceRouteProps = {
  children: ReactNode;
};

export function WorkspaceRoute({
  children,
}: WorkspaceRouteProps) {
  const tenantId =
    getTenantId();

  if (!tenantId) {
    return (
      <Navigate
        to="/onboarding"
        replace
      />
    );
  }

  return children;
}