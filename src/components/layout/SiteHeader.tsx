"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { brandAssets, brandName, mainNavigation } from "@/constants/navigation";
import { getCartItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { useFavoritesStore } from "@/stores/favorites.store";
import { useAuth } from "@/components/auth/AuthProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Icon } from "@/components/common/Icon";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type SiteHeaderProps = {
  showSearch?: boolean;
  showCartLabel?: boolean;
  loginTone?: "primary" | "amber" | "ghost";
};

const loginLinkTones = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-container",
  amber: "bg-secondary-container text-secondary-container-foreground hover:brightness-95",
  ghost: "text-primary hover:bg-surface-low",
} as const;

export function SiteHeader({
  showSearch = false,
  showCartLabel = false,
  loginTone = "primary",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartItemCount = useCartStore((state) => getCartItemCount(state.items));
  const favoritesCount = useFavoritesStore((state) => state.items.length);
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    setMobileMenuOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <>
    <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/95 shadow-sm backdrop-blur sm:h-20">
      <nav className="page-shell flex h-full items-center justify-between gap-4">
        <Link className="flex shrink-0 items-center" href="/">
          <Image
            alt={brandAssets.logo.alt}
            className="h-8 w-auto sm:h-10 md:h-12"
            height={724}
            priority
            src={brandAssets.logo.src}
            width={2172}
          />
          <span className="sr-only">{brandName}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {mainNavigation.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                className={cn(
                  "text-sm text-muted-foreground transition-colors hover:text-primary",
                  active && "border-b-2 border-primary pb-1 text-primary",
                )}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {showSearch ? (
            <form
              action="/menu"
              className="hidden items-center gap-2 rounded-full border border-border bg-surface-low px-4 py-2 lg:flex"
            >
              <Icon className="h-4 w-4 text-muted-foreground" name="search" />
              <span className="sr-only">Search frozen catalog</span>
              <input
                className="w-44 bg-transparent text-sm outline-none placeholder:text-border-strong"
                name="search"
                placeholder="Find freezer meals..."
                type="search"
              />
            </form>
          ) : (
            <Link
              aria-label="Search frozen catalog"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-low"
              href="/menu"
            >
              <Icon className="h-5 w-5" name="search" />
            </Link>
          )}

          <ThemeToggle />

          <Link
            aria-label="View favorites"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-low"
            href="/favorites"
          >
            <Icon className="h-5 w-5" name="heart" />
            {favoritesCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {favoritesCount > 9 ? "9+" : favoritesCount}
              </span>
            ) : null}
          </Link>

          <button
            aria-label="View cart"
            className={cn(
              "relative inline-flex items-center justify-center gap-2 rounded-full transition-colors",
              showCartLabel
                ? "h-10 w-10 bg-primary text-primary-foreground hover:bg-primary-container sm:w-auto sm:px-5 sm:py-3"
                : "h-10 w-10 text-primary hover:bg-surface-low",
            )}
            onClick={() => setCartOpen(true)}
            type="button"
          >
            <Icon className="h-5 w-5" name="cart" />
            {showCartLabel ? <span className="hidden text-sm font-semibold sm:inline">Cart ({cartItemCount})</span> : null}
            {cartItemCount > 0 ? (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground",
                  showCartLabel && "sm:hidden",
                )}
              >
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            ) : null}
          </button>

          {user ? (
            <div className="hidden sm:block">
              <ProfileMenu onLogout={handleLogout} user={user} />
            </div>
          ) : (
            <Link
              className={cn(
                "hidden items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 sm:inline-flex",
                loginLinkTones[loginTone],
              )}
              href="/login"
            >
              Login
            </Link>
          )}

          <button
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-surface-low md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            <Icon className="h-5 w-5" name={mobileMenuOpen ? "x" : "menu"} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background py-3 shadow-[var(--shadow-soft)] md:hidden">
          <nav aria-label="Mobile navigation" className="page-shell flex flex-col gap-2">
            {mainNavigation.map((item) => (
              <Link
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-low hover:text-primary",
                  pathname === item.href && "bg-primary/10 text-primary",
                )}
                href={item.href}
                key={item.label}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-low hover:text-primary",
                    pathname === "/profile" && "bg-primary/10 text-primary",
                  )}
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" name="user" />
                  Profile
                </Link>
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-low hover:text-primary",
                    pathname === "/orders" && "bg-primary/10 text-primary",
                  )}
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" name="receipt" />
                  My Orders
                </Link>
                <button
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                  onClick={handleLogout}
                  type="button"
                >
                  <Icon className="h-5 w-5" name="logout" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>

    <CartDrawer onClose={() => setCartOpen(false)} open={cartOpen} />
    </>
  );
}
