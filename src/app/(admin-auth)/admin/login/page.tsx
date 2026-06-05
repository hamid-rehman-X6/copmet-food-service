import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In | Copmet Food Service",
  description: "Sign in to the Copmet Food Service admin panel.",
};

export default function AdminLoginPage() {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary">Admin access</p>
      <h1 className="heading-font text-3xl font-bold leading-tight text-foreground sm:text-4xl">Admin panel</h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Operations access for Copmet Food Service.</p>

      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Looking for customer access?{" "}
        <Link className="font-semibold text-primary transition-colors hover:text-primary-container" href="/login">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
