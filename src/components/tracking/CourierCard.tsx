import Image from "next/image";
import { courier } from "@/constants/tracking.constants";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";

export function CourierCard() {
  return (
    <Card className="border border-surface-raised p-8 md:p-12">
      <div className="mb-10 flex items-center gap-5">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary">
          <Image alt={courier.image.alt} className="object-cover" fill sizes="80px" src={courier.image.src} />
        </div>
        <div>
          <h2 className="heading-font text-3xl font-semibold">{courier.status}</h2>
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <Icon className="h-4 w-4 fill-secondary text-secondary" name="star" />
            {courier.rating} ({courier.orders} orders)
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Button className="rounded-xl py-5 text-lg">
          <Icon className="h-5 w-5" name="phone" />
          Call {courier.name}
        </Button>
        <Button className="rounded-xl py-5 text-lg" variant="secondary">
          <Icon className="h-5 w-5" name="message" />
          Message
        </Button>
      </div>
    </Card>
  );
}
