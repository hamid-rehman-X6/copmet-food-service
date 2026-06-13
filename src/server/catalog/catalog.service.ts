import { errors } from "@/server/api/errors";
import { buildPageMeta, type Pagination } from "@/server/api/pagination";
import {
  categoryExists,
  countProducts,
  createProduct,
  deleteProduct,
  findAdminProductById,
  listAdminProducts,
  listCategories,
  listPublicProducts,
  productSlugExists,
  updateProduct,
  type ProductListFilters,
  type ProductSort,
} from "@/server/catalog/catalog.repository";
import { slugify } from "@/lib/utils";
import type { ProductCreateInput, ProductUpdateInput } from "@/schemas/catalog.schemas";
import type { AdminProduct, Category, PublicProduct } from "@/types/catalog.types";
import type { Paginated } from "@/types/common.types";

type ListOptions = {
  filters: ProductListFilters;
  sort: ProductSort;
  pagination: Pagination;
};

/** Public storefront product listing with filters + pagination. */
export async function listPublicProductsService(options: ListOptions): Promise<Paginated<PublicProduct>> {
  const filters: ProductListFilters = { ...options.filters, statuses: ["ACTIVE"] };
  const [items, totalItems] = await Promise.all([
    listPublicProducts(filters, options.sort, options.pagination.limit, options.pagination.offset),
    countProducts(filters),
  ]);

  return { items, meta: buildPageMeta(options.pagination, totalItems) };
}

/** Admin product listing — all statuses, optional status filter. */
export async function listAdminProductsService(options: ListOptions): Promise<Paginated<AdminProduct>> {
  const [items, totalItems] = await Promise.all([
    listAdminProducts(options.filters, options.sort, options.pagination.limit, options.pagination.offset),
    countProducts(options.filters),
  ]);

  return { items, meta: buildPageMeta(options.pagination, totalItems) };
}

export async function getAdminProductService(id: string): Promise<AdminProduct> {
  const product = await findAdminProductById(id);

  if (!product) {
    throw errors.notFound("Product not found.");
  }

  return product;
}

// Generate a unique slug from the name, appending a numeric suffix on collision
// so two products with the same name don't violate the unique constraint.
async function generateUniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "product";
  let candidate = base;
  let suffix = 2;

  while (await productSlugExists(candidate, excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function createProductService(input: ProductCreateInput): Promise<AdminProduct> {
  if (!(await categoryExists(input.categoryId))) {
    throw errors.badRequest("The selected category does not exist.");
  }

  const slug = await generateUniqueSlug(input.name);
  return createProduct({ ...input, slug });
}

export async function updateProductService(id: string, input: ProductUpdateInput): Promise<AdminProduct> {
  if (input.categoryId && !(await categoryExists(input.categoryId))) {
    throw errors.badRequest("The selected category does not exist.");
  }

  // Keep the slug in sync when the product is renamed.
  const slug = input.name ? await generateUniqueSlug(input.name, id) : undefined;
  const product = await updateProduct(id, { ...input, slug });

  if (!product) {
    throw errors.notFound("Product not found.");
  }

  return product;
}

export async function deleteProductService(id: string): Promise<void> {
  const deleted = await deleteProduct(id);

  if (!deleted) {
    throw errors.notFound("Product not found.");
  }
}

export async function listCategoriesService(): Promise<Category[]> {
  return listCategories();
}
