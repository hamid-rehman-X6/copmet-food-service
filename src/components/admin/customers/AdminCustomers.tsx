"use client";

import { useEffect, useRef, useState } from "react";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatDate } from "@/lib/formatters";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminFilterBar, AdminSearchField, AdminSelectFilter } from "@/components/admin/AdminFilters";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { Skeleton } from "@/components/common/Skeleton";
import { CustomerDetailModal } from "@/components/admin/customers/CustomerDetailModal";
import { Icon } from "@/components/common/Icon";
import type { AdminCustomerSummary } from "@/types/customer.types";
import type { Paginated } from "@/types/common.types";

const PAGE_SIZE = 10;

const statusFilterOptions = [
  { label: "All Customers", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// Build initials for the avatar circle from the customer's name.
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AdminCustomers() {
  const { format } = useCurrency();

  const [customers, setCustomers] = useState<AdminCustomerSummary[]>([]);
  const [meta, setMeta] = useState<Paginated<AdminCustomerSummary>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const requestRef = useRef(0);

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

  // Fetch customers (setState only in async callbacks).
  useEffect(() => {
    const requestId = (requestRef.current += 1);

    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    apiRequest<Paginated<AdminCustomerSummary>>(`/api/v1/admin/customers?${params.toString()}`)
      .then((response) => {
        if (requestId !== requestRef.current) return;
        setCustomers(response.data.items);
        setMeta(response.data.meta);
        setError(null);
      })
      .catch((requestError) => {
        if (requestId !== requestRef.current) return;
        setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load customers.");
        setCustomers([]);
        setMeta(null);
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [page, search, status]);

  const summary = loading ? (
    <Skeleton className="h-4 w-40" />
  ) : meta ? (
    `Showing ${customers.length} of ${meta.totalItems} customers`
  ) : null;
  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        description="Review freezer order activity, account status, and lifetime value. Newest customers first."
        eyebrow="Household Relationships"
        title="Customers"
      />

      <AdminFilterBar>
        <AdminSearchField onChange={setSearchInput} placeholder="Search by name or email..." value={searchInput} />
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
        </div>
      ) : null}

      <AdminTableShell
        footer={meta && meta.totalPages > 1 ? <AdminPagination meta={meta} onPageChange={setPage} /> : null}
        summary={summary}
      >
        <table className="w-full min-w-[920px] text-left">
          <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Orders</th>
              <th className="px-6 py-5">Total Spent</th>
              <th className="px-6 py-5">Joined</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <AdminTableSkeleton columns={["media", "text", "text", "text", "badge", "actions"]} rows={PAGE_SIZE} />
            ) : customers.length === 0 ? (
              <tr>
                <td className="px-6 py-16" colSpan={6}>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Icon className="h-10 w-10 text-border-strong" name="users" />
                    <p className="text-sm font-semibold text-foreground">
                      {hasFilters ? "No customers match these filters." : "No customers have signed up yet."}
                    </p>
                    <p className="max-w-sm text-xs text-muted-foreground">
                      {hasFilters
                        ? "Try a different search or status filter."
                        : "New accounts will appear here as soon as customers register."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  className="cursor-pointer transition-colors hover:bg-surface-low/70"
                  key={customer.id}
                  onClick={() => setActiveCustomerId(customer.id)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(customer.name)}
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold">{customer.name}</h2>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold">{customer.orderCount}</td>
                  <td className="px-6 py-5 text-sm font-bold text-primary">{format(customer.totalSpent)}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">{formatDate(customer.createdAt)}</td>
                  <td className="px-6 py-5">
                    <AdminStatusBadge status={customer.isActive ? "Active" : "Inactive"} tone={customer.isActive ? "success" : "neutral"} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      aria-label={`View ${customer.name}`}
                      className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-highest hover:text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveCustomerId(customer.id);
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

      {activeCustomerId ? (
        <CustomerDetailModal customerId={activeCustomerId} key={activeCustomerId} onClose={() => setActiveCustomerId(null)} />
      ) : null}
    </div>
  );
}
