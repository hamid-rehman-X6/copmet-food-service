import type { QueryResultRow } from "pg";
import { query } from "@/server/db/pool";
import type { ProductCreateInput, ProductUpdateInput } from "@/schemas/catalog.schemas";
import type { AdminProduct, Category, ProductStatus, PublicProduct } from "@/types/catalog.types";

// --- Row types ------------------------------------------------------------

type CategoryRow = QueryResultRow & {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

type ProductRow = QueryResultRow & {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  status: ProductStatus;
  tags: string[];
  image_url: string;
  image_alt: string;
  rating: string;
  popularity: number;
  created_at: Date;
  updated_at: Date;
  category_id: string;
  category_name: string;
  category_slug: string;
};

// --- Mappers (DB row -> API shape) ----------------------------------------

function toCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, slug: row.slug, sortOrder: row.sort_order };
}

function toPublicProduct(row: ProductRow): PublicProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    rating: Number(row.rating),
    popularity: row.popularity,
    createdAt: row.created_at.toISOString(),
    category: row.category_name,
    categorySlug: row.category_slug,
    tags: row.tags,
    image: { src: row.image_url, alt: row.image_alt },
  };
}

function toAdminProduct(row: ProductRow): AdminProduct {
  return {
    ...toPublicProduct(row),
    categoryId: row.category_id,
    status: row.status,
    updatedAt: row.updated_at.toISOString(),
  };
}

// --- Listing --------------------------------------------------------------

export type ProductSort = "popular" | "newest" | "rating" | "price-asc" | "price-desc" | "name";

export type ProductListFilters = {
  statuses?: ProductStatus[];
  search?: string;
  categorySlug?: string;
  tags?: string[];
};

// Whitelisted ORDER BY clauses — never interpolate user input into SQL order.
const sortClauses: Record<ProductSort, string> = {
  popular: "p.popularity DESC, p.created_at DESC",
  newest: "p.created_at DESC",
  rating: "p.rating DESC, p.popularity DESC",
  "price-asc": "p.price ASC",
  "price-desc": "p.price DESC",
  name: "p.name ASC",
};

// Build the shared WHERE clause and its bound parameters from the filters.
function buildWhere(filters: ProductListFilters) {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.statuses?.length) {
    values.push(filters.statuses);
    conditions.push(`p.status = ANY($${values.length}::product_status[])`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
  }

  if (filters.categorySlug) {
    values.push(filters.categorySlug);
    conditions.push(`c.slug = $${values.length}`);
  }

  if (filters.tags?.length) {
    values.push(filters.tags);
    conditions.push(`p.tags @> $${values.length}::text[]`);
  }

  const clause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return { clause, values };
}

const PRODUCT_SELECT = `
  SELECT p.id, p.name, p.slug, p.description, p.price, p.status, p.tags,
         p.image_url, p.image_alt, p.rating, p.popularity, p.created_at, p.updated_at,
         p.category_id, c.name AS category_name, c.slug AS category_slug
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

/** Count products matching the filters (used for pagination metadata). */
export async function countProducts(filters: ProductListFilters) {
  const { clause, values } = buildWhere(filters);
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM products p JOIN categories c ON c.id = p.category_id ${clause}`,
    values,
  );

  return result.rows[0]?.count ? Number(result.rows[0].count) : 0;
}

async function listProductRows(
  filters: ProductListFilters,
  sort: ProductSort,
  limit: number,
  offset: number,
) {
  const { clause, values } = buildWhere(filters);
  values.push(limit, offset);

  const result = await query<ProductRow>(
    `${PRODUCT_SELECT} ${clause}
     ORDER BY ${sortClauses[sort]}
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  return result.rows;
}

/** Public storefront listing — returns lean product objects. */
export async function listPublicProducts(
  filters: ProductListFilters,
  sort: ProductSort,
  limit: number,
  offset: number,
): Promise<PublicProduct[]> {
  const rows = await listProductRows(filters, sort, limit, offset);
  return rows.map(toPublicProduct);
}

/** Admin listing — returns full product objects including status. */
export async function listAdminProducts(
  filters: ProductListFilters,
  sort: ProductSort,
  limit: number,
  offset: number,
): Promise<AdminProduct[]> {
  const rows = await listProductRows(filters, sort, limit, offset);
  return rows.map(toAdminProduct);
}

// --- Single + mutations ---------------------------------------------------

export async function findAdminProductById(id: string): Promise<AdminProduct | null> {
  const result = await query<ProductRow>(`${PRODUCT_SELECT} WHERE p.id = $1 LIMIT 1`, [id]);
  return result.rows[0] ? toAdminProduct(result.rows[0]) : null;
}

export async function findPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
  const result = await query<ProductRow>(
    `${PRODUCT_SELECT} WHERE p.slug = $1 AND p.status = 'ACTIVE' LIMIT 1`,
    [slug],
  );
  return result.rows[0] ? toPublicProduct(result.rows[0]) : null;
}

export async function productSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const result = await query<{ exists: boolean }>(
    `SELECT EXISTS(
       SELECT 1 FROM products WHERE slug = $1 AND ($2::uuid IS NULL OR id <> $2)
     ) AS exists`,
    [slug, excludeId ?? null],
  );
  return Boolean(result.rows[0]?.exists);
}

export async function categoryExists(id: string): Promise<boolean> {
  const result = await query<{ exists: boolean }>(
    "SELECT EXISTS(SELECT 1 FROM categories WHERE id = $1) AS exists",
    [id],
  );
  return Boolean(result.rows[0]?.exists);
}

export async function createProduct(input: ProductCreateInput & { slug: string }): Promise<AdminProduct> {
  const result = await query<ProductRow>(
    `WITH inserted AS (
       INSERT INTO products
         (name, slug, description, category_id, price, status, tags, image_url, image_alt, rating, popularity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *
     )
     ${PRODUCT_SELECT.replace("FROM products p", "FROM inserted p")}`,
    [
      input.name,
      input.slug,
      input.description,
      input.categoryId,
      input.price,
      input.status,
      input.tags,
      input.imageUrl,
      input.imageAlt,
      input.rating,
      input.popularity,
    ],
  );

  return toAdminProduct(result.rows[0]);
}

export async function updateProduct(
  id: string,
  input: ProductUpdateInput & { slug?: string },
): Promise<AdminProduct | null> {
  const result = await query<ProductRow>(
    `WITH updated AS (
       UPDATE products SET
         name = COALESCE($2, name),
         slug = COALESCE($3, slug),
         description = COALESCE($4, description),
         category_id = COALESCE($5, category_id),
         price = COALESCE($6, price),
         status = COALESCE($7, status),
         tags = COALESCE($8, tags),
         image_url = COALESCE($9, image_url),
         image_alt = COALESCE($10, image_alt),
         rating = COALESCE($11, rating),
         popularity = COALESCE($12, popularity),
         updated_at = NOW()
       WHERE id = $1
       RETURNING *
     )
     ${PRODUCT_SELECT.replace("FROM products p", "FROM updated p")}`,
    [
      id,
      input.name ?? null,
      input.slug ?? null,
      input.description ?? null,
      input.categoryId ?? null,
      input.price ?? null,
      input.status ?? null,
      input.tags ?? null,
      input.imageUrl ?? null,
      input.imageAlt ?? null,
      input.rating ?? null,
      input.popularity ?? null,
    ],
  );

  return result.rows[0] ? toAdminProduct(result.rows[0]) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await query("DELETE FROM products WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

// --- Order support --------------------------------------------------------

export type OrderableProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  status: ProductStatus;
};

/** Fetch the pricing/snapshot data needed to build an order from product ids. */
export async function findProductsForOrder(ids: string[]): Promise<OrderableProduct[]> {
  if (ids.length === 0) {
    return [];
  }

  const result = await query<QueryResultRow & { id: string; name: string; price: string; image_url: string; status: ProductStatus }>(
    `SELECT id, name, price, image_url, status FROM products WHERE id = ANY($1::uuid[])`,
    [ids],
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: Number(row.price),
    imageUrl: row.image_url,
    status: row.status,
  }));
}

// --- Categories -----------------------------------------------------------

export async function listCategories(): Promise<Category[]> {
  const result = await query<CategoryRow>(
    "SELECT id, name, slug, sort_order FROM categories ORDER BY sort_order ASC, name ASC",
  );
  return result.rows.map(toCategory);
}
