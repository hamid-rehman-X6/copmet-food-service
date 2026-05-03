// Homepage for public food storefront with featured products.
import Link from "next/link";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { productRepository } from "@/lib/repositories/mock";

export default async function HomePage() {
  const products = await productRepository.getProducts();

  return (
    <section className="space-y-8">
      <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface-soft)] p-6 sm:p-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">Fresh and frozen food delivered fast</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
          Browse quality groceries, frozen packs, and daily essentials from our curated catalog.
        </p>
        <Link href={ROUTES.products}>
          <Button className="mt-5">Explore Products</Button>
        </Link>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Featured Products</h2>
        <ProductGrid products={products.filter((product) => product.isFeatured)} />
      </div>
    </section>
  );
}
