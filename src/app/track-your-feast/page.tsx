import { ArrivalStatus } from "@/components/tracking/ArrivalStatus";
import { CourierCard } from "@/components/tracking/CourierCard";
import { TrackingMap } from "@/components/tracking/TrackingMap";
import { TrackingSummary } from "@/components/tracking/TrackingSummary";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function TrackYourFeastPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <ArrivalStatus />
            <TrackingMap />
          </div>
          <div className="space-y-8 lg:col-span-5">
            <CourierCard />
            <TrackingSummary />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
