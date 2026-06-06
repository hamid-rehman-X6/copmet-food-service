import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Icon } from "@/components/common/Icon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Checkout | Copmet Food Service",
  description: "Review your frozen meal order and provide delivery details.",
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader loginTone="amber" />
      <main className="page-shell py-8 sm:py-12 lg:py-16">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 md:flex-row md:items-center lg:mb-16">
          <div>
            <h1 className="heading-font text-4xl font-bold tracking-tight sm:text-5xl">Finalize Your Freezer Order</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
              Review your frozen meal selection and tell us where to deliver it.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-raised px-5 py-3 text-sm font-semibold">
            <Icon className="h-5 w-5 text-tertiary" name="shield" />
            Cold-Packed Checkout
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <section className="lg:col-span-5">
            <OrderSummary />
          </section>
          <section className="lg:col-span-7">
            <CheckoutForm />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
