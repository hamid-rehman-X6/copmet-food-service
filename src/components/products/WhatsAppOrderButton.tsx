// Product-level WhatsApp order action component.
"use client";

import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppOrderButtonProps {
  productName: string;
  variant: string;
  quantity: number;
  productUrl: string;
}

export function WhatsAppOrderButton({
  productName,
  variant,
  quantity,
  productUrl,
}: WhatsAppOrderButtonProps) {
  const href = buildWhatsAppUrl({ productName, variant, quantity, productUrl });
  return (
    <a href={href} rel="noreferrer" target="_blank">
      <Button className="w-full">Order on WhatsApp</Button>
    </a>
  );
}
