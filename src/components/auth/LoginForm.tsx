"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schemas/auth.schemas";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import type { AuthUser } from "@/types/auth.types";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const input = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe: formData.get("remember") === "on",
    });

    if (!input.success) {
      setError(input.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiRequest<{ user: AuthUser }>(
        "/api/v1/auth/login",
        { method: "POST", body: JSON.stringify(input.data) },
        { retryOnUnauthorized: false },
      );
      setUser(response.data.user);
      // Honour a safe, internal `?next=` redirect (e.g. from the profile guard);
      // admins always land on the admin dashboard.
      const nextParam = new URLSearchParams(window.location.search).get("next");
      const safeNext = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : null;
      router.push(response.data.user.role === "ADMIN" ? "/admin" : safeNext ?? "/menu");
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
      <AuthField autoComplete="email" disabled={submitting} icon="mail" id="email" label="Email address" name="email" placeholder="name@example.com" required type="email" />
      <AuthField autoComplete="current-password" disabled={submitting} icon="lock" id="password" label="Password" minLength={8} name="password" placeholder="Enter your password" required type="password" />

      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input className="h-4 w-4 accent-primary" disabled={submitting} name="remember" type="checkbox" />
          Remember me
        </label>
      </div>

      <Button className="w-full rounded-xl py-4 text-base" disabled={submitting} type="submit">
        {submitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
