"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { AdminWhatsappNumber } from "@/types/admin.types";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";
const labelTextClass = "text-sm font-semibold text-muted-foreground";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiClientError ? error.message : fallback;
}

// Manage the WhatsApp numbers that receive placed orders. Orders are sent to
// every number whose status is Active.
export function WhatsappNumbersTab() {
  const [numbers, setNumbers] = useState<AdminWhatsappNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminWhatsappNumber | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    apiRequest<{ numbers: AdminWhatsappNumber[] }>("/api/v1/admin/whatsapp-numbers")
      .then((response) => {
        if (active) setNumbers(response.data.numbers);
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError, "Unable to load WhatsApp numbers."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdding(true);
    setError(null);

    try {
      const response = await apiRequest<{ number: AdminWhatsappNumber }>("/api/v1/admin/whatsapp-numbers", {
        method: "POST",
        body: JSON.stringify({ label: label.trim() || undefined, phone, isActive: true }),
      });
      setNumbers((current) => [...current, response.data.number]);
      setLabel("");
      setPhone("");
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to add the number."));
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(number: AdminWhatsappNumber) {
    setBusyId(number.id);
    setError(null);

    try {
      const response = await apiRequest<{ number: AdminWhatsappNumber }>(
        `/api/v1/admin/whatsapp-numbers/${number.id}`,
        { method: "PATCH", body: JSON.stringify({ isActive: !number.isActive }) },
      );
      setNumbers((current) => current.map((item) => (item.id === number.id ? response.data.number : item)));
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to update the number."));
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await apiRequest(`/api/v1/admin/whatsapp-numbers/${deleteTarget.id}`, { method: "DELETE" });
      setNumbers((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to remove the number."));
    } finally {
      setDeleting(false);
    }
  }

  const activeCount = numbers.filter((item) => item.isActive).length;

  return (
    <div className="max-w-2xl space-y-6">
      <AuthFormAlert message={error} />

      <form className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7" onSubmit={handleAdd}>
        <h3 className="heading-font text-lg font-semibold">Add a WhatsApp number</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelTextClass}>Label (optional)</span>
            <input className={inputClass} onChange={(event) => setLabel(event.target.value)} placeholder="e.g. Main line" value={label} />
          </label>
          <label className="space-y-1.5">
            <span className={labelTextClass}>Phone number</span>
            <input
              className={inputClass}
              inputMode="tel"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="International format, e.g. 923001234567"
              value={phone}
            />
          </label>
        </div>
        <div className="flex justify-end">
          <Button className="sm:w-auto" disabled={adding || phone.trim().length === 0} type="submit">
            <Icon className="h-4 w-4" name="plus" />
            {adding ? "Adding..." : "Add Number"}
          </Button>
        </div>
      </form>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="heading-font text-lg font-semibold">Order recipients</h3>
          <span className="text-xs text-muted-foreground">{activeCount} active</span>
        </div>

        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading numbers...</p>
        ) : numbers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface-low px-4 py-8 text-center text-sm text-muted-foreground">
            No numbers yet. Add one above so placed orders reach you on WhatsApp.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {numbers.map((number) => (
              <li className="flex items-center justify-between gap-4 py-3" key={number.id}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{number.label || "WhatsApp number"}</p>
                  <p className="truncate text-sm text-muted-foreground">+{number.phone}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    aria-pressed={number.isActive}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                      number.isActive
                        ? "bg-success-soft text-success-soft-foreground"
                        : "bg-surface-highest text-muted-foreground",
                    )}
                    disabled={busyId === number.id}
                    onClick={() => toggleActive(number)}
                    type="button"
                  >
                    <span className={cn("h-2 w-2 rounded-full", number.isActive ? "bg-tertiary" : "bg-border-strong")} />
                    {number.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    aria-label={`Delete ${number.label || number.phone}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
                    onClick={() => setDeleteTarget(number)}
                    type="button"
                  >
                    <Icon className="h-4 w-4" name="trash" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && numbers.length > 0 && activeCount === 0 ? (
          <p className="mt-4 rounded-lg bg-secondary-container/40 px-4 py-2.5 text-xs text-secondary-container-foreground">
            No active numbers — placed orders won&apos;t be sent to anyone until you activate one.
          </p>
        ) : null}
      </div>

      <ConfirmDialog
        busy={deleting}
        confirmLabel="Delete"
        destructive
        message={`Remove ${deleteTarget?.label || deleteTarget?.phone ? `"${deleteTarget?.label || deleteTarget?.phone}"` : "this number"}? Orders will no longer be sent to it.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        open={deleteTarget !== null}
        title="Remove WhatsApp number"
      />
    </div>
  );
}
