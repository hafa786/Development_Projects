import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMyTenants } from "@/features/tenants/api";
import { tenantQueryKeys } from "@/features/tenants/queryKeys";
import type { UserTenant } from "@/features/tenants/types";
import {
  findSelectedTenant,
  formatTenantRole,
  getTenantInitials,
} from "@/features/tenants/utils";
import { getTenantId, removeTenantId, setTenantId } from "@/utils/session";

export function WorkspaceSwitcher() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const tenantsQuery = useQuery({
    queryKey: tenantQueryKeys.mine(),

    queryFn: getMyTenants,

    staleTime: 5 * 60 * 1000,
  });

  const tenantId = getTenantId();

  const tenants = tenantsQuery.data ?? [];

  const selectedTenant = findSelectedTenant(tenants, tenantId);

  async function handleWorkspaceSwitch(tenant: UserTenant) {
    if (tenant.id === tenantId) {
      return;
    }

    setTenantId(tenant.id);

    /*
     * Remove tenant-scoped server data from
     * the previous workspace.
     *
     * Keep global/authentication queries such as:
     * - ["auth", ...]
     * - ["tenants", ...]
     *
     * At this point Phase 1 does not yet have
     * department/team/location queries, but this
     * prepares the switcher for them.
     */
    queryClient.removeQueries({
      predicate: (query) => {
        const rootKey = query.queryKey[0];

        return rootKey !== "auth" && rootKey !== "tenants";
      },
    });

    toast.success(`Switched to ${tenant.name}.`);

    navigate("/dashboard");
  }

  function handleCreateWorkspace() {
    removeTenantId();

    queryClient.removeQueries({
      predicate: (query) => {
        const rootKey = query.queryKey[0];

        return rootKey !== "auth" && rootKey !== "tenants";
      },
    });

    navigate("/onboarding");
  }

  if (tenantsQuery.isLoading) {
    return (
      <div className="flex h-10 w-48 animate-pulse items-center gap-2 rounded-lg bg-muted px-2">
        <div className="size-7 rounded-md bg-muted-foreground/15" />

        <div className="space-y-1">
          <div className="h-3 w-24 rounded bg-muted-foreground/15" />
          <div className="h-2 w-16 rounded bg-muted-foreground/15" />
        </div>
      </div>
    );
  }

  if (tenantsQuery.isError) {
    return (
      <button
        type="button"
        className="rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
        onClick={() => tenantsQuery.refetch()}
      >
        Unable to load workspaces
      </button>
    );
  }

  if (!selectedTenant) {
    return (
      <button
        type="button"
        className="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-muted"
        onClick={handleCreateWorkspace}
      >
        Select workspace
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-11 min-w-0 max-w-64 items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Switch workspace"
      >
        <Avatar className="size-8 rounded-md">
          <AvatarFallback className="rounded-md text-xs font-semibold">
            {getTenantInitials(selectedTenant.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-none">
            {selectedTenant.name}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {formatTenantRole(selectedTenant.role)}
          </p>
        </div>

        <ChevronsUpDown
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <div className="px-2 py-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspaces
          </p>
        </div>

        {tenants.map((tenant) => {
          const isSelected = tenant.id === selectedTenant.id;

          return (
            <DropdownMenuItem
              key={tenant.id}
              onSelect={() => handleWorkspaceSwitch(tenant)}
              onClick={() => handleWorkspaceSwitch(tenant)}
              className="gap-3"
            >
              <Avatar className="size-8 rounded-md">
                <AvatarFallback className="rounded-md text-xs font-semibold">
                  {getTenantInitials(tenant.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{tenant.name}</p>

                <p className="truncate text-xs text-muted-foreground">
                  {formatTenantRole(tenant.role)}
                </p>
              </div>

              {isSelected && (
                <Check className="size-4 shrink-0" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleCreateWorkspace}>
          <Plus />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
