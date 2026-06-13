export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  // ISO timestamp of the latest avatar upload, or null if the user has none.
  // The client uses it to build a cache-busting avatar URL.
  avatarUpdatedAt: string | null;
};
