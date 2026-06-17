import { z } from "zod";
import { emailSchema, passwordSchema } from "@/schemas/auth.schemas";

// Update the user's display name and email. Shared by the profile form and the
// PATCH /api/v1/profile route handler.
export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  email: emailSchema,
});

// Change password. The current password is required to authorise the change,
// and the new password must be confirmed and differ from the current one.
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(72),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Choose a password different from your current one.",
    path: ["newPassword"],
  });

// Saved default delivery details. All fields are optional so a customer can
// store as much or as little as they like; blank fields clear the saved value.
export const deliveryDefaultsSchema = z.object({
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(20).optional(),
  instructions: z.string().trim().max(500).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeliveryDefaultsInput = z.infer<typeof deliveryDefaultsSchema>;
