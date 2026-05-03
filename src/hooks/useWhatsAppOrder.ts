// Hook that prepares WhatsApp order links for a selected product.
"use client";

import { useMemo } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface UseWhatsAppOrderParams {
  productName: string;
  variant: string;
  quantity: number;
  productUrl: string;
}

export function useWhatsAppOrder(params: UseWhatsAppOrderParams) {
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(params), [params]);
  return { whatsappUrl };
}
