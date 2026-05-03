// WhatsApp message and URL builders for order actions.
import { env } from "@/lib/env";

interface BuildWhatsAppMessageParams {
  productName: string;
  variant: string;
  quantity: number;
  productUrl: string;
}

export function buildWhatsAppMessage({
  productName,
  variant,
  quantity,
  productUrl,
}: BuildWhatsAppMessageParams): string {
  return [
    "Hello Compet Food Service,",
    "",
    `I want to order: ${productName}`,
    `Variant/Size: ${variant}`,
    `Quantity: ${quantity}`,
    `Product link: ${productUrl}`,
  ].join("\n");
}

export function buildWhatsAppUrl(params: BuildWhatsAppMessageParams): string {
  const message = buildWhatsAppMessage(params);
  return `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
