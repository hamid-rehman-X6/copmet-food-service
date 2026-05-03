// Admin categories management overview page.
import { DataTable } from "@/components/admin/DataTable";
import { categoryRepository } from "@/lib/repositories/mock";
import type { Category } from "@/types/category";

export default async function AdminCategoriesPage() {
  const categories = await categoryRepository.getCategories();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Categories</h2>
      <DataTable<Category>
        columns={[
          { key: "name", header: "Name", render: (row) => row.name },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "status", header: "Status", render: (row) => (row.isActive ? "Active" : "Inactive") },
        ]}
        rows={categories}
      />
    </section>
  );
}
