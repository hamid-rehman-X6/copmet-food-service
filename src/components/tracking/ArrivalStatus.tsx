import Image from "next/image";
import { deliveryBike, trackingOrder, trackingSteps } from "@/constants/tracking.constants";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";

const stepIcon = {
  utensils: "utensils",
  bike: "truck",
  check: "check",
} as const;

export function ArrivalStatus() {
  return (
    <Card className="overflow-hidden border border-surface-raised p-5 sm:p-8 md:p-12">
      <div className="mb-10 flex items-center justify-between gap-4 sm:mb-14">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-muted-foreground">Estimated arrival</p>
          <h1 className="heading-font text-4xl font-bold text-primary sm:text-6xl">{trackingOrder.arrival}</h1>
        </div>
        <div className="relative h-20 w-20 shrink-0 animate-[float_3s_ease-in-out_infinite] sm:h-32 sm:w-32">
          <Image alt={deliveryBike.alt} className="object-contain" fill sizes="128px" src={deliveryBike.src} />
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 right-6 top-5 h-1 rounded-full bg-surface-highest">
          <div className="h-full w-[48%] rounded-full bg-tertiary" />
        </div>
        <div className="relative z-10 flex justify-between">
          {trackingSteps.map((step) => (
            <div className="flex flex-col items-center text-center" key={step.label}>
              <div
                className={cn(
                  "mb-3 grid h-11 w-11 place-items-center rounded-full bg-surface-highest text-muted-foreground",
                  step.state === "complete" && "bg-tertiary-container text-tertiary-container-foreground",
                  step.state === "active" && "bg-secondary-container text-secondary-container-foreground",
                )}
              >
                <Icon className="h-5 w-5" name={stepIcon[step.icon]} />
              </div>
              <span
                className={cn(
                  "text-xs font-bold text-muted-foreground sm:text-sm",
                  step.state === "complete" && "text-tertiary",
                  step.state === "active" && "text-secondary",
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
