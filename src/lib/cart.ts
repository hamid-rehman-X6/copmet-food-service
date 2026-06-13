import { checkoutConfig } from "@/constants/checkout.constants";
import type { CartItem, OrderTotals } from "@/types/checkout.types";

// Delivery pricing now comes from store settings (admin-configurable) rather
// than hardcoded values, so it is passed in by the caller.
export type DeliveryConfig = {
  deliveryFee: number;
  freeDeliveryThreshold: number;
};

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getOrderTotals(items: CartItem[], delivery: DeliveryConfig): OrderTotals {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee =
    items.length === 0 || subtotal >= delivery.freeDeliveryThreshold ? 0 : delivery.deliveryFee;
  const total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
    points: Math.floor(total * checkoutConfig.pointsPerDollar),
  };
}
