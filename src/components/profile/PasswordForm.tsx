"use client";

import { useState } from "react";
import { changePasswordSchema } from "@/schemas/profile.schemas";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { ProfileField } from "@/components/profile/ProfileField";

const emptyForm = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

// Change password: requires the current password, a valid new password, and a
// matching confirmation. Fields clear on success.
export function PasswordForm() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  function update(key: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const parsed = changePasswordSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }

    setBusy(true);

    try {
      await apiRequest("/api/v1/profile/password", { method: "PATCH", body: JSON.stringify(parsed.data) });
      setForm(emptyForm);
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to change your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7" onSubmit={handleSubmit}>
      <div>
        <h2 className="heading-font text-xl font-semibold">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">Use at least 8 characters with a letter and a number.</p>
      </div>

      <AuthFormAlert message={error} />
      {saved ? (
        <div className="flex items-center gap-3 rounded-lg bg-success-soft px-4 py-2.5 text-sm text-success-soft-foreground">
          <Icon className="h-5 w-5" name="check" />
          Password updated.
        </div>
      ) : null}

      <ProfileField autoComplete="current-password" disabled={busy} id="currentPassword" label="Current password" onChange={(event) => update("currentPassword", event.target.value)} type="password" value={form.currentPassword} />
      <div className="grid gap-5 sm:grid-cols-2">
        <ProfileField autoComplete="new-password" disabled={busy} id="newPassword" label="New password" onChange={(event) => update("newPassword", event.target.value)} type="password" value={form.newPassword} />
        <ProfileField autoComplete="new-password" disabled={busy} id="confirmNewPassword" label="Confirm new password" onChange={(event) => update("confirmNewPassword", event.target.value)} type="password" value={form.confirmNewPassword} />
      </div>

      <div className="flex justify-end">
        <Button className="sm:w-auto" disabled={busy} type="submit">
          {busy ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
