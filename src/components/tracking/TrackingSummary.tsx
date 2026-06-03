import { trackingOrder } from "@/constants/tracking.constants";
import { formatCurrency } from "@/lib/formatters";

export function TrackingSummary() {
  return (
    <>
      <section className="rounded-2xl bg-muted p-8 md:p-12">
        <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.24em] text-muted-foreground">Order Summary</h2>
        <div className="space-y-5">
          {trackingOrder.items.map((item) => (
            <div className="flex justify-between gap-4 text-lg" key={item.name}>
              <span>{item.name}</span>
              <span className="font-bold">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
          <span>Order ID: {trackingOrder.id}</span>
          <button className="font-semibold text-primary">View Receipt</button>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground">?</span>
          <span className="text-muted-foreground">Something wrong?</span>
        </div>
        <button className="rounded-lg px-5 py-3 font-semibold text-primary transition-colors hover:bg-surface-low">
          Contact Support
        </button>
      </section>
    </>
  );
}
