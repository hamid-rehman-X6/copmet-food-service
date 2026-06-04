import type { Metadata } from "next";
import { menuItems } from "@/constants/menu.constants";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuSidebar } from "@/components/menu/MenuSidebar";

export const metadata: Metadata = {
  title: "Menu | Copmet Food Service",
  description: "Explore handcrafted meals, sides, desserts, and drinks from Copmet Food Service.",
};

export default function MenuPage() {
  return (
    <>
      <SiteHeader showCartLabel loginTone="ghost" />
      <main className="page-shell py-10 md:py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          <MenuSidebar />
          <section className="flex-1">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="heading-font text-5xl font-bold tracking-tight text-foreground">Explore the Menu</h1>
                <p className="mt-2 text-lg text-muted-foreground">Hand-crafted meals for shared moments.</p>
              </div>
              <label className="hidden items-center gap-3 rounded-xl bg-surface-low px-6 py-4 lg:flex">
                <span className="text-sm font-semibold text-muted-foreground">Sort:</span>
                <select className="bg-transparent text-sm font-semibold text-primary outline-none">
                  <option>Popularity</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                </select>
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {menuItems.map((item) => (
                <MenuCard item={item} key={item.id} />
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <Button className="border-2 border-border px-10 py-4" variant="outline">
                Load More Seasonal Specials
                <Icon className="h-4 w-4" name="chevronDown" />
              </Button>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter newsletter />
    </>
  );
}
