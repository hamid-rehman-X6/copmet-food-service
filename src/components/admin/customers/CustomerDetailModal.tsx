"use client";

import { useEffect, useState } from "react";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatDate, formatDateTime } from "@/lib/formatters";
import { orderStatusLabels, orderStatusTones } from "@/constants/order.constants";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { CustomerDetailSkeleton } from "@/components/admin/customers/CustomerDetailSkeleton";
import type { AdminCustomerDetail } from "@/types/customer.types";

type CustomerDetailModalProps = {
  customerId: string;
  onClose: () => void;
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="heading-font mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

export function CustomerDetailModal({ customerId, onClose }: CustomerDetailModalProps) {
  const { format } = useCurrency();
  const [customer, setCustomer] = useState<AdminCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiRequest<{ customer: AdminCustomerDetail }>(`/api/v1/admin/customers/${customerId}`)
      .then((response) => {
        if (active) setCustomer(response.data.customer);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load customer.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [customerId]);

  return (
    <AdminModal
      description={customer?.email}
      onClose={onClose}
      open
      title={customer ? customer.name : "Customer"}
    >
      {loading ? (
        <CustomerDetailSkeleton />
      ) : !customer ? (
        <p className="py-10 text-center text-sm text-error">{error ?? "Customer not found."}</p>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <AdminStatusBadge status={customer.isActive ? "Active" : "Inactive"} tone={customer.isActive ? "success" : "neutral"} />
            <span className="text-xs text-muted-foreground">Joined {formatDate(customer.createdAt)}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Orders" value={String(customer.orderCount)} />
            <StatCard label="Total Spent" value={format(customer.totalSpent)} />
            <StatCard label="Last Login" value={customer.lastLoginAt ? formatDate(customer.lastLoginAt) : "Never"} />
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Recent Orders</h3>
            {customer.recentOrders.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-surface-low px-4 py-8 text-center text-sm text-muted-foreground">
                No orders yet.
              </p>
            ) : (
              <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
                {customer.recentOrders.map((order) => (
                  <div className="flex items-center justify-between gap-4 px-4 py-3" key={order.id}>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{order.reference}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(order.placedAt)}</p>
                    </div>
                    <AdminStatusBadge status={orderStatusLabels[order.status]} tone={orderStatusTones[order.status]} />
                    <span className="text-sm font-bold text-primary">{format(order.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminModal>
  );
}
