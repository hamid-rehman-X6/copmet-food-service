// Admin sidebar navigation from centralized route config.
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { label: "Dashboard", href: ROUTES.adminDashboard },
  { label: "Products", href: ROUTES.adminProducts },
  { label: "Categories", href: ROUTES.adminCategories },
  { label: "Orders", href: ROUTES.adminOrders },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-[var(--color-hairline)] bg-white p-4">
      <h2 className="mb-4 text-base font-semibold">Admin Panel</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link className="block rounded px-3 py-2 text-sm hover:bg-[var(--color-surface-soft)]" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
