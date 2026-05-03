// Admin product edit page scaffold.
import { notFound } from "next/navigation";
import { productRepository } from "@/lib/repositories/mock";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = (await productRepository.getProducts()).find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">Edit Product</h2>
      <p className="text-sm text-[var(--color-muted)]">
        Edit flow is available through the products API contract and can be wired to a client form in the next iteration.
      </p>
      <pre className="rounded-[var(--radius-sm)] bg-white p-4 text-xs">{JSON.stringify(product, null, 2)}</pre>
    </section>
  );
}
