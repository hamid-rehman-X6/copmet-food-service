import { formatMoney } from "@/lib/money";
import { env } from "@/server/config/env";
import type { OrderDetail } from "@/types/order.types";
import type { PublicSettings } from "@/types/settings.types";

// Build a WhatsApp click-to-chat URL that opens a chat with the admin number,
// prefilled with the full order details. Uses the wa.me deep link (works on
// mobile and web, no WhatsApp Business API required). Returns null when the
// admin number is not configured, so the caller can skip the hand-off cleanly.
export function buildOrderWhatsappUrl(order: OrderDetail, settings: PublicSettings): string | null {
  const number = env.adminWhatsapp;

  if (!number) {
    return null;
  }

  // Format money in the order's snapshot currency for an accurate record.
  const money = (amount: number) => formatMoney(amount, order.currencyCode, settings.currencyLocale);
  const cityLine = order.delivery.postalCode
    ? `${order.delivery.city}, ${order.delivery.postalCode}`
    : order.delivery.city;

  const lines = [
    `*New Frozen Order — ${order.reference}*`,
    "",
    `*Customer:* ${order.contact.firstName} ${order.contact.lastName}`,
    `*Email:* ${order.customer.email}`,
    order.contact.phone ? `*Phone:* ${order.contact.phone}` : null,
    "",
    "*Delivery Address:*",
    order.delivery.address,
    cityLine,
    order.delivery.instructions ? `*Instructions:* ${order.delivery.instructions}` : null,
    "",
    "*Items:*",
    ...order.items.map((item) => `• ${item.name} × ${item.quantity} — ${money(item.lineTotal)}`),
    "",
    `*Subtotal:* ${money(order.subtotal)}`,
    `*Delivery:* ${order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}`,
    `*Total:* ${money(order.total)}`,
  ].filter(Boolean);

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}
