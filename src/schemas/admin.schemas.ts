import { z } from "zod";

// Normalize to digits only, then require international format (7–15 digits).
const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[^0-9]/g, ""))
  .refine((value) => /^\d{7,15}$/.test(value), "Enter a valid number in international format (digits only, e.g. 923001234567).");

const label = z.string().trim().max(60, "Label is too long.");

export const createWhatsappNumberSchema = z.object({
  label: label.optional(),
  phone,
  isActive: z.boolean().optional(),
});

export const updateWhatsappNumberSchema = z
  .object({
    label: label.optional(),
    phone: phone.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "Provide at least one field to update.");

export type CreateWhatsappNumberInput = z.infer<typeof createWhatsappNumberSchema>;
export type UpdateWhatsappNumberInput = z.infer<typeof updateWhatsappNumberSchema>;

export const updateAdminProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80, "Name is too long."),
});

export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;
