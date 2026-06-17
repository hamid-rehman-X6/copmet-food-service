"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatDateTime } from "@/lib/formatters";
import { orderStatusLabels, orderStatusTones } from "@/constants/order.constants";
import { useCartStore } from "@/stores/cart.store";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { Skeleton } from "@/components/common/Skeleton";
import type { CartProduct } from "@/types/checkout.types";
import type { OrderDetail } from "@/types/order.types";

type CustomerOrderModalProps = {
  orderId: string;
  onClose: () => void;
};

const rowClass = "flex items-center justify-between gap-4 text-sm";

// Read-only order detail for customers: items, totals, and delivery snapshot,
// plus a one-tap "Order again" that refills the cart and heads to checkout.
export function CustomerOrderModal({ orderId, onClose }: CustomerOrderModalProps) {
  const router = useRouter();
  const { format } = useCurrency();
  const addItem = useCartStore((state) => state.addItem);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiRequest<{ order: OrderDetail }>(`/api/v1/orders/${orderId}`)
      .then((response) => {
        if (active) setOrder(response.data.order);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load this order.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  // Refill the cart with this order's still-available items, then go to checkout.
  function reorder() {
    if (!order) {
      return;
    }

    for (const item of order.items) {
      if (!item.productId) {
        continue; // Product no longer exists; skip it.
      }

      const product: CartProduct = {
        id: item.productId,
        name: item.name,
        detail: "Frozen meal",
        price: item.unitPrice,
        image: { src: item.imageUrl, alt: item.name },
      };

      for (let count = 0; count < item.quantity; count += 1) {
        addItem(product);
      }
    }

    router.push("/checkout");
  }

  return (
    <AdminModal
      description={order ? `Placed ${formatDateTime(order.placedAt)}` : undefined}
      footer={
        order ? (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button className="sm:w-auto" onClick={onClose} variant="outline">
              Close
            </Button>
            <Button className="sm:w-auto" onClick={reorder}>
              <Icon className="h-4 w-4" name="cart" />
              Order Again
            </Button>
          </div>
        ) : null
      }
      onClose={onClose}
      open
      title={order ? order.reference : "Order"}
    >
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex items-center gap-3" key={index}>
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : !order ? (
        <p className="py-10 text-center text-sm text-error">{error ?? "Order not found."}</p>
      ) : (
        <div className="space-y-6">
          <AdminStatusBadge status={orderStatusLabels[order.status]} tone={orderStatusTones[order.status]} />

          {/* Items */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div className="flex items-center gap-3" key={item.id}>
                {item.imageUrl ? (
                  <Image alt={item.name} className="h-12 w-12 rounded-lg object-cover" height={48} src={item.imageUrl} width={48} />
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-surface-highest text-muted-foreground">
                    <Icon className="h-5 w-5" name="utensils" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {format(item.unitPrice)}
                  </p>
                </div>
                <span className="text-sm font-semibold">{format(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className={`${rowClass} text-muted-foreground`}>
              <span>Subtotal</span>
              <span>{format(order.subtotal)}</span>
            </div>
            <div className={`${rowClass} text-muted-foreground`}>
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? "Free" : format(order.deliveryFee)}</span>
            </div>
            <div className={`${rowClass} heading-font pt-1 text-lg font-semibold`}>
              <span>Total</span>
              <span>{format(order.total)}</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-xl border border-border/60 p-4">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Delivery</h3>
            <p className="text-sm">{order.delivery.address}</p>
            <p className="text-sm text-muted-foreground">
              {order.delivery.city}
              {order.delivery.postalCode ? `, ${order.delivery.postalCode}` : ""}
            </p>
            {order.delivery.instructions ? (
              <p className="mt-1 text-xs text-muted-foreground">“{order.delivery.instructions}”</p>
            ) : null}
          </div>
        </div>
      )}
    </AdminModal>
  );
}
