"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { formatMoney } from "@/lib/money";
import { currencyPresets } from "@/constants/settings.constants";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsSkeleton } from "@/components/admin/settings/SettingsSkeleton";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { PublicSettings } from "@/types/settings.types";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";
const labelTextClass = "text-sm font-semibold text-muted-foreground";

type FormState = {
  currencyCode: string;
  currencyLocale: string;
  deliveryFee: string;
  freeDeliveryThreshold: string;
};

export function AdminSettings() {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Load current settings once.
  useEffect(() => {
    let active = true;

    apiRequest<{ settings: PublicSettings }>("/api/v1/settings")
      .then((response) => {
        if (!active) return;
        const { settings } = response.data;
        setForm({
          currencyCode: settings.currencyCode,
          currencyLocale: settings.currencyLocale,
          deliveryFee: String(settings.deliveryFee),
          freeDeliveryThreshold: String(settings.freeDeliveryThreshold),
        });
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof ApiClientError ? requestError.message : "Unable to load settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setSaved(false);
  }

  // Selecting a preset updates both the currency code and its display locale.
  function selectPreset(code: string) {
    const preset = currencyPresets.find((item) => item.code === code);
    if (preset) {
      setForm((current) => (current ? { ...current, currencyCode: preset.code, currencyLocale: preset.locale } : current));
      setSaved(false);
    }
  }

  async function handleSave() {
    if (!form) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await apiRequest("/api/v1/settings", {
        method: "PATCH",
        body: JSON.stringify({
          currencyCode: form.currencyCode,
          currencyLocale: form.currencyLocale,
          deliveryFee: Number(form.deliveryFee),
          freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
        }),
      });
      setSaved(true);
      // Re-run server components so the new currency formatting takes effect.
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  // Preview how a sample amount renders with the chosen currency.
  const preview = form ? formatMoney(1499, form.currencyCode, form.currencyLocale) : "";
  const isPreset = form ? currencyPresets.some((item) => item.code === form.currencyCode) : false;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        description="Configure the store currency and delivery pricing. Changing the currency only affects how prices display — amounts are never converted."
        eyebrow="Configuration"
        title="Store Settings"
      />

      {loading ? (
        <SettingsSkeleton />
      ) : form ? (
        <div className="max-w-2xl space-y-6 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
          <AuthFormAlert message={error} />
          {saved ? (
            <div className="flex items-center gap-3 rounded-xl bg-success-soft px-4 py-3 text-sm text-success-soft-foreground">
              <Icon className="h-5 w-5" name="check" />
              Settings saved.
            </div>
          ) : null}

          <div className="space-y-1.5">
            <span className={labelTextClass}>Currency</span>
            <select className={inputClass} onChange={(event) => selectPreset(event.target.value)} value={isPreset ? form.currencyCode : ""}>
              {!isPreset ? <option value="">{form.currencyCode} (custom)</option> : null}
              {currencyPresets.map((preset) => (
                <option key={preset.code} value={preset.code}>
                  {preset.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Sample price preview: <span className="font-semibold text-foreground">{preview}</span>
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className={labelTextClass}>Delivery Fee</span>
              <input
                className={inputClass}
                inputMode="decimal"
                min="0"
                onChange={(event) => update("deliveryFee", event.target.value)}
                type="number"
                value={form.deliveryFee}
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelTextClass}>Free Delivery Threshold</span>
              <input
                className={inputClass}
                inputMode="decimal"
                min="0"
                onChange={(event) => update("freeDeliveryThreshold", event.target.value)}
                type="number"
                value={form.freeDeliveryThreshold}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Orders at or above the threshold get free delivery; otherwise the delivery fee applies.
          </p>

          <div className="flex justify-end border-t border-border/60 pt-5">
            <Button className="sm:w-auto" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
