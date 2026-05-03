// Zod schemas for category payload validation.
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(150),
  description: z.string().min(10).max(500),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export type CategorySchema = z.infer<typeof categorySchema>;
