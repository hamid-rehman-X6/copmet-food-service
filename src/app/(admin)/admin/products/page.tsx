// Admin products listing page with shared data table.
import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { productRepository } from "@/lib/repositories/mock";
import type { Product } from "@/types/product";

export default async function AdminProductsPage() {
  const products = await productRepository.getProducts();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link href={ROUTES.adminNewProduct}>
          <Button>New Product</Button>
        </Link>
      </div>
      <DataTable<Product>
        columns={[
          { key: "name", header: "Name", render: (row) => row.name },
          { key: "category", header: "Category", render: (row) => row.categoryName },
          { key: "price", header: "Price", render: (row) => `$${row.price.toFixed(2)}` },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <Link className="text-[var(--color-primary)]" href={`${ROUTES.adminProducts}/${row.id}/edit`}>
                Edit
              </Link>
            ),
          },
        ]}
        rows={products}
      />
    </section>
  );
}
