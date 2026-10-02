import {
  Building2,
  LayoutDashboard,
  MapPin,
  Users,
  UsersRound,
} from "lucide-react";
import {
  NavLink,
} from "react-router-dom";

import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    to: "/users",
    icon: Users,
  },
  {
    label: "Departments",
    to: "/departments",
    icon: Building2,
  },
  {
    label: "Teams",
    to: "/teams",
    icon: UsersRound,
  },
  {
    label: "Locations",
    to: "/locations",
    icon: MapPin,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigationItems.map(
          ({
            label,
            to,
            icon: Icon,
          }) => (
            <NavLink
              key={to}
              to={to}
              className={({
                isActive,
              }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />

              <span>
                {label}
              </span>
            </NavLink>
          ),
        )}
      </nav>

      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          DarmiHire
        </p>

        <p className="mt-1 text-[11px] text-muted-foreground">
          Modern hiring, powered by AI.
        </p>
      </div>
    </aside>
  );
}