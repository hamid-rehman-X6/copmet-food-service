import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | Copmet Food Service",
  description: "Create your Copmet Food Service account for faster frozen meal ordering and delivery updates.",
};

export default function SignupPage() {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-secondary">Join Copmet</p>
      <h1 className="heading-font text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Create your account</h1>
      <p className="mt-4 max-w-md leading-7 text-muted-foreground">
        Set up your profile for faster frozen meal checkout, saved freezer favorites, and simple order tracking.
      </p>

      <SignupForm />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-primary transition-colors hover:text-primary-container" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
