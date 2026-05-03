// Product domain models and form payload types.
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  unitLabel: string;
  imageUrl: string;
  isFeatured: boolean;
  isAvailable: boolean;
}

export interface ProductSearchQuery {
  search?: string;
  categorySlug?: string;
}
