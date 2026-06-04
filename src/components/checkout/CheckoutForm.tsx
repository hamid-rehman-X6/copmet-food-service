"use client";

import Link from "next/link";
import { deliveryFields } from "@/constants/checkout.constants";
import { getOrderTotals } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";

export function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const totals = getOrderTotals(items);

  return (
    <section className="space-y-10">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-primary">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            1
          </span>
          <span className="text-sm font-semibold">Delivery</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-border text-sm">2</span>
          <span className="text-sm font-semibold">Payment</span>
        </div>
      </div>

      <div>
        <h2 className="heading-font mb-6 text-3xl font-semibold">Delivery Details</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {deliveryFields.map((field) => (
            <label className={cn("space-y-2", field.span === "full" && "md:col-span-2")} key={field.id}>
              <span className="text-sm font-semibold text-muted-foreground">{field.label}</span>
              <input
                className="w-full rounded-lg border border-border bg-surface-low px-4 py-3 outline-none focus:border-primary"
                placeholder={field.placeholder}
                type={field.type ?? "text"}
              />
            </label>
          ))}
        </div>
        <label className="mt-5 block space-y-2">
          <span className="text-sm font-semibold text-muted-foreground">Delivery Instructions (Optional)</span>
          <textarea
            className="min-h-24 w-full rounded-lg border border-border bg-surface-low px-4 py-3 outline-none focus:border-primary"
            placeholder="e.g. Leave by the side door, gate code 1234..."
          />
        </label>
      </div>

      <div className="border-t border-border pt-10">
        <h2 className="heading-font mb-6 text-3xl font-semibold">Payment Method</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-primary bg-primary/5 p-5">
            <input checked className="sr-only" name="payment" readOnly type="radio" />
            <Icon className="h-5 w-5 text-primary" name="card" />
            <span className="text-sm font-semibold">Credit / Debit Card</span>
            <Icon className="ml-auto h-5 w-5 text-primary" name="check" />
          </label>
          <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-muted p-5 text-muted-foreground">
            <input className="sr-only" name="payment" type="radio" />
            <Icon className="h-5 w-5" name="wallet" />
            <span className="text-sm font-semibold">Digital Wallet</span>
          </label>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-surface-low p-6">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-muted-foreground">Card Number</span>
            <span className="relative block">
              <input
                className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-12 outline-none focus:border-primary"
                placeholder="0000 0000 0000 0000"
                type="text"
              />
              <Icon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-border-strong" name="card" />
            </span>
          </label>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-muted-foreground">Expiry Date</span>
              <input className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:border-primary" placeholder="MM/YY" type="text" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-muted-foreground">CVC</span>
              <input className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:border-primary" placeholder="123" type="text" />
            </label>
          </div>
        </div>
      </div>

      <div>
        <Button className="w-full rounded-full py-5 text-lg" disabled={items.length === 0} type="submit" variant="amber">
          {items.length === 0 ? "Add Items to Continue" : `Place Order - ${formatCurrency(totals.total)}`}
        </Button>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          By placing your order, you agree to our <Link className="underline" href="/">Terms of Service</Link> and{" "}
          <Link className="underline" href="/">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
