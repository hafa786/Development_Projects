import {
  ExternalLink,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import {
  SidebarNavItem,
} from "@/components/layout/SidebarNavItem";
import {
  SidebarSection,
} from "@/components/layout/SidebarSection";
import {
  navigationSections,
  supportNavigationItem,
} from "@/components/layout/navigation";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background lg:flex lg:flex-col">
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Logo />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <nav
          className="flex-1 space-y-6 overflow-y-auto p-3"
          aria-label="Main navigation"
        >
          {navigationSections.map(
            (section) => (
              <SidebarSection
                key={section.label}
                section={section}
              />
            ),
          )}
        </nav>

        <div className="shrink-0 border-t p-3">
          <SidebarNavItem
            item={
              supportNavigationItem
            }
          />

          <div className="mt-3 rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">
              DarmiHire
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Modern hiring,
              powered by AI.
            </p>

            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>
                Phase 1
              </span>

              <span>
                •
              </span>

              <span>
                Core SaaS
              </span>

              <ExternalLink
                className="ml-auto size-3"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}