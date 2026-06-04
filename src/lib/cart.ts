import { checkoutConfig } from "@/constants/checkout.constants";
import type { CartItem, OrderTotals } from "@/types/checkout.types";

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getOrderTotals(items: CartItem[]): OrderTotals {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee =
    items.length === 0 || subtotal >= checkoutConfig.freeDeliveryThreshold ? 0 : checkoutConfig.deliveryFee;
  const total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
    points: Math.floor(total * checkoutConfig.pointsPerDollar),
  };
}
