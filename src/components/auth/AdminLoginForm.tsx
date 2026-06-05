"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loginSchema } from "@/schemas/auth.schemas";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import type { AuthUser } from "@/types/auth.types";

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const input = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe: false,
    });

    if (!input.success) {
      setError(input.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiRequest<{ user: AuthUser }>(
        "/api/v1/auth/admin-login",
        { method: "POST", body: JSON.stringify(input.data) },
        { retryOnUnauthorized: false },
      );

      if (response.data.user.role !== "ADMIN") {
        setError("Only admin accounts can access this panel.");
        return;
      }

      const next = searchParams.get("next");

      setUser(response.data.user);
      router.push(next?.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to sign in right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <AuthFormAlert message={error} />
      <AuthField autoComplete="email" disabled={submitting} icon="mail" id="admin-email" label="Admin email" name="email" placeholder="admin@example.com" required type="email" />
      <AuthField autoComplete="current-password" disabled={submitting} icon="lock" id="admin-password" label="Admin password" name="password" placeholder="Enter admin password" required type="password" />

      <Button className="w-full rounded-xl py-4 text-base" disabled={submitting} type="submit">
        {submitting ? "Signing In..." : "Sign In To Admin"}
      </Button>
    </form>
  );
}
