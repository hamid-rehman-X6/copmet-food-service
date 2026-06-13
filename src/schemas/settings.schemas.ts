import { z } from "zod";

// Validation for the admin settings update. All fields are optional so the admin
// can change only what they need (e.g. just the currency). Currency code is the
// 3-letter ISO 4217 code; locale is a BCP 47 tag used by Intl formatting.
export const updateSettingsSchema = z
  .object({
    currencyCode: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/, "Currency code must be a 3-letter ISO code.")
      .transform((value) => value.toUpperCase()),
    currencyLocale: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{2}(-[A-Za-z0-9]{2,8})*$/, "Enter a valid locale, e.g. en-PK."),
    deliveryFee: z.number().min(0, "Delivery fee cannot be negative.").max(1_000_000),
    freeDeliveryThreshold: z.number().min(0, "Threshold cannot be negative.").max(10_000_000),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, "Provide at least one field to update.");

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
