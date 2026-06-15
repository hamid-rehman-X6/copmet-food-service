import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Page Not Found | Copmet Food Service",
  description: "The page you were looking for could not be found.",
};

// Global 404 screen, rendered for any route that does not match. Keeps the site
// chrome (header/footer) and offers clear paths back into the app.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center sm:py-24">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-low text-primary">
          <Icon className="h-10 w-10" name="helpCircle" />
        </span>
        <p className="heading-font mt-8 text-6xl font-bold tracking-tight text-primary sm:text-7xl">404</p>
        <h1 className="heading-font mt-4 text-2xl font-semibold sm:text-3xl">This page is out of stock</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          The page you are looking for may have been moved, removed, or never existed. Let&apos;s get you back to the
          good stuff.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
            href="/menu"
          >
            <Icon className="h-4 w-4" name="utensils" />
            Browse the Menu
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-low"
            href="/"
          >
            <Icon className="h-4 w-4" name="home" />
            Back to Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
