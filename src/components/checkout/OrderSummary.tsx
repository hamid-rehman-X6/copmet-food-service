"use client";

import Image from "next/image";
import Link from "next/link";
import { getOrderTotals } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import { useCartStore } from "@/stores/cart.store";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";

export function OrderSummary() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totals = getOrderTotals(items);

  return (
    <Card className="p-4 sm:p-6 lg:sticky lg:top-28">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="heading-font text-xl font-semibold sm:text-2xl">Order Summary</h2>
        {items.length > 0 ? (
          <button className="text-xs font-semibold text-error hover:underline" onClick={clearCart} type="button">
            Remove All
          </button>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className="space-y-6">
          {items.map((item) => (
            <article className="flex gap-3 sm:gap-4" key={item.id}>
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                <Image alt={item.image.alt} className="object-cover" fill sizes="96px" src={item.image.src} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 min-[400px]:flex-row min-[400px]:items-start min-[400px]:justify-between min-[400px]:gap-3">
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <span className="whitespace-nowrap text-sm">{formatCurrency(item.price * item.quantity)}</span>
                </div>
                <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">{item.detail}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-full border border-border bg-surface-low px-1 py-1">
                    <button
                      aria-label={`Decrease ${item.name}`}
                      className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                      disabled={item.quantity === 1}
                      onClick={() => decreaseQuantity(item.id)}
                      type="button"
                    >
                      <Icon className="h-4 w-4" name="minus" />
                    </button>
                    <span className="min-w-8 px-2 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.name}`}
                      className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => increaseQuantity(item.id)}
                      type="button"
                    >
                      <Icon className="h-4 w-4" name="plus" />
                    </button>
                  </div>
                  <button
                    className="text-xs font-semibold text-error hover:underline"
                    onClick={() => removeItem(item.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-surface-low px-5 py-10 text-center">
          <Icon className="mx-auto h-10 w-10 text-border-strong" name="cart" />
          <h3 className="heading-font mt-4 text-xl font-semibold">Your cart is empty</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add something delicious from the menu.</p>
          <Link
            className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
            href="/menu"
          >
            Browse Menu
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-3 border-t border-border pt-8">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Delivery Fee</span>
          <span>{totals.deliveryFee === 0 && items.length > 0 ? "Free" : formatCurrency(totals.deliveryFee)}</span>
        </div>
        <div className="heading-font flex justify-between pt-2 text-2xl font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-success-soft p-4 text-success-soft-foreground">
          <Icon className="h-5 w-5" name="gift" />
          <span className="text-xs font-semibold">
            You&apos;re earning {totals.points} Copmet Points with this order!
          </span>
        </div>
      ) : null}
    </Card>
  );
}
