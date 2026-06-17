"use client";

import { useMemo, useState } from "react";
import { productCreateSchema } from "@/schemas/catalog.schemas";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { dietaryTagOptions, productStatusOptions } from "@/constants/catalog.constants";
import { AdminModal } from "@/components/admin/AdminModal";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import type { AdminProduct, Category } from "@/types/catalog.types";

type ProductFormModalProps = {
  /** When provided, the modal edits this product; otherwise it creates one. */
  product: AdminProduct | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
};

// Local form state keeps numeric inputs as strings so empty fields behave well;
// values are coerced to numbers and validated with the shared Zod schema on save.
type FormState = {
  name: string;
  categoryId: string;
  price: string;
  status: AdminProduct["status"];
  description: string;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
  rating: string;
  popularity: string;
};

// Derive the initial form state from the product being edited (or sensible
// defaults for creation). The modal is mounted fresh per open via a `key`, so
// this runs once on mount — no reset effect needed.
function buildInitialForm(product: AdminProduct | null, categories: Category[]): FormState {
  if (product) {
    return {
      name: product.name,
      categoryId: product.categoryId,
      price: String(product.price),
      status: product.status,
      description: product.description,
      tags: product.tags,
      imageUrl: product.image.src,
      imageAlt: product.image.alt,
      rating: String(product.rating),
      popularity: String(product.popularity),
    };
  }

  return {
    name: "",
    categoryId: categories[0]?.id ?? "",
    price: "",
    status: "DRAFT",
    description: "",
    tags: [],
    imageUrl: "",
    imageAlt: "",
    rating: "0",
    popularity: "0",
  };
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";
const labelClass = "space-y-1.5";
const labelTextClass = "text-sm font-semibold text-muted-foreground";

export function ProductFormModal({ product, categories, onClose, onSaved }: ProductFormModalProps) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState<FormState>(() => buildInitialForm(product, categories));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const customTags = useMemo(
    () => form.tags.filter((tag) => !dietaryTagOptions.includes(tag as (typeof dietaryTagOptions)[number])),
    [form.tags],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTag(tag: string) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag],
    }));
  }

  async function handleSubmit() {
    setError(null);

    const parsed = productCreateSchema.safeParse({
      name: form.name,
      categoryId: form.categoryId,
      price: Number(form.price),
      status: form.status,
      description: form.description,
      tags: form.tags,
      imageUrl: form.imageUrl,
      imageAlt: form.imageAlt,
      rating: Number(form.rating),
      popularity: Number(form.popularity),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }

    setSubmitting(true);

    try {
      const path = isEdit ? `/api/v1/admin/products/${product!.id}` : "/api/v1/admin/products";
      await apiRequest(path, { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(parsed.data) });
      onSaved();
      onClose();
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to save the product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminModal
      description={isEdit ? "Update the details for this frozen item." : "Add a new frozen item to the catalog."}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button className="sm:w-auto" disabled={submitting} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button className="sm:w-auto" disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      }
      onClose={onClose}
      open
      title={isEdit ? "Edit Frozen Item" : "Add Frozen Item"}
    >
      <div className="space-y-5">
        <AuthFormAlert message={error} />

        <label className={labelClass}>
          <span className={labelTextClass}>Name</span>
          <input className={inputClass} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Lemon Herb Chicken Tray" value={form.name} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className={labelClass}>
            <span className={labelTextClass}>Category</span>
            <Select
              hideLabel
              label="Category"
              onChange={(value) => update("categoryId", value)}
              options={categories.map((category) => ({ label: category.name, value: category.id }))}
              value={form.categoryId}
            />
          </div>
          <div className={labelClass}>
            <span className={labelTextClass}>Status</span>
            <Select
              hideLabel
              label="Status"
              onChange={(value) => update("status", value as FormState["status"])}
              options={productStatusOptions}
              value={form.status}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className={labelClass}>
            <span className={labelTextClass}>Price</span>
            <input className={inputClass} inputMode="decimal" min="0" onChange={(event) => update("price", event.target.value)} placeholder="0.00" type="number" value={form.price} />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Rating (0–5)</span>
            <input className={inputClass} max="5" min="0" onChange={(event) => update("rating", event.target.value)} step="0.1" type="number" value={form.rating} />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Popularity</span>
            <input className={inputClass} min="0" onChange={(event) => update("popularity", event.target.value)} type="number" value={form.popularity} />
          </label>
        </div>

        <label className={labelClass}>
          <span className={labelTextClass}>Description</span>
          <textarea className={cn(inputClass, "min-h-24 resize-y")} onChange={(event) => update("description", event.target.value)} placeholder="Short, appetising description shown on the storefront." value={form.description} />
        </label>

        <div className={labelClass}>
          <span className={labelTextClass}>Dietary Tags</span>
          <div className="flex flex-wrap gap-2">
            {dietaryTagOptions.map((tag) => {
              const active = form.tags.includes(tag);
              return (
                <button
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                    active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary",
                  )}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {customTags.length > 0 ? <p className="text-xs text-muted-foreground">Also tagged: {customTags.join(", ")}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            <span className={labelTextClass}>Image URL</span>
            <input className={inputClass} onChange={(event) => update("imageUrl", event.target.value)} placeholder="/images/menu/example.png" value={form.imageUrl} />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Image Alt Text</span>
            <input className={inputClass} onChange={(event) => update("imageAlt", event.target.value)} placeholder="Describe the image" value={form.imageAlt} />
          </label>
        </div>
      </div>
    </AdminModal>
  );
}
