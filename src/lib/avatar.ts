import type { AuthUser } from "@/types/auth.types";

// Build the avatar image URL for a user, or null if they have no avatar. The
// `avatarUpdatedAt` timestamp is used as a cache-buster so a freshly uploaded
// photo shows immediately while still allowing the response to be cached.
export function getAvatarUrl(user: Pick<AuthUser, "id" | "avatarUpdatedAt">): string | null {
  if (!user.avatarUpdatedAt) {
    return null;
  }

  return `/api/v1/users/${user.id}/avatar?v=${encodeURIComponent(user.avatarUpdatedAt)}`;
}

/** Two-letter initials for the fallback avatar when no image is set. */
export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
}
