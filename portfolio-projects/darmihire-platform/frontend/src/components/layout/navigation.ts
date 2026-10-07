import {
  Building2,
  CircleHelp,
  LayoutDashboard,
  MapPin,
  Users,
  UsersRound,
  type LucideIcon,
  BriefcaseBusiness
} from "lucide-react";

export type NavigationItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

export type NavigationSection = {
  label: string;
  items: NavigationItem[];
};

export const navigationSections:
  NavigationSection[] = [
    {
      label: "Workspace",

      items: [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },

    {
      label: "Organization",

      items: [
        {
          label: "Users",
          to: "/users",
          icon: Users,
          end: true,
        },
        {
          label: "Jobs",
          to: "/jobs",
          icon: BriefcaseBusiness,
          end: true,
        },
        {
          label: "Departments",
          to: "/departments",
          icon: Building2,
          end: true,
        },
        {
          label: "Teams",
          to: "/teams",
          icon: UsersRound,
          end: true,
        },
        {
          label: "Locations",
          to: "/locations",
          icon: MapPin,
          end: true,
        },
      ],
    },
  ];

export const supportNavigationItem:
  NavigationItem = {
    label: "Help & Support",
    to: "/support",
    icon: CircleHelp,
    end: true,
  };