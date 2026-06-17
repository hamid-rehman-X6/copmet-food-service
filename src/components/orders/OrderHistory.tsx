"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatDateTime } from "@/lib/formatters";
import { orderStatusLabels, orderStatusTones } from "@/constants/order.constants";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Icon } from "@/components/common/Icon";
import { CustomerOrderModal } from "@/components/orders/CustomerOrderModal";
import { OrderHistorySkeleton } from "@/components/orders/OrderHistorySkeleton";
import type { OrderSummary } from "@/types/order.types";
import type { Paginated } from "@/types/common.types";

const PAGE_SIZE = 10;

// The authenticated customer's order history: newest first, paginated, with a
// friendly empty state. Fetching sets state only in async callbacks.
function OrderHistoryList() {
  const { format } = useCurrency();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [meta, setMeta] = useState<Paginated<OrderSummary>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const requestId = (requestRef.current += 1);

    apiRequest<Paginated<OrderSummary>>(`/api/v1/orders?page=${page}&pageSize=${PAGE_SIZE}`)
      .then((response) => {
        if (requestId !== requestRef.current) return;
        setOrders(response.data.items);
        setMeta(response.data.meta);
        setError(null);
      })
      .catch((requestError) => {
        if (requestId !== requestRef.current) return;
        setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load your orders.");
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [page, refreshKey]);

  if (loading) {
    return <OrderHistorySkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">
        <span>{error}</span>
        <button
          className="font-semibold underline"
          onClick={() => {
            setLoading(true);
            setRefreshKey((key) => key + 1);
          }}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface-low px-6 py-16 text-center">
        <Icon className="mx-auto h-10 w-10 text-border-strong" name="receipt" />
        <h2 className="heading-font mt-4 text-xl font-semibold">No orders yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">When you place a frozen order, it will appear here.</p>
        <Link
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
          href="/menu"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]" key={order.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold">{order.reference}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(order.placedAt)}</p>
            </div>
            <AdminStatusBadge status={orderStatusLabels[order.status]} tone={orderStatusTones[order.status]} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <p className="text-sm text-muted-foreground">
              {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
            </p>
            <div className="flex items-center gap-4">
              <p className="heading-font text-lg font-bold text-primary">{format(order.total)}</p>
              <button
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-container"
                onClick={() => setActiveOrderId(order.id)}
                type="button"
              >
                View details
                <Icon className="h-4 w-4" name="arrowRight" />
              </button>
            </div>
          </div>
        </article>
      ))}

      {meta && meta.totalPages > 1 ? (
        <div className="flex justify-center pt-2">
          <AdminPagination
            meta={meta}
            onPageChange={(next) => {
              setLoading(true);
              setPage(next);
            }}
          />
        </div>
      ) : null}

      {activeOrderId ? (
        <CustomerOrderModal key={activeOrderId} onClose={() => setActiveOrderId(null)} orderId={activeOrderId} />
      ) : null}
    </div>
  );
}

// Order history is a protected route; RequireAuth resolves the session and shows
// the skeleton while it does.
export function OrderHistory() {
  return (
    <RequireAuth fallback={<OrderHistorySkeleton />}>
      <OrderHistoryList />
    </RequireAuth>
  );
}
