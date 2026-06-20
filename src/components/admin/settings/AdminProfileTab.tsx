"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { validateAvatarFile } from "@/lib/image-client";
import { AVATAR_ACCEPT_ATTRIBUTE, MAX_AVATAR_MB } from "@/constants/profile.constants";
import { getAdminInitial, useAdminProfile } from "@/components/admin/AdminProfileProvider";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { AdminProfile } from "@/types/admin.types";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";
const labelTextClass = "text-sm font-semibold text-muted-foreground";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiClientError ? error.message : fallback;
}

// Waits for the shared admin profile to load, then renders the editable form
// (keyed so it initialises its draft from the loaded profile once).
export function AdminProfileTab() {
  const { profile } = useAdminProfile();

  if (!profile) {
    return <p className="py-6 text-sm text-muted-foreground">Loading profile...</p>;
  }

  return <AdminProfileForm initial={profile} key={profile.email} />;
}

function AdminProfileForm({ initial }: { initial: AdminProfile }) {
  const { profile, setProfile } = useAdminProfile();
  const current = profile ?? initial;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [name, setName] = useState(initial.name);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);
  const [busyPhoto, setBusyPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError(null);
    if (!selected) return;

    const validationError = await validateAvatarFile(selected);
    if (validationError) {
      setError(validationError);
      clearPreview();
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(selected);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    setFile(selected);
  }

  async function handleSaveName() {
    setSavingName(true);
    setError(null);
    setSaved(false);

    try {
      const response = await apiRequest<{ profile: AdminProfile }>("/api/v1/admin/profile", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      setProfile(response.data.profile);
      setSaved(true);
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to update your profile."));
    } finally {
      setSavingName(false);
    }
  }

  async function handleSavePhoto() {
    if (!file) return;
    setBusyPhoto(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest<{ avatarUrl: string }>("/api/v1/admin/profile/avatar", {
        method: "POST",
        body: formData,
      });
      setProfile({ ...current, avatarUrl: response.data.avatarUrl });
      clearPreview();
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to upload the photo."));
    } finally {
      setBusyPhoto(false);
    }
  }

  async function handleRemovePhoto() {
    setBusyPhoto(true);
    setError(null);

    try {
      await apiRequest("/api/v1/admin/profile/avatar", { method: "DELETE" });
      setProfile({ ...current, avatarUrl: null });
      clearPreview();
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to remove the photo."));
    } finally {
      setBusyPhoto(false);
    }
  }

  const displayUrl = previewUrl ?? current.avatarUrl;

  return (
    <div className="max-w-2xl space-y-6 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
      <AuthFormAlert message={error} />
      {saved ? (
        <div className="flex items-center gap-3 rounded-xl bg-success-soft px-4 py-3 text-sm text-success-soft-foreground">
          <Icon className="h-5 w-5" name="check" />
          Profile saved.
        </div>
      ) : null}

      <div>
        <h3 className="heading-font text-lg font-semibold">Profile photo</h3>
        <p className="mt-1 text-sm text-muted-foreground">PNG, JPEG, or WebP. Up to {MAX_AVATAR_MB} MB.</p>

        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-surface-low">
            {displayUrl ? (
              <Image alt="Admin profile" className="h-full w-full object-cover" height={96} src={displayUrl} unoptimized width={96} />
            ) : (
              <span className="grid h-full w-full place-items-center text-3xl font-bold text-primary">
                {getAdminInitial(current.name)}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <input
              accept={AVATAR_ACCEPT_ATTRIBUTE}
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />
            <div className="flex flex-wrap gap-3">
              <Button disabled={busyPhoto} onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
                <Icon className="h-4 w-4" name="camera" />
                Choose Image
              </Button>
              {file ? (
                <Button disabled={busyPhoto} onClick={handleSavePhoto} size="sm">
                  {busyPhoto ? "Saving..." : "Save Photo"}
                </Button>
              ) : null}
              {current.avatarUrl && !file ? (
                <Button className="text-error hover:bg-error/5" disabled={busyPhoto} onClick={handleRemovePhoto} size="sm" variant="ghost">
                  <Icon className="h-4 w-4" name="trash" />
                  Remove
                </Button>
              ) : null}
            </div>
            {file ? <p className="text-xs text-muted-foreground">Selected: {file.name}</p> : null}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-border/60 pt-6">
        <label className="space-y-1.5">
          <span className={labelTextClass}>Display Name</span>
          <input className={inputClass} onChange={(event) => setName(event.target.value)} value={name} />
        </label>
        <label className="space-y-1.5">
          <span className={labelTextClass}>Email</span>
          <input className={`${inputClass} cursor-not-allowed opacity-70`} disabled readOnly value={current.email} />
          <span className="text-xs text-muted-foreground">The admin email is set in configuration and can&apos;t be changed here.</span>
        </label>
        <div className="flex justify-end">
          <Button className="sm:w-auto" disabled={savingName || name.trim().length === 0} onClick={handleSaveName}>
            {savingName ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
