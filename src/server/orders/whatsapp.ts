import { formatMoney } from "@/lib/money";
import type { AdminWhatsappNumber } from "@/types/admin.types";
import type { OrderDetail, WhatsappOrderLink } from "@/types/order.types";
import type { PublicSettings } from "@/types/settings.types";

// Compose the order message sent to the admin on WhatsApp.
function buildOrderMessage(order: OrderDetail, settings: PublicSettings): string {
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

  return lines.join("\n");
}

// Build a WhatsApp click-to-chat link (the wa.me deep link, no Business API
// needed) for every active admin number, each prefilled with the order details.
// Returns an empty array when no active numbers are configured.
export function buildOrderWhatsappLinks(
  order: OrderDetail,
  settings: PublicSettings,
  numbers: AdminWhatsappNumber[],
): WhatsappOrderLink[] {
  if (numbers.length === 0) {
    return [];
  }

  const text = encodeURIComponent(buildOrderMessage(order, settings));

  return numbers.map((number) => ({
    phone: number.phone,
    label: number.label,
    url: `https://wa.me/${number.phone}?text=${text}`,
  }));
}
