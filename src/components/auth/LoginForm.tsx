"use client";

import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/common/Button";

export function LoginForm() {
  return (
    <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
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
        autoComplete="current-password"
        icon="lock"
        id="password"
        label="Password"
        minLength={8}
        name="password"
        placeholder="Enter your password"
        required
        type="password"
      />

      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input className="h-4 w-4 accent-primary" name="remember" type="checkbox" />
          Remember me
        </label>
      </div>

      <Button className="w-full rounded-xl py-4 text-base" type="submit">
        Sign In
      </Button>
    </form>
  );
}
