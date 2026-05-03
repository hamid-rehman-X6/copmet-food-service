// Authentication entities for admin-only access.
export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}
