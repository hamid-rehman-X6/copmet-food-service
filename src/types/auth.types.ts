export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  // Cloudinary-hosted avatar URL, or null if the user has none. The version in
  // the URL changes on every upload, so it cache-busts itself.
  avatarUrl: string | null;
};
