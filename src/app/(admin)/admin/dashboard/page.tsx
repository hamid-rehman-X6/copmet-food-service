// Admin dashboard page with high-level metrics.
import { StatsCard } from "@/components/admin/StatsCard";
import { categoryRepository, orderRepository, productRepository } from "@/lib/repositories/mock";

export default async function AdminDashboardPage() {
  const [products, categories, orders] = await Promise.all([
    productRepository.getProducts(),
    categoryRepository.getCategories(),
    orderRepository.getOrders(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard label="Total Products" value={products.length} />
      <StatsCard label="Total Categories" value={categories.length} />
      <StatsCard label="Recent Orders" value={orders.length} />
    </div>
  );
}
