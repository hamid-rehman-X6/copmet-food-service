import type { AdminNavItem } from "@/types/admin.types";

// Admin navigation. Metrics, dishes, customers, and orders are now served live
// from the API (see the admin dashboard, catalog, customers, and orders pages).
export const adminNavigation: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "home" },
  { label: "Frozen Catalog", href: "/admin/menu", icon: "utensils" },
  { label: "Customers", href: "/admin/customers", icon: "users" },
  { label: "Orders", href: "/admin/orders", icon: "receipt" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
