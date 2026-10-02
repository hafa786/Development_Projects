import {
  Bell,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="lg:hidden">
        <Logo />
      </div>

      <div className="hidden lg:block">
        <p className="text-sm font-medium">
          DarmiHire Workspace
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="User menu"
        >
          <UserRound className="size-4" />
        </Button>
      </div>
    </header>
  );
}