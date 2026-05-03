// Zod schemas for product payload validation.
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(150),
  description: z.string().min(10).max(1000),
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  price: z.number().min(0),
  unitLabel: z.string().min(1).max(30),
  imageUrl: z.string().url(),
  isFeatured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

export type ProductSchema = z.infer<typeof productSchema>;
export type ProductSchemaInput = z.input<typeof productSchema>;
