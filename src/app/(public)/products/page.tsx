// Product listing page with responsive card grid.
import { ProductGrid } from "@/components/products/ProductGrid";
import { productRepository } from "@/lib/repositories/mock";

export default async function ProductsPage() {
  const products = await productRepository.getProducts();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">All Products</h1>
      <ProductGrid products={products} />
    </section>
  );
}
