export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
};
