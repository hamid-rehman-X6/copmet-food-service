"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartProduct } from "@/types/checkout.types";

type CartStore = {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      // New carts start empty; items the customer adds persist to localStorage.
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const addedQuantity = Math.max(1, Math.floor(quantity));
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + addedQuantity } : item,
              ),
            };
          }

          return { items: [...state.items, { ...product, quantity: addedQuantity }] };
        }),
      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
        })),
      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
          ),
        })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "copmet-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
