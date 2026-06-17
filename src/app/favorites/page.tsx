import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites/FavoritesView";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Your Favorites | Copmet Food Service",
  description: "The frozen meals you've saved for later.",
};

export default function FavoritesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8 sm:py-12 lg:py-16">
        <div className="mb-8 sm:mb-10">
          <h1 className="heading-font text-4xl font-bold tracking-tight sm:text-5xl">Your Favorites</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-lg">Frozen meals you&apos;ve saved for later.</p>
        </div>
        <FavoritesView />
      </main>
      <SiteFooter />
    </>
  );
}
