"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicProduct } from "@/types/catalog.types";

// Wishlist of products the customer has hearted. Full product snapshots are
// stored (not just ids) so the favorites page can render without an extra API
// call; "Add to cart" still recomputes prices server-side at checkout.
type FavoritesStore = {
  items: PublicProduct[];
  toggle: (product: PublicProduct) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      items: [],
      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          return {
            items: exists
              ? state.items.filter((item) => item.id !== product.id)
              : [...state.items, product],
          };
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "copmet-favorites",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
