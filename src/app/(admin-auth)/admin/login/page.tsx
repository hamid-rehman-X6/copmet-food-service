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
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-secondary">Admin access</p>
      <h1 className="heading-font text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Admin panel</h1>
      <p className="mt-4 max-w-md leading-7 text-muted-foreground">
        Use the configured admin email and password to manage menu items, customers, and orders.
      </p>

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
