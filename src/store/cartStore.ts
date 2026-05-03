// Global client cart intent store for future checkout expansion.
"use client";

import { create } from "zustand";

interface CartState {
  productIds: string[];
  addProduct: (id: string) => void;
  removeProduct: (id: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  productIds: [],
  addProduct: (id) =>
    set((state) => ({
      productIds: state.productIds.includes(id)
        ? state.productIds
        : [...state.productIds, id],
    })),
  removeProduct: (id) =>
    set((state) => ({
      productIds: state.productIds.filter((item) => item !== id),
    })),
}));
