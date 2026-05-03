// In-memory repository adapters used until real persistence is plugged in.
import { mockCategories, mockOrders, mockProducts } from "@/lib/repositories/mock/data";
import type {
  CategoryRepository,
  OrderRepository,
  ProductRepository,
} from "@/lib/repositories/types";
import type { OrderLog } from "@/types/order";
import type { Product } from "@/types/product";

class MockProductRepository implements ProductRepository {
  async getProducts(search?: string): Promise<Product[]> {
    if (!search) {
      return [...mockProducts];
    }

    const normalizedSearch = search.toLowerCase();
    return mockProducts.filter((product) =>
      product.name.toLowerCase().includes(normalizedSearch),
    );
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }

  async createProduct(product: Product): Promise<Product> {
    mockProducts.push(product);
    return product;
  }

  async updateProduct(id: string, product: Product): Promise<Product | null> {
    const index = mockProducts.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    mockProducts[index] = product;
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = mockProducts.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    mockProducts.splice(index, 1);
    return true;
  }
}

class MockCategoryRepository implements CategoryRepository {
  async getCategories() {
    return [...mockCategories];
  }
}

class MockOrderRepository implements OrderRepository {
  async getOrders() {
    return [...mockOrders];
  }

  async createOrder(order: OrderLog) {
    mockOrders.push(order);
    return order;
  }
}

export const productRepository = new MockProductRepository();
export const categoryRepository = new MockCategoryRepository();
export const orderRepository = new MockOrderRepository();
