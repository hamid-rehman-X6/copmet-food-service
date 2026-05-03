// Admin product creation page with API submission.
"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ROUTES } from "@/constants/routes";
import type { ProductSchema } from "@/schemas/product.schema";

export default function NewProductPage() {
  const router = useRouter();

  async function createProduct(values: ProductSchema): Promise<void> {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    router.push(ROUTES.adminProducts);
  }

  return (
    <section className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Create Product</h2>
      <ProductForm onSubmitForm={createProduct} />
    </section>
  );
}
