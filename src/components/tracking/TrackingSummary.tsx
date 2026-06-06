import { trackingOrder } from "@/constants/tracking.constants";
import { formatCurrency } from "@/lib/formatters";

export function TrackingSummary() {
  return (
    <>
      <section className="rounded-2xl bg-muted p-5 sm:p-8 md:p-12">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.24em] text-muted-foreground sm:mb-8">Frozen Order Summary</h2>
        <div className="space-y-5">
          {trackingOrder.items.map((item) => (
            <div className="flex justify-between gap-4 text-sm sm:text-lg" key={item.name}>
              <span>{item.name}</span>
              <span className="font-bold">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
          <span>Order ID: {trackingOrder.id}</span>
          <button className="font-semibold text-primary">View Receipt</button>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground">?</span>
          <span className="text-muted-foreground">Issue with your frozen order?</span>
        </div>
        <button className="w-full rounded-lg px-5 py-3 font-semibold text-primary transition-colors hover:bg-surface-low sm:w-auto">
          Contact Support
        </button>
      </section>
    </>
  );
}
