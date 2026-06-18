"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getOrderTotals } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { FreeDeliveryNudge } from "@/components/cart/FreeDeliveryNudge";
import { Icon } from "@/components/common/Icon";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

// Slide-over mini-cart: review and adjust items, then head to checkout — without
// leaving the current page. Opened from the header cart icon.
export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { format, settings } = useCurrency();
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = getOrderTotals(items, settings);

  // Lock body scroll and close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Always mounted so the panel can animate both in and out. When closed it is
  // off-screen, transparent, non-interactive (pointer-events-none), and removed
  // from the a11y/focus order (aria-hidden + inert).
  return (
    <div
      aria-hidden={!open}
      className={cn("fixed inset-0 z-[90]", open ? "pointer-events-auto" : "pointer-events-none")}
      inert={!open}
    >
      <button
        aria-label="Close cart"
        className={cn(
          "absolute inset-0 bg-inverse/40 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        type="button"
      />

      <aside
        aria-label="Shopping cart"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-[var(--shadow-lift)] transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4">
          <h2 className="heading-font text-xl font-semibold">Your Cart</h2>
          <button
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-surface-low hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <Icon className="h-5 w-5" name="x" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Icon className="h-12 w-12 text-border-strong" name="cart" />
            <h3 className="heading-font mt-4 text-lg font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add freezer-ready meals to get started.</p>
            <Link
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
              href="/menu"
              onClick={onClose}
            >
              Browse the Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <article className="flex gap-3" key={item.id}>
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image alt={item.image.alt} className="object-cover" fill sizes="64px" src={item.image.src} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                      <span className="whitespace-nowrap text-sm font-semibold">{format(item.price * item.quantity)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border bg-surface-low px-1 py-0.5">
                        <button
                          aria-label={`Decrease ${item.name}`}
                          className="grid h-7 w-7 place-items-center text-muted-foreground transition-colors hover:text-primary disabled:opacity-35"
                          disabled={item.quantity === 1}
                          onClick={() => decreaseQuantity(item.id)}
                          type="button"
                        >
                          <Icon className="h-4 w-4" name="minus" />
                        </button>
                        <span className="min-w-7 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          aria-label={`Increase ${item.name}`}
                          className="grid h-7 w-7 place-items-center text-muted-foreground transition-colors hover:text-primary"
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

            <div className="border-t border-border/60 px-5 py-5">
              <div className="mb-4">
                <FreeDeliveryNudge subtotal={totals.subtotal} />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="heading-font text-xl font-bold">{format(totals.subtotal)}</span>
              </div>
              <Link
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
                href="/checkout"
                onClick={onClose}
              >
                Go to Checkout
                <Icon className="h-4 w-4" name="arrowRight" />
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
