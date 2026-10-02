import {
  SidebarNavItem,
} from "@/components/layout/SidebarNavItem";
import type {
  NavigationSection,
} from "@/components/layout/navigation";

type SidebarSectionProps = {
  section: NavigationSection;
};

export function SidebarSection({
  section,
}: SidebarSectionProps) {
  return (
    <section>
      <h2 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {section.label}
      </h2>

      <div className="space-y-1">
        {section.items.map(
          (item) => (
            <SidebarNavItem
              key={item.to}
              item={item}
            />
          ),
        )}
      </div>
    </section>
  );
}