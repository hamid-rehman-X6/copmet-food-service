import { Icon } from "@/components/common/Icon";

export function TrackingMap() {
  return (
    <section className="map-grid relative h-80 overflow-hidden rounded-2xl border border-surface-raised bg-surface-low shadow-[var(--shadow-soft)] sm:h-[420px]">
      <div className="absolute inset-y-0 left-1/4 w-1/2 rounded-[40px] border-x-[18px] border-card/70 bg-background/45 shadow-[inset_0_0_30px_rgba(86,66,60,0.08)]" />
      <div className="map-route absolute left-[34%] top-[28%] h-44 w-24" />
      <Icon className="absolute left-[32%] top-[25%] h-7 w-7 fill-primary text-primary" name="location" />
      <Icon className="absolute bottom-[30%] right-[29%] h-6 w-6 fill-tertiary text-tertiary" name="home" />
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 sm:bottom-6 sm:right-6 sm:gap-3">
        <button aria-label="Zoom in" className="grid h-12 w-12 place-items-center rounded-lg bg-card shadow-sm">
          <Icon className="h-5 w-5" name="plus" />
        </button>
        <button aria-label="Zoom out" className="grid h-12 w-12 place-items-center rounded-lg bg-card shadow-sm">
          <Icon className="h-5 w-5" name="minus" />
        </button>
      </div>
    </section>
  );
}
