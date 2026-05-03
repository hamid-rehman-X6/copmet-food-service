// Zod schemas for admin authentication requests.
import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
