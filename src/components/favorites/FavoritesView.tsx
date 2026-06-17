"use client";

import Link from "next/link";
import { useFavoritesStore } from "@/stores/favorites.store";
import { MenuCard } from "@/components/menu/MenuCard";
import { Icon } from "@/components/common/Icon";

// Renders the customer's saved (hearted) products, reusing the menu card so they
// can adjust quantity and add to cart straight from their wishlist.
export function FavoritesView() {
  const items = useFavoritesStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface-low px-6 py-16 text-center">
        <Icon className="mx-auto h-10 w-10 text-border-strong" name="heart" />
        <h2 className="heading-font mt-4 text-xl font-semibold">No favorites yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap the heart on any frozen meal to save it here for quick access later.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
          href="/menu"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {items.map((product) => (
        <MenuCard key={product.id} product={product} />
      ))}
    </div>
  );
}
