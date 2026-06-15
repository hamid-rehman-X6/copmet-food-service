"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSkeleton } from "@/components/checkout/CheckoutSkeleton";
import { OrderSummary } from "@/components/checkout/OrderSummary";

// Checkout is a protected route: only signed-in customers can place an order.
// RequireAuth resolves the session, redirecting guests to login with a `next`
// pointing back here so they return to their cart after signing in.
export function CheckoutView() {
  return (
    <RequireAuth fallback={<CheckoutSkeleton />}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <section className="lg:col-span-5">
          <OrderSummary />
        </section>
        <section className="lg:col-span-7">
          <CheckoutForm />
        </section>
      </div>
    </RequireAuth>
  );
}
