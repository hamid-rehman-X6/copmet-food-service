import { z } from "zod";

// Shared product validation used by both the admin form (React Hook Form) and
// the API route handlers, so the client and server enforce identical rules.

export const productStatuses = ["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "DRAFT"] as const;

const name = z.string().trim().min(1, "Name is required.").max(160);
const description = z.string().trim().max(2000).default("");
const price = z.number({ message: "Price is required." }).min(0, "Price cannot be negative.").max(10_000_000);
const tags = z.array(z.string().trim().min(1).max(40)).max(12).default([]);
const imageUrl = z.string().trim().max(500).default("");
const imageAlt = z.string().trim().max(200).default("");
const rating = z.number().min(0).max(5).default(0);
const popularity = z.number().int().min(0).max(1_000_000).default(0);

export const productCreateSchema = z.object({
  name,
  description,
  categoryId: z.string().uuid("Select a valid category."),
  price,
  status: z.enum(productStatuses).default("DRAFT"),
  tags,
  imageUrl,
  imageAlt,
  rating,
  popularity,
});

// Every field is optional on update; the service patches only what is provided.
export const productUpdateSchema = z
  .object({
    name,
    description,
    categoryId: z.string().uuid("Select a valid category."),
    price,
    status: z.enum(productStatuses),
    tags,
    imageUrl,
    imageAlt,
    rating,
    popularity,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, "Provide at least one field to update.");

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
