"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { placeOrderSchema } from "@/schemas/order.schemas";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { getOrderTotals } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { OrderDetail } from "@/types/order.types";

const initialForm = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  instructions: "",
};

const inputClass = "w-full rounded-lg border border-border bg-surface-low px-4 py-3 outline-none focus:border-primary";

export function CheckoutForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { settings, format } = useCurrency();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totals = getOrderTotals(items, settings);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderDetail | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Customers must be signed in to attach the order to their account.
    if (!user) {
      router.push(`/login?next=${encodeURIComponent("/checkout")}`);
      return;
    }

    const parsed = placeOrderSchema.safeParse({
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      contact: { firstName: form.firstName, lastName: form.lastName, phone: form.phone || undefined },
      delivery: {
        address: form.address,
        city: form.city,
        postalCode: form.postalCode || undefined,
        instructions: form.instructions || undefined,
      },
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please complete the delivery details.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiRequest<{ order: OrderDetail }>("/api/v1/orders", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      clearCart();
      setPlacedOrder(response.data.order);
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to place your order right now.");
    } finally {
      setSubmitting(false);
    }
  }

  // Post-checkout confirmation.
  if (placedOrder) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)] sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success-soft-foreground">
          <Icon className="h-8 w-8" name="check" />
        </span>
        <h2 className="heading-font mt-5 text-2xl font-semibold sm:text-3xl">Order Confirmed!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you, {placedOrder.contact.firstName}. Your frozen order{" "}
          <span className="font-semibold text-foreground">{placedOrder.reference}</span> is being prepared.
        </p>
        <p className="heading-font mt-4 text-3xl font-bold text-primary">{format(placedOrder.total)}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
            href="/menu"
          >
            Continue Shopping
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-low"
            href="/track-order"
          >
            Track Order
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form className="space-y-8 sm:space-y-10" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2 text-primary">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
          <span className="hidden text-sm font-semibold min-[360px]:inline">Frozen Delivery</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-border text-sm">2</span>
          <span className="hidden text-sm font-semibold min-[360px]:inline">Payment</span>
        </div>
      </div>

      {!authLoading && !user ? (
        <div className="flex items-center gap-3 rounded-xl border border-secondary-container bg-secondary-container/40 px-5 py-4 text-sm text-secondary-container-foreground">
          <Icon className="h-5 w-5 shrink-0" name="user" />
          <span>
            Please{" "}
            <Link className="font-semibold underline" href={`/login?next=${encodeURIComponent("/checkout")}`}>
              sign in
            </Link>{" "}
            to place your frozen order.
          </span>
        </div>
      ) : null}

      <AuthFormAlert message={error} />

      <div>
        <h2 className="heading-font mb-5 text-2xl font-semibold sm:mb-6 sm:text-3xl">Frozen Delivery Details</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-muted-foreground">First Name</span>
            <input className={inputClass} onChange={(event) => update("firstName", event.target.value)} placeholder="Enter first name" value={form.firstName} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-muted-foreground">Last Name</span>
            <input className={inputClass} onChange={(event) => update("lastName", event.target.value)} placeholder="Enter last name" value={form.lastName} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-muted-foreground">Frozen Meal Delivery Address</span>
            <input className={inputClass} onChange={(event) => update("address", event.target.value)} placeholder="Street address, apartment, suite" value={form.address} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-muted-foreground">City</span>
            <input className={inputClass} onChange={(event) => update("city", event.target.value)} placeholder="City" value={form.city} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-muted-foreground">Postal Code</span>
            <input className={inputClass} onChange={(event) => update("postalCode", event.target.value)} placeholder="ZIP/Postal code" value={form.postalCode} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-muted-foreground">Phone (Optional)</span>
            <input className={inputClass} onChange={(event) => update("phone", event.target.value)} placeholder="Contact number for delivery" value={form.phone} />
          </label>
        </div>
        <label className="mt-5 block space-y-2">
          <span className="text-sm font-semibold text-muted-foreground">Frozen Delivery Instructions (Optional)</span>
          <textarea
            className="min-h-24 w-full rounded-lg border border-border bg-surface-low px-4 py-3 outline-none focus:border-primary"
            onChange={(event) => update("instructions", event.target.value)}
            placeholder="e.g. Leave with reception, call on arrival, gate code 1234..."
            value={form.instructions}
          />
        </label>
      </div>

      <div className="border-t border-border pt-10">
        <h2 className="heading-font mb-5 text-2xl font-semibold sm:mb-6 sm:text-3xl">Payment Method</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 p-4 sm:gap-4 sm:p-5">
            <input checked className="sr-only" name="payment" readOnly type="radio" />
            <Icon className="h-5 w-5 text-primary" name="card" />
            <span className="text-sm font-semibold">Cash / Card on Delivery</span>
            <Icon className="ml-auto h-5 w-5 text-primary" name="check" />
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted p-4 text-muted-foreground sm:gap-4 sm:p-5">
            <input className="sr-only" name="payment" type="radio" />
            <Icon className="h-5 w-5" name="wallet" />
            <span className="text-sm font-semibold">Digital Wallet</span>
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Online card payment is coming soon. Orders are confirmed on delivery for now.</p>
      </div>

      <div>
        <Button className={cn("w-full rounded-full py-4 text-base sm:py-5 sm:text-lg")} disabled={items.length === 0 || submitting} type="submit" variant="amber">
          {submitting
            ? "Placing Order..."
            : items.length === 0
              ? "Add Frozen Meals to Continue"
              : `Place Frozen Order - ${format(totals.total)}`}
        </Button>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          By placing your order, you agree to our <Link className="underline" href="/terms">Terms of Service</Link> and{" "}
          <Link className="underline" href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}
