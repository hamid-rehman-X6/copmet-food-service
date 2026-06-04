import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MenuBrowser } from "@/components/menu/MenuBrowser";

export const metadata: Metadata = {
  title: "Menu | Copmet Food Service",
  description: "Explore handcrafted meals, sides, desserts, and drinks from Copmet Food Service.",
};

type MenuPageProps = {
  searchParams: Promise<{ search?: string | string[] }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { search } = await searchParams;
  const initialSearch = typeof search === "string" ? search : "";

  return (
    <>
      <SiteHeader showCartLabel loginTone="ghost" />
      <main className="page-shell py-10 md:py-12">
        <MenuBrowser initialSearch={initialSearch} />
      </main>
      <SiteFooter newsletter />
    </>
  );
}
