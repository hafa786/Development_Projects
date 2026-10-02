import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { LoadingState } from "@/components/common/LoadingState";
import { getMyTenants } from "@/features/tenants/api";
import { tenantQueryKeys } from "@/features/tenants/queryKeys";
import { getTenantId, removeTenantId } from "@/utils/session";

type WorkspaceRouteProps = {
  children: ReactNode;
};

export function WorkspaceRoute({ children }: WorkspaceRouteProps) {
  const tenantId = getTenantId();

  const tenantsQuery = useQuery({
    queryKey: tenantQueryKeys.mine(),

    queryFn: getMyTenants,

    staleTime: 5 * 60 * 1000,

    enabled: Boolean(tenantId),
  });

  const hasWorkspaceAccess = tenantId
    ? (tenantsQuery.data?.some((tenant) => tenant.id === tenantId) ?? false)
    : false;

  const shouldRemoveStaleTenant = Boolean(
    tenantId && tenantsQuery.isSuccess && !hasWorkspaceAccess,
  );

  useEffect(() => {
    if (shouldRemoveStaleTenant) {
      removeTenantId();
    }
  }, [shouldRemoveStaleTenant]);

  if (!tenantId) {
    return <Navigate to="/onboarding" replace />;
  }

  if (tenantsQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (tenantsQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-lg font-semibold">Unable to load workspace</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            We could not verify your workspace access. Please refresh and try
            again.
          </p>
        </div>
      </div>
    );
  }

  if (shouldRemoveStaleTenant) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
