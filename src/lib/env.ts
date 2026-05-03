// Runtime environment validation and typed env accessor.
import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1).default("dev-secret-change-me"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(6).default("15550000000"),
  ADMIN_EMAIL: z.string().email().default("admin@competfood.local"),
  ADMIN_PASSWORD: z.string().min(8).default("change-me-now"),
});

export const env = envSchema.parse({
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
});
