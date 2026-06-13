"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { formatMoney } from "@/lib/money";
import type { PublicSettings } from "@/types/settings.types";

type CurrencyContextValue = {
  settings: PublicSettings;
  /** Format an amount in the store currency. */
  format: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// Settings are read once on the server (root layout) and passed in as the
// initial value, so the storefront formats money with the correct currency on
// first paint — no loading flash, no extra client request.
export function CurrencyProvider({
  settings,
  children,
}: Readonly<{ settings: PublicSettings; children: React.ReactNode }>) {
  const format = useCallback(
    (amount: number) => formatMoney(amount, settings.currencyCode, settings.currencyLocale),
    [settings.currencyCode, settings.currencyLocale],
  );

  const value = useMemo(() => ({ settings, format }), [settings, format]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider.");
  }

  return context;
}
