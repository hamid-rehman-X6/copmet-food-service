// The cart starts empty; customers add real catalog products. Delivery pricing
// lives in admin-configurable store settings (see app_settings), so only the
// loyalty points rate remains a static constant here.
import type { CartItem } from "@/types/checkout.types";

export const initialCartItems: CartItem[] = [];

export const checkoutConfig = {
  pointsPerDollar: 1,
} as const;
