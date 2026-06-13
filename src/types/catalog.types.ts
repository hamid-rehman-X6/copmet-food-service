import type { ImageAsset } from "@/types/common.types";

// Product availability lifecycle (mirrors the product_status DB enum).
export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DRAFT";

export type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

// Shape returned to the public storefront — lean, no internal/admin fields.
export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  rating: number;
  popularity: number;
  createdAt: string;
  category: string;
  categorySlug: string;
  tags: string[];
  image: ImageAsset;
};

// Shape returned to the admin panel — adds management-only fields.
export type AdminProduct = PublicProduct & {
  categoryId: string;
  status: ProductStatus;
  updatedAt: string;
};
