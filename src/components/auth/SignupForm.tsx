"use client";

import Link from "next/link";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/common/Button";

export function SignupForm() {
  return (
    <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField
          autoComplete="given-name"
          icon="user"
          id="firstName"
          label="First name"
          name="firstName"
          placeholder="First name"
          required
        />
        <AuthField
          autoComplete="family-name"
          icon="user"
          id="lastName"
          label="Last name"
          name="lastName"
          placeholder="Last name"
          required
        />
      </div>
      <AuthField
        autoComplete="email"
        icon="mail"
        id="email"
        label="Email address"
        name="email"
        placeholder="name@example.com"
        required
        type="email"
      />
      <AuthField
        autoComplete="new-password"
        icon="lock"
        id="password"
        label="Password"
        minLength={8}
        name="password"
        placeholder="Create at least 8 characters"
        required
        type="password"
      />
      <AuthField
        autoComplete="new-password"
        icon="lock"
        id="confirmPassword"
        label="Confirm password"
        minLength={8}
        name="confirmPassword"
        placeholder="Re-enter your password"
        required
        type="password"
      />

      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input className="mt-1 h-4 w-4 shrink-0 accent-primary" name="terms" required type="checkbox" />
        <span>
          I agree to the <Link className="font-semibold text-primary hover:underline" href="/">Terms of Service</Link>{" "}
          and <Link className="font-semibold text-primary hover:underline" href="/">Privacy Policy</Link>.
        </span>
      </label>

      <Button className="w-full rounded-xl py-4 text-base" type="submit">
        Create Account
      </Button>
    </form>
  );
}
