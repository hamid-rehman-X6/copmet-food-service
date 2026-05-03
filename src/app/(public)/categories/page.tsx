// Public categories page for browsing product groups.
import { categoryRepository } from "@/lib/repositories/mock";

export default async function CategoriesPage() {
  const categories = await categoryRepository.getCategories();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <article
            className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-white p-5"
            key={category.id}
          >
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{category.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
