import type { AuthUser } from "@/types/auth.types";

// The avatar image URL for a user, or null if they have no avatar. Avatars are
// hosted on Cloudinary; the version embedded in the URL changes on every upload,
// so the URL cache-busts itself.
export function getAvatarUrl(user: Pick<AuthUser, "avatarUrl">): string | null {
  return user.avatarUrl;
}

/** Two-letter initials for the fallback avatar when no image is set. */
export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
}
