import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Icon } from "@/components/common/Icon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SecureCheckoutPage() {
  return (
    <>
      <SiteHeader loginTone="amber" />
      <main className="page-shell py-16">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="heading-font text-5xl font-bold tracking-tight">Finalize Your Order</h1>
            <p className="mt-2 text-lg text-muted-foreground">Review your selection and provide delivery details.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-raised px-5 py-3 text-sm font-semibold">
            <Icon className="h-5 w-5 text-tertiary" name="shield" />
            Safe & Secure
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <section className="order-2 lg:order-1 lg:col-span-5">
            <OrderSummary />
          </section>
          <section className="order-1 lg:order-2 lg:col-span-7">
            <CheckoutForm />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
