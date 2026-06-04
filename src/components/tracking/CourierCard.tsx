import Image from "next/image";
import { courier } from "@/constants/tracking.constants";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";

export function CourierCard() {
  return (
    <Card className="border border-surface-raised p-5 sm:p-8 md:p-12">
      <div className="mb-8 flex flex-col items-start gap-4 min-[400px]:flex-row min-[400px]:items-center sm:mb-10 sm:gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary sm:h-20 sm:w-20">
          <Image alt={courier.image.alt} className="object-cover" fill sizes="80px" src={courier.image.src} />
        </div>
        <div>
          <h2 className="heading-font text-2xl font-semibold sm:text-3xl">{courier.status}</h2>
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <Icon className="h-4 w-4 fill-secondary text-secondary" name="star" />
            {courier.rating} ({courier.orders} orders)
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Button className="rounded-xl py-4 text-base sm:py-5 sm:text-lg">
          <Icon className="h-5 w-5" name="phone" />
          Call {courier.name}
        </Button>
        <Button className="rounded-xl py-4 text-base sm:py-5 sm:text-lg" variant="secondary">
          <Icon className="h-5 w-5" name="message" />
          Message
        </Button>
      </div>
    </Card>
  );
}
