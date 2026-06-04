import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Copmet Food Service",
  description: "Sign in to manage your Copmet Food Service account and orders.",
};

export default function LoginPage() {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-secondary">Account access</p>
      <h1 className="heading-font text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Welcome back</h1>
      <p className="mt-4 max-w-md leading-7 text-muted-foreground">
        Sign in to review your orders, manage delivery details, and return to your saved favorites.
      </p>

      <LoginForm />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to Copmet?{" "}
        <Link className="font-semibold text-primary transition-colors hover:text-primary-container" href="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}
