import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Logo } from "@/components/common/Logo";
import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/features/auth/api";
import { UserMenu } from "@/features/auth/UserMenu";
import { UserMenuSkeleton } from "@/features/auth/UserMenuSkeleton";
import { clearSession, getRefreshToken } from "@/utils/session";

export function Topbar() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: ["auth", "current-user"],

    queryFn: getCurrentUser,

    staleTime: 5 * 60 * 1000,

    retry: 1,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        return;
      }

      await logout({
        refreshToken,
      });
    },

    onError: () => {
      toast.warning(
        "You were signed out locally, but the server session could not be closed.",
      );
    },

    onSettled: () => {
      clearSession();

      queryClient.clear();

      navigate("/login", {
        replace: true,
      });
    },
  });

  function handleSignOut() {
    if (logoutMutation.isPending) {
      return;
    }

    logoutMutation.mutate();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-4 sm:px-6">
      <div className="min-w-0">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="hidden lg:block">
          <WorkspaceSwitcher />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          disabled
        >
          <Bell className="size-4" />
        </Button>

        {currentUserQuery.isLoading && <UserMenuSkeleton />}

        {currentUserQuery.isError && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Unable to load user"
            title="Unable to load user. Click to retry."
            onClick={() => currentUserQuery.refetch()}
          >
            <CircleAlert className="size-4 text-destructive" />
          </Button>
        )}

        {currentUserQuery.data && (
          <UserMenu
            user={currentUserQuery.data}
            isSigningOut={logoutMutation.isPending}
            onSignOut={handleSignOut}
          />
        )}
      </div>
    </header>
  );
}
