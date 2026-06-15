"use client";

import { useEffect, useRef, useState } from "react";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatDateTime } from "@/lib/formatters";
import { orderStatusLabels, orderStatusTones } from "@/constants/order.constants";
import { orderStatusOptions } from "@/constants/order.constants";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminFilterBar, AdminSearchField, AdminSelectFilter } from "@/components/admin/AdminFilters";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { Skeleton } from "@/components/common/Skeleton";
import { OrderDetailModal } from "@/components/admin/orders/OrderDetailModal";
import { Icon } from "@/components/common/Icon";
import type { OrderSummary } from "@/types/order.types";
import type { Paginated } from "@/types/common.types";

const PAGE_SIZE = 10;

const statusFilterOptions = [{ label: "All Statuses", value: "" }, ...orderStatusOptions];

export function AdminOrders() {
  const { format } = useCurrency();

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [meta, setMeta] = useState<Paginated<OrderSummary>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const requestRef = useRef(0);
  const refetch = () => setRefreshKey((key) => key + 1);

  // Debounce search. Guard against the no-op on mount (trimmed value already
  // equals `search`): without this, loading would be set true with no matching
  // fetch to clear it, leaving the table stuck on the loading row.
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search) {
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      setSearch(trimmed);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput, search]);

  // Fetch orders on filter/page/refresh change (setState only in callbacks).
  useEffect(() => {
    const requestId = (requestRef.current += 1);

    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    apiRequest<Paginated<OrderSummary>>(`/api/v1/admin/orders?${params.toString()}`)
      .then((response) => {
        if (requestId !== requestRef.current) return;
        setOrders(response.data.items);
        setMeta(response.data.meta);
        setError(null);
      })
      .catch((requestError) => {
        if (requestId !== requestRef.current) return;
        setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load orders.");
        setOrders([]);
        setMeta(null);
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [page, search, status, refreshKey]);

  const summary = loading ? (
    <Skeleton className="h-4 w-48" />
  ) : meta ? (
    `Showing ${orders.length} of ${meta.totalItems} freezer orders`
  ) : null;
  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        description="Track batch packing, cold delivery progress, and freezer order value."
        eyebrow="Frozen Operations"
        title="Freezer Orders"
      />

      <AdminFilterBar>
        <AdminSearchField onChange={setSearchInput} placeholder="Search by reference or customer..." value={searchInput} />
        <AdminSelectFilter
          label="Status"
          onChange={(value) => {
            setLoading(true);
            setStatus(value);
            setPage(1);
          }}
          options={statusFilterOptions}
          value={status}
        />
      </AdminFilterBar>

      {error ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={refetch} type="button">
            Retry
          </button>
        </div>
      ) : null}

      <AdminTableShell
        footer={meta && meta.totalPages > 1 ? <AdminPagination meta={meta} onPageChange={setPage} /> : null}
        summary={summary}
      >
        <table className="w-full min-w-[860px] text-left">
          <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-6 py-5">Order</th>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Items</th>
              <th className="px-6 py-5">Total</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <AdminTableSkeleton columns={["stack", "stack", "text", "text", "badge", "actions"]} rows={PAGE_SIZE} />
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-6 py-16" colSpan={6}>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Icon className="h-10 w-10 text-border-strong" name="receipt" />
                    <p className="text-sm font-semibold text-foreground">
                      {hasFilters ? "No orders match these filters." : "No freezer orders have been placed yet."}
                    </p>
                    <p className="max-w-sm text-xs text-muted-foreground">
                      {hasFilters
                        ? "Try a different search or status filter."
                        : "Orders will show up here as soon as customers check out."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  className="cursor-pointer transition-colors hover:bg-surface-low/70"
                  key={order.id}
                  onClick={() => setActiveOrderId(order.id)}
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold">{order.reference}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(order.placedAt)}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold">{order.customer.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{order.customer.email}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold">{order.itemCount}</td>
                  <td className="px-6 py-5 text-sm font-bold text-primary">{format(order.total)}</td>
                  <td className="px-6 py-5">
                    <AdminStatusBadge status={orderStatusLabels[order.status]} tone={orderStatusTones[order.status]} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      aria-label={`View ${order.reference}`}
                      className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-highest hover:text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveOrderId(order.id);
                      }}
                      type="button"
                    >
                      <Icon className="h-5 w-5" name="arrowRight" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableShell>

      {activeOrderId ? (
        <OrderDetailModal key={activeOrderId} onClose={() => setActiveOrderId(null)} onUpdated={refetch} orderId={activeOrderId} />
      ) : null}
    </div>
  );
}
