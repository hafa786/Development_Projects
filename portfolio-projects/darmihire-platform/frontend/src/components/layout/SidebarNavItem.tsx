import {
  NavLink,
} from "react-router-dom";

import { cn } from "@/lib/utils";
import type {
  NavigationItem,
} from "@/components/layout/navigation";

type SidebarNavItemProps = {
  item: NavigationItem;
};

export function SidebarNavItem({
  item,
}: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({
        isActive,
      }) =>
        cn(
          "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )
      }
    >
      {({
        isActive,
      }) => (
        <>
          <span
            className={cn(
              "absolute left-0 h-5 w-0.5 rounded-r-full bg-primary transition-opacity",
              isActive
                ? "opacity-100"
                : "opacity-0",
            )}
          />

          <Icon
            className={cn(
              "size-4 shrink-0 transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground",
            )}
            aria-hidden="true"
          />

          <span className="truncate">
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}