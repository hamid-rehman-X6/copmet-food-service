"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminNavigation } from "@/constants/admin.constants";
import { brandAssets, brandName } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Icon } from "@/components/common/Icon";

type AdminSidebarProps = {
  pathname: string;
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ pathname, open, onClose }: AdminSidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    onClose();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <button
        aria-label="Close admin navigation"
        className={cn("fixed inset-0 z-40 bg-inverse/30 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")}
        onClick={onClose}
        type="button"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-surface-low px-5 py-6 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <Link className="flex min-w-0 items-center gap-3" href="/admin" onClick={onClose}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Icon className="h-6 w-6" name="utensils" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold text-primary">Admin Panel</span>
              <span className="block truncate text-xs text-muted-foreground">{brandName}</span>
            </span>
          </Link>
          <button aria-label="Close navigation" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-surface-highest lg:hidden" onClick={onClose} type="button">
            <Icon className="h-5 w-5" name="x" />
          </button>
        </div>

        <nav aria-label="Admin navigation" className="mt-10 flex flex-col gap-2">
          {adminNavigation.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-highest hover:text-primary",
                  active && "bg-secondary-container text-secondary-container-foreground shadow-sm hover:bg-secondary-container hover:text-secondary-container-foreground",
                )}
                href={item.href}
                key={item.href}
                onClick={onClose}
              >
                <Icon className="h-5 w-5 shrink-0" name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-border pt-5">
          <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-surface-highest hover:text-primary" href="/" onClick={onClose}>
            <Icon className="h-5 w-5" name="helpCircle" />
            Support
          </Link>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-surface-highest hover:text-primary" onClick={handleLogout} type="button">
            <Icon className="h-5 w-5 rotate-180" name="arrowRight" />
            Log Out
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-card p-3 shadow-sm">
          <Image alt={brandAssets.logo.alt} className="h-8 w-auto" height={724} src={brandAssets.logo.src} width={2172} />
        </div>
      </aside>
    </>
  );
}
