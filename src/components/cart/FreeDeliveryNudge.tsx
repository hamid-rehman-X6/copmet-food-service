"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";
import { Icon } from "@/components/common/Icon";

// Encourages larger orders by showing how close the cart is to free delivery,
// or congratulating the customer once they've crossed the threshold. Reads the
// admin-configured threshold from store settings.
export function FreeDeliveryNudge({ subtotal }: { subtotal: number }) {
  const { settings, format } = useCurrency();
  const threshold = settings.freeDeliveryThreshold;

  // Nothing to nudge toward if free delivery isn't gated, or the cart is empty.
  if (threshold <= 0 || subtotal <= 0) {
    return null;
  }

  const unlocked = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="rounded-xl border border-border/60 bg-surface-low p-3">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <Icon className={`h-4 w-4 shrink-0 ${unlocked ? "text-tertiary" : "text-secondary"}`} name="truck" />
        {unlocked ? (
          <span className="text-tertiary">You&apos;ve unlocked free delivery!</span>
        ) : (
          <span>
            Add <span className="text-primary">{format(remaining)}</span> more for free delivery
          </span>
        )}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all ${unlocked ? "bg-tertiary" : "bg-secondary"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
