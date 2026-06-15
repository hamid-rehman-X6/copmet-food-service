import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Copmet Food Service",
  description: "Sign in to manage your Copmet Food Service frozen meal orders.",
};

// Keep a safe internal `?next=` value so switching to signup preserves the
// post-login destination (e.g. returning to checkout after adding to cart).
function safeNext(value: string | string[] | undefined) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const next = safeNext((await searchParams).next);
  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-secondary">Account access</p>
      <h1 className="heading-font text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Welcome back</h1>
      <p className="mt-4 max-w-md leading-7 text-muted-foreground">
        Sign in to review your frozen meal orders, manage delivery details, and return to your saved freezer favorites.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Managing Copmet operations?{" "}
        <Link className="font-semibold text-primary transition-colors hover:text-primary-container" href="/admin/login">
          Continue to admin access
        </Link>
      </p>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to Copmet?{" "}
        <Link className="font-semibold text-primary transition-colors hover:text-primary-container" href={signupHref}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
