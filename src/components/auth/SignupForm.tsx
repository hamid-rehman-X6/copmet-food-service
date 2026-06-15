"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/auth.schemas";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormAlert } from "@/components/auth/AuthFormAlert";
import { Button } from "@/components/common/Button";
import type { AuthUser } from "@/types/auth.types";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const input = signupSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      termsAccepted: formData.get("terms") === "on",
    });

    if (!input.success) {
      setError(input.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiRequest<{ user: AuthUser }>(
        "/api/v1/auth/signup",
        { method: "POST", body: JSON.stringify(input.data) },
        { retryOnUnauthorized: false },
      );
      setUser(response.data.user);
      // Honour a safe, internal `?next=` redirect (e.g. when signing up mid-checkout).
      const nextParam = new URLSearchParams(window.location.search).get("next");
      const safeNext = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : null;
      router.push(safeNext ?? "/menu");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof ApiClientError ? requestError.message : "Unable to create your account right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <AuthFormAlert message={error} />
      <div className="grid gap-5 min-[480px]:grid-cols-2">
        <AuthField autoComplete="given-name" disabled={submitting} icon="user" id="firstName" label="First name" name="firstName" placeholder="First name" required />
        <AuthField autoComplete="family-name" disabled={submitting} icon="user" id="lastName" label="Last name" name="lastName" placeholder="Last name" required />
      </div>
      <AuthField autoComplete="email" disabled={submitting} icon="mail" id="email" label="Email address" name="email" placeholder="name@example.com" required type="email" />
      <AuthField autoComplete="new-password" disabled={submitting} icon="lock" id="password" label="Password" minLength={8} name="password" placeholder="At least 8 characters, including a number" required type="password" />
      <AuthField autoComplete="new-password" disabled={submitting} icon="lock" id="confirmPassword" label="Confirm password" minLength={8} name="confirmPassword" placeholder="Re-enter your password" required type="password" />

      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input className="mt-1 h-4 w-4 shrink-0 accent-primary" disabled={submitting} name="terms" required type="checkbox" />
        <span>
          I agree to the <Link className="font-semibold text-primary hover:underline" href="/terms">Terms of Service</Link>{" "}
          and <Link className="font-semibold text-primary hover:underline" href="/privacy">Privacy Policy</Link>.
        </span>
      </label>

      <Button className="w-full rounded-xl py-4 text-base" disabled={submitting} type="submit">
        {submitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
