import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address.").max(254).transform((value) => value.toLowerCase());
const password = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(72, "Password cannot exceed 72 characters.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required.").max(80),
    lastName: z.string().trim().min(1, "Last name is required.").max(80),
    email,
    password,
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(Boolean, "You must accept the terms."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required.").max(72),
  rememberMe: z.boolean().default(false),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
