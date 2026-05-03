// Mock data seeds for phase-1 repository implementations.
import type { Category } from "@/types/category";
import type { OrderLog } from "@/types/order";
import type { Product } from "@/types/product";

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Frozen Foods",
    slug: "frozen-foods",
    description: "Frozen ready-to-cook and ready-to-eat items.",
    isActive: true,
  },
  {
    id: "cat-2",
    name: "Fresh Produce",
    slug: "fresh-produce",
    description: "Daily fresh fruits and vegetables.",
    isActive: true,
  },
];

export const mockProducts: Product[] = [
  {
    id: "prd-1",
    name: "Frozen Chicken Nuggets",
    slug: "frozen-chicken-nuggets",
    description: "Crispy frozen nuggets packed for family servings.",
    categoryId: "cat-1",
    categoryName: "Frozen Foods",
    price: 7.99,
    unitLabel: "pack",
    imageUrl:
      "https://images.unsplash.com/photo-1604908177073-40ac145e8078?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: "prd-2",
    name: "Organic Broccoli",
    slug: "organic-broccoli",
    description: "Farm-fresh broccoli with same-day cold-chain delivery.",
    categoryId: "cat-2",
    categoryName: "Fresh Produce",
    price: 3.49,
    unitLabel: "kg",
    imageUrl:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    isAvailable: true,
  },
];

export const mockOrders: OrderLog[] = [];
