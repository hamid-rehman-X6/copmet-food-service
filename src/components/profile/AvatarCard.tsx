"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { getAvatarUrl, getInitials } from "@/lib/avatar";
import { validateAvatarFile } from "@/lib/image-client";
import { AVATAR_ACCEPT_ATTRIBUTE, MAX_AVATAR_MB } from "@/constants/profile.constants";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { AuthUser } from "@/types/auth.types";

// Avatar upload card: pick a PNG/JPEG/WebP (≤3 MB), preview it, then save.
// Validation runs on the client for instant feedback and again on the server.
export function AvatarCard({ user }: { user: AuthUser }) {
  const { setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Revoke the object URL on unmount to avoid leaking blob references.
  useEffect(() => () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
  }, []);

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError(null);

    if (!selected) {
      return;
    }

    const validationError = await validateAvatarFile(selected);
    if (validationError) {
      setError(validationError);
      clearPreview();
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const url = URL.createObjectURL(selected);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    setFile(selected);
  }

  async function handleSave() {
    if (!file) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest<{ avatarUrl: string }>("/api/v1/profile/avatar", {
        method: "POST",
        body: formData,
      });
      setUser({ ...user, avatarUrl: response.data.avatarUrl });
      clearPreview();
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to upload the image.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    setBusy(true);
    setError(null);

    try {
      await apiRequest("/api/v1/profile/avatar", { method: "DELETE" });
      setUser({ ...user, avatarUrl: null });
      clearPreview();
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to remove the image.");
    } finally {
      setBusy(false);
    }
  }

  const currentAvatarUrl = getAvatarUrl(user);
  const displayUrl = previewUrl ?? currentAvatarUrl;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
      <h2 className="heading-font text-xl font-semibold">Profile Photo</h2>
      <p className="mt-1 text-sm text-muted-foreground">PNG, JPEG, or WebP. Up to {MAX_AVATAR_MB} MB.</p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border bg-surface-low">
          {displayUrl ? (
            <Image alt="Profile photo" className="h-full w-full object-cover" height={112} src={displayUrl} unoptimized width={112} />
          ) : (
            <span className="grid h-full w-full place-items-center text-2xl font-bold text-primary">
              {getInitials(user.firstName, user.lastName)}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-4">
          {error ? (
            <p className="rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm text-error">{error}</p>
          ) : null}

          <input
            accept={AVATAR_ACCEPT_ATTRIBUTE}
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />

          <div className="flex flex-wrap gap-3">
            <Button disabled={busy} onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
              <Icon className="h-4 w-4" name="camera" />
              Choose Image
            </Button>

            {file ? (
              <Button disabled={busy} onClick={handleSave} size="sm">
                {busy ? "Saving..." : "Save Photo"}
              </Button>
            ) : null}

            {currentAvatarUrl && !file ? (
              <Button className="text-error hover:bg-error/5" disabled={busy} onClick={handleRemove} size="sm" variant="ghost">
                <Icon className="h-4 w-4" name="trash" />
                Remove
              </Button>
            ) : null}
          </div>

          {file ? <p className="text-xs text-muted-foreground">Selected: {file.name}</p> : null}
        </div>
      </div>
    </section>
  );
}
