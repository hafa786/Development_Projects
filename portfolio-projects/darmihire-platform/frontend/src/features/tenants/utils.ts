import type {
  TenantRole,
  UserTenant,
} from "@/features/tenants/types";

export function findSelectedTenant(
  tenants: UserTenant[],
  tenantId: string | null,
): UserTenant | undefined {
  if (!tenantId) {
    return undefined;
  }

  return tenants.find(
    (tenant) =>
      tenant.id === tenantId,
  );
}

export function formatTenantRole(
  role: TenantRole,
): string {
  switch (role) {
    case "COMPANY_ADMIN":
      return "Company Admin";

    case "RECRUITER":
      return "Recruiter";

    case "HIRING_MANAGER":
      return "Hiring Manager";

    case "INTERVIEWER":
      return "Interviewer";

    case "VIEWER":
      return "Viewer";

    default:
      return role;
  }
}

export function getTenantInitials(
  name: string,
): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "W";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[1].charAt(0)
  ).toUpperCase();
}

export function createSlug(
  value: string,
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}