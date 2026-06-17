import type { Metadata } from "next";
import { OrderHistory } from "@/components/orders/OrderHistory";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "My Orders | Copmet Food Service",
  description: "Review your past frozen meal orders and their status.",
};

export default function OrdersPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8 sm:py-12 lg:py-16">
        <div className="mb-8 sm:mb-10">
          <h1 className="heading-font text-4xl font-bold tracking-tight sm:text-5xl">My Orders</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
            Track the status of your frozen meal orders, newest first.
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <OrderHistory />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
