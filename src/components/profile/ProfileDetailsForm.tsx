"use client";

import { useState } from "react";
import { updateProfileSchema } from "@/schemas/profile.schemas";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { ProfileField } from "@/components/profile/ProfileField";
import type { AuthUser } from "@/types/auth.types";

// Edit display name and email. On success the auth context is updated so the
// navbar and the rest of the app reflect the change immediately.
export function ProfileDetailsForm({ user }: { user: AuthUser }) {
  const { setUser } = useAuth();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const parsed = updateProfileSchema.safeParse({ firstName, lastName, email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }

    setBusy(true);

    try {
      const response = await apiRequest<{ user: AuthUser }>("/api/v1/profile", {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
      });
      setUser(response.data.user);
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to update your profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7" onSubmit={handleSubmit}>
      <div>
        <h2 className="heading-font text-xl font-semibold">Account Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">Update your name and email address.</p>
      </div>

      <AuthFormAlert message={error} />
      {saved ? (
        <div className="flex items-center gap-3 rounded-lg bg-success-soft px-4 py-2.5 text-sm text-success-soft-foreground">
          <Icon className="h-5 w-5" name="check" />
          Profile updated.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <ProfileField autoComplete="given-name" disabled={busy} id="firstName" label="First name" onChange={(event) => setFirstName(event.target.value)} value={firstName} />
        <ProfileField autoComplete="family-name" disabled={busy} id="lastName" label="Last name" onChange={(event) => setLastName(event.target.value)} value={lastName} />
      </div>
      <ProfileField autoComplete="email" disabled={busy} id="email" label="Email address" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />

      <div className="flex justify-end">
        <Button className="sm:w-auto" disabled={busy} type="submit">
          {busy ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
