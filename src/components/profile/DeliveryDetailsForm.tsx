"use client";

import { useEffect, useState } from "react";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { Skeleton } from "@/components/common/Skeleton";
import { ProfileField } from "@/components/profile/ProfileField";
import type { DeliveryDefaults } from "@/types/profile.types";

type FormState = {
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  instructions: string;
};

const emptyForm: FormState = { phone: "", address: "", city: "", postalCode: "", instructions: "" };

// Save default delivery details so checkout can pre-fill them on the next order.
// Fetches the saved values on mount; setState happens only in async callbacks.
export function DeliveryDetailsForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    apiRequest<{ delivery: DeliveryDefaults }>("/api/v1/profile/delivery")
      .then((response) => {
        if (!active) return;
        const { delivery } = response.data;
        setForm({
          phone: delivery.phone ?? "",
          address: delivery.address ?? "",
          city: delivery.city ?? "",
          postalCode: delivery.postalCode ?? "",
          instructions: delivery.instructions ?? "",
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    try {
      await apiRequest("/api/v1/profile/delivery", { method: "PUT", body: JSON.stringify(form) });
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to save your delivery details.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3.5 w-72" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="h-10 w-full rounded-lg" key={index} />
        ))}
      </section>
    );
  }

  return (
    <form className="space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7" onSubmit={handleSubmit}>
      <div>
        <h2 className="heading-font text-xl font-semibold">Delivery Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">Save these to pre-fill your checkout next time.</p>
      </div>

      <AuthFormAlert message={error} />
      {saved ? (
        <div className="flex items-center gap-3 rounded-lg bg-success-soft px-4 py-2.5 text-sm text-success-soft-foreground">
          <Icon className="h-5 w-5" name="check" />
          Delivery details saved.
        </div>
      ) : null}

      <ProfileField autoComplete="tel" disabled={saving} id="deliveryPhone" label="Phone" onChange={(event) => update("phone", event.target.value)} value={form.phone} />
      <ProfileField autoComplete="street-address" disabled={saving} id="deliveryAddress" label="Address" onChange={(event) => update("address", event.target.value)} value={form.address} />
      <div className="grid gap-5 sm:grid-cols-2">
        <ProfileField autoComplete="address-level2" disabled={saving} id="deliveryCity" label="City" onChange={(event) => update("city", event.target.value)} value={form.city} />
        <ProfileField autoComplete="postal-code" disabled={saving} id="deliveryPostal" label="Postal code" onChange={(event) => update("postalCode", event.target.value)} value={form.postalCode} />
      </div>
      <label className="block space-y-1.5" htmlFor="deliveryInstructions">
        <span className="text-sm font-semibold text-muted-foreground">Delivery instructions</span>
        <textarea
          className="min-h-20 w-full rounded-lg border border-border bg-surface-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-card disabled:opacity-60"
          disabled={saving}
          id="deliveryInstructions"
          onChange={(event) => update("instructions", event.target.value)}
          placeholder="e.g. Leave with reception, gate code 1234..."
          value={form.instructions}
        />
      </label>

      <div className="flex justify-end">
        <Button className="sm:w-auto" disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Delivery Details"}
        </Button>
      </div>
    </form>
  );
}
