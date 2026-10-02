import { LogOut, Settings, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CurrentUser } from "@/features/auth/types";
import { getUserFullName, getUserInitials } from "@/features/auth/utils";

type UserMenuProps = {
  user: CurrentUser;
  isSigningOut: boolean;
  onSignOut: () => void;
};

export function UserMenu({ user, isSigningOut, onSignOut }: UserMenuProps) {
  const fullName = getUserFullName(user);

  const initials = getUserInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        aria-label="Open user menu"
      >
        <Avatar className="size-8">
          <AvatarFallback className="text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="hidden max-w-40 text-left sm:block">
          <p className="truncate text-sm font-medium leading-none">
            {fullName}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-9">
            <AvatarFallback className="text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{fullName}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <UserRound />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Settings />
          Account settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isSigningOut}
          onSelect={onSignOut}
        >
          <LogOut />

          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
