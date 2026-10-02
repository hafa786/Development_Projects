import type {
  CurrentUser,
} from "@/features/auth/types";

export function getUserFullName(
  user: CurrentUser,
): string {
  return [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getUserInitials(
  user: CurrentUser,
): string {
  const firstInitial =
    user.firstName
      ?.trim()
      .charAt(0)
      .toUpperCase() ?? "";

  const lastInitial =
    user.lastName
      ?.trim()
      .charAt(0)
      .toUpperCase() ?? "";

  const initials =
    `${firstInitial}${lastInitial}`;

  if (initials) {
    return initials;
  }

  return user.email
    .charAt(0)
    .toUpperCase();
}