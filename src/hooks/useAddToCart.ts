import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCartStore } from "@/stores/cart.store";
import type { CartProduct } from "@/types/checkout.types";

// Auth-aware add-to-cart. The item is always added (the cart persists across the
// login navigation), and guests are then routed to login with `next=/checkout`
// so that after signing in they land on checkout with the item they picked.
//
// While the session is still resolving we add without redirecting — the
// protected checkout route will prompt for login later if needed.
export function useAddToCart() {
  const { user, loading } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  return useCallback(
    (product: CartProduct) => {
      addItem(product);

      if (!loading && !user) {
        router.push("/login?next=/checkout");
      }
    },
    [user, loading, addItem, router],
  );
}
