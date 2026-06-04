"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandAssets, brandName, mainNavigation } from "@/constants/navigation";
import { getCartItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { Icon } from "@/components/common/Icon";

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
  const cartItemCount = useCartStore((state) => getCartItemCount(state.items));

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-border/50 bg-background/95 shadow-sm backdrop-blur">
      <nav className="page-shell flex h-full items-center justify-between gap-4">
        <Link className="flex shrink-0 items-center" href="/">
          <Image
            alt={brandAssets.logo.alt}
            className="h-10 w-auto md:h-12"
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

        <div className="flex items-center gap-2 sm:gap-3">
          {showSearch ? (
            <form
              action="/menu"
              className="hidden items-center gap-2 rounded-full border border-border bg-surface-low px-4 py-2 lg:flex"
            >
              <Icon className="h-4 w-4 text-muted-foreground" name="search" />
              <span className="sr-only">Search menu</span>
              <input
                className="w-44 bg-transparent text-sm outline-none placeholder:text-border-strong"
                name="search"
                placeholder="Find your favorites..."
                type="search"
              />
            </form>
          ) : (
            <Link
              aria-label="Search menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-low"
              href="/menu"
            >
              <Icon className="h-5 w-5" name="search" />
            </Link>
          )}

          <Link
            aria-label="View cart"
            className={cn(
              "relative inline-flex items-center justify-center gap-2 rounded-full text-primary transition-colors hover:bg-surface-low",
              showCartLabel ? "bg-primary px-5 py-3 text-primary-foreground hover:bg-primary-container" : "h-10 w-10",
            )}
            href="/checkout"
          >
            <Icon className="h-5 w-5" name="cart" />
            {showCartLabel ? <span className="text-sm font-semibold">Cart ({cartItemCount})</span> : null}
            {!showCartLabel && cartItemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            ) : null}
          </Link>

          <Link
            className={cn(
              "hidden items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 sm:inline-flex",
              loginLinkTones[loginTone],
            )}
            href="/login"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
