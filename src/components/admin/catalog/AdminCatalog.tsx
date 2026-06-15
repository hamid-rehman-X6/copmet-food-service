"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { productSortOptions, productStatusLabels } from "@/constants/catalog.constants";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { AdminFilterBar, AdminSearchField, AdminSelectFilter } from "@/components/admin/AdminFilters";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableShell } from "@/components/admin/AdminTableShell";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { Skeleton } from "@/components/common/Skeleton";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ProductFormModal } from "@/components/admin/catalog/ProductFormModal";
import { Icon } from "@/components/common/Icon";
import type { AdminProduct, Category } from "@/types/catalog.types";
import type { Paginated } from "@/types/common.types";

const PAGE_SIZE = 10;

// Builds the status filter options once: "All" plus each product status.
const statusFilterOptions = [
  { label: "All Statuses", value: "" },
  ...Object.entries(productStatusLabels).map(([value, label]) => ({ value, label })),
];

export function AdminCatalog() {
  const { format } = useCurrency();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [meta, setMeta] = useState<Paginated<AdminProduct>["meta"] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters. `searchInput` is the live field value; `search` is debounced.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);

  const [formProduct, setFormProduct] = useState<AdminProduct | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Bumping this triggers a re-fetch (e.g. after create/edit/delete).
  const [refreshKey, setRefreshKey] = useState(0);
  // Sequence guard so a slow earlier request can't overwrite a newer response.
  const requestRef = useRef(0);

  const refetch = () => setRefreshKey((key) => key + 1);

  // Load categories once for the filter dropdown and the product form.
  useEffect(() => {
    apiRequest<{ categories: Category[] }>("/api/v1/categories")
      .then((response) => setCategories(response.data.categories))
      .catch(() => setCategories([]));
  }, []);

  // Debounce the search field so we don't query on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch products whenever a filter, the page, or the refresh key changes.
  // State is only set inside async callbacks (never synchronously in the effect)
  // and stale responses are discarded via the sequence ref.
  useEffect(() => {
    const requestId = (requestRef.current += 1);

    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE), sort });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (category) params.set("category", category);

    apiRequest<Paginated<AdminProduct>>(`/api/v1/admin/products?${params.toString()}`)
      .then((response) => {
        if (requestId !== requestRef.current) return;
        setProducts(response.data.items);
        setMeta(response.data.meta);
        setError(null);
      })
      .catch((requestError) => {
        if (requestId !== requestRef.current) return;
        setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load products.");
        setProducts([]);
        setMeta(null);
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [page, sort, search, status, category, refreshKey]);

  function openCreate() {
    setFormProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: AdminProduct) {
    setFormProduct(product);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await apiRequest(`/api/v1/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      // Step back a page if we just removed the last row on this page.
      if (products.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        refetch();
      }
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to delete the product.");
    } finally {
      setDeleting(false);
    }
  }

  const categoryFilterOptions = [
    { label: "All Categories", value: "" },
    ...categories.map((item) => ({ label: item.name, value: item.slug })),
  ];

  const summary = loading ? (
    <Skeleton className="h-4 w-44" />
  ) : meta ? (
    `Showing ${products.length} of ${meta.totalItems} frozen items`
  ) : null;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        actionLabel="Add Frozen Item"
        description="Curate freezer-ready meals, batch availability, pricing, and stock status."
        eyebrow="Frozen Catalog"
        onAction={openCreate}
        title="Frozen Catalog"
      />

      <AdminFilterBar>
        <AdminSearchField onChange={setSearchInput} placeholder="Search frozen items..." value={searchInput} />
        <AdminSelectFilter
          label="Status"
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={statusFilterOptions}
          value={status}
        />
        <AdminSelectFilter
          label="Category"
          onChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          options={categoryFilterOptions}
          value={category}
        />
        <AdminSelectFilter
          label="Sort"
          onChange={(value) => {
            setSort(value);
            setPage(1);
          }}
          options={productSortOptions}
          value={sort}
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
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-surface-low text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-6 py-5">Frozen Item</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Price</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <AdminTableSkeleton columns={["media", "text", "text", "badge", "actions"]} rows={PAGE_SIZE} />
            ) : products.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-sm text-muted-foreground" colSpan={5}>
                  No frozen items match these filters.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr className="transition-colors hover:bg-surface-low/70" key={product.id}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {product.image.src ? (
                        <Image alt={product.image.alt} className="h-14 w-14 rounded-xl object-cover" height={56} src={product.image.src} width={56} />
                      ) : (
                        <span className="grid h-14 w-14 place-items-center rounded-xl bg-surface-highest text-muted-foreground">
                          <Icon className="h-5 w-5" name="utensils" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold">{product.name}</h2>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {product.tags.length > 0 ? product.tags.join(" · ") : "No tags"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">{product.category}</td>
                  <td className="px-6 py-5 text-sm font-bold text-primary">{format(product.price)}</td>
                  <td className="px-6 py-5">
                    <AdminStatusBadge status={productStatusLabels[product.status]} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        aria-label={`Edit ${product.name}`}
                        className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-highest hover:text-primary"
                        onClick={() => openEdit(product)}
                        type="button"
                      >
                        <Icon className="h-5 w-5" name="edit" />
                      </button>
                      <button
                        aria-label={`Delete ${product.name}`}
                        className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
                        onClick={() => setDeleteTarget(product)}
                        type="button"
                      >
                        <Icon className="h-5 w-5" name="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableShell>

      {formOpen ? (
        <ProductFormModal
          categories={categories}
          key={formProduct?.id ?? "create"}
          onClose={() => setFormOpen(false)}
          onSaved={refetch}
          product={formProduct}
        />
      ) : null}

      <ConfirmDialog
        busy={deleting}
        confirmLabel="Delete Product"
        destructive
        message={`Permanently delete "${deleteTarget?.name}"? This cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        open={Boolean(deleteTarget)}
        title="Delete Frozen Item"
      />
    </div>
  );
}
