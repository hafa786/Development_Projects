import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ApiError } from "@/api/errors";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { createTenant, getMyTenants } from "@/features/tenants/api";
import { CreateWorkspaceForm } from "@/features/tenants/CreateWorkspaceForm";
import type { CreateTenantFormData } from "@/features/tenants/schemas";
import type { UserTenant } from "@/features/tenants/types";
import { WorkspaceCard } from "@/features/tenants/WorkspaceCard";
import { clearSession, setTenantId } from "@/utils/session";
import { tenantQueryKeys } from "@/features/tenants/queryKeys";

export default function OnboardingPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const tenantsQuery = useQuery({
    queryKey: tenantQueryKeys.mine(),

    queryFn: getMyTenants,
  });

  const createMutation = useMutation({
    mutationFn: createTenant,

    onSuccess: async (tenant) => {
      setTenantId(tenant.id);

      await queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.mine(),
      });

      toast.success("Workspace created successfully.");

      navigate("/dashboard", {
        replace: true,
      });
    },
  });

  function handleWorkspaceSelect(tenant: UserTenant) {
    setTenantId(tenant.id);

    toast.success(`${tenant.name} selected.`);

    navigate("/dashboard", {
      replace: true,
    });
  }

  async function handleCreate(data: CreateTenantFormData) {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        slug: data.slug,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error("That workspace URL is already in use.");

        return;
      }

      if (error instanceof ApiError) {
        toast.error(error.message);

        return;
      }

      toast.error("Unable to create the workspace. Please try again.");
    }
  }

  function handleSignOut() {
    clearSession();

    queryClient.clear();

    navigate("/login", {
      replace: true,
    });
  }

  if (tenantsQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading your workspaces...
        </div>
      </div>
    );
  }

  if (tenantsQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <Building2 className="size-5 text-destructive" />
          </div>

          <h1 className="text-xl font-semibold">Unable to load workspaces</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't load your DarmiHire workspaces.
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <Button onClick={() => tenantsQuery.refetch()}>Try again</Button>

            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tenants = tenantsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />

          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Set up your workspace
          </h1>

          <p className="mt-3 text-muted-foreground">
            Select an existing workspace or create a new one to start using
            DarmiHire.
          </p>
        </div>

        {tenants.length > 0 && (
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="font-semibold">Your workspaces</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose the workspace you want to continue with.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {tenants.map((tenant) => (
                <WorkspaceCard
                  key={tenant.id}
                  tenant={tenant}
                  onSelect={handleWorkspaceSelect}
                />
              ))}
            </div>
          </section>
        )}

        {tenants.length > 0 && (
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-muted/30 px-4 text-xs uppercase tracking-wide text-muted-foreground">
                Or create another
              </span>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-xl">
          <CreateWorkspaceForm
            isSubmitting={createMutation.isPending}
            onSubmit={handleCreate}
          />
        </div>
      </main>
    </div>
  );
}
