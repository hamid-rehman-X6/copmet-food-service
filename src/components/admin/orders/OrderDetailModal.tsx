"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatDateTime } from "@/lib/formatters";
import { orderStatusLabels, orderStatusOptions, orderStatusTones } from "@/constants/order.constants";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { OrderDetailSkeleton } from "@/components/admin/orders/OrderDetailSkeleton";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { OrderDetail, OrderStatus } from "@/types/order.types";

type OrderDetailModalProps = {
  orderId: string;
  onClose: () => void;
  onUpdated: () => void;
};

const rowClass = "flex items-center justify-between gap-4 text-sm";

export function OrderDetailModal({ orderId, onClose, onUpdated }: OrderDetailModalProps) {
  const { format } = useCurrency();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the full order once when the modal mounts (mounted per open via key).
  useEffect(() => {
    let active = true;

    apiRequest<{ order: OrderDetail }>(`/api/v1/admin/orders/${orderId}`)
      .then((response) => {
        if (!active) return;
        setOrder(response.data.order);
        setStatus(response.data.order.status);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load the order.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  async function saveStatus() {
    if (!order || status === order.status) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await apiRequest<{ order: OrderDetail }>(`/api/v1/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrder(response.data.order);
      onUpdated();
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to update the order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      description={order ? `Placed ${formatDateTime(order.placedAt)}` : undefined}
      onClose={onClose}
      open
      title={order ? order.reference : "Order"}
    >
      {loading ? (
        <OrderDetailSkeleton />
      ) : !order ? (
        <p className="py-10 text-center text-sm text-error">{error ?? "Order not found."}</p>
      ) : (
        <div className="space-y-6">
          {error ? <p className="rounded-lg bg-error/5 px-4 py-3 text-sm text-error">{error}</p> : null}

          {/* Status control */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-low p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">Status</span>
              <AdminStatusBadge status={orderStatusLabels[order.status]} tone={orderStatusTones[order.status]} />
            </div>
            <div className="flex items-center gap-2">
              <select
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-primary outline-none"
                onChange={(event) => setStatus(event.target.value as OrderStatus)}
                value={status}
              >
                {orderStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button disabled={saving || status === order.status} onClick={saveStatus} size="sm">
                {saving ? "Saving..." : "Update"}
              </Button>
            </div>
          </div>

          {/* Customer + delivery */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 p-4">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Customer</h3>
              <p className="text-sm font-semibold">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              {order.contact.phone ? <p className="mt-1 text-sm text-muted-foreground">{order.contact.phone}</p> : null}
            </div>
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

          {/* Items */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Items</h3>
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
        </div>
      )}
    </AdminModal>
  );
}
