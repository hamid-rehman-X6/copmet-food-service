// Repository interfaces that isolate persistence from app features.
import type { Category } from "@/types/category";
import type { OrderLog } from "@/types/order";
import type { Product } from "@/types/product";

export interface ProductRepository {
  getProducts(search?: string): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(id: string, product: Product): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}

export interface CategoryRepository {
  getCategories(): Promise<Category[]>;
}

export interface OrderRepository {
  getOrders(): Promise<OrderLog[]>;
  createOrder(order: OrderLog): Promise<OrderLog>;
}
