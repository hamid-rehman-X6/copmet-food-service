import Image from "next/image";
import { checkoutItems, checkoutTotals } from "@/constants/checkout.constants";
import { formatCurrency } from "@/lib/formatters";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";

export function OrderSummary() {
  return (
    <Card className="p-6 lg:sticky lg:top-28">
      <h2 className="heading-font mb-6 text-2xl font-semibold">Order Summary</h2>
      <div className="space-y-6">
        {checkoutItems.map((item) => (
          <article className="flex gap-4" key={item.id}>
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
              <Image alt={item.image.alt} className="object-cover" fill sizes="96px" src={item.image.src} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <span className="text-sm">{formatCurrency(item.price)}</span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{item.detail}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-border bg-surface-low px-1 py-1">
                  <button aria-label={`Decrease ${item.name}`} className="grid h-8 w-8 place-items-center text-muted-foreground">
                    <Icon className="h-4 w-4" name="minus" />
                  </button>
                  <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                  <button aria-label={`Increase ${item.name}`} className="grid h-8 w-8 place-items-center text-muted-foreground">
                    <Icon className="h-4 w-4" name="plus" />
                  </button>
                </div>
                <button className="text-xs font-semibold text-error">Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 space-y-3 border-t border-border pt-8">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(checkoutTotals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Delivery Fee</span>
          <span>{formatCurrency(checkoutTotals.deliveryFee)}</span>
        </div>
        <div className="heading-font flex justify-between pt-2 text-2xl font-semibold">
          <span>Total</span>
          <span>{formatCurrency(checkoutTotals.total)}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-lg bg-success-soft p-4 text-success-soft-foreground">
        <Icon className="h-5 w-5" name="gift" />
        <span className="text-xs font-semibold">You&apos;re earning {checkoutTotals.points} Gather Points with this order!</span>
      </div>
    </Card>
  );
}
