import { z } from "zod";

// Validation for placing an order. The client only sends product ids and
// quantities — never prices. The server recomputes all monetary values from the
// database so totals cannot be tampered with.
export const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product."),
        quantity: z.number().int().min(1, "Quantity must be at least 1.").max(99),
      }),
    )
    .min(1, "Your cart is empty."),
  contact: z.object({
    firstName: z.string().trim().min(1, "First name is required.").max(80),
    lastName: z.string().trim().min(1, "Last name is required.").max(80),
    phone: z.string().trim().max(40).optional(),
  }),
  delivery: z.object({
    address: z.string().trim().min(1, "Delivery address is required.").max(500),
    city: z.string().trim().min(1, "City is required.").max(120),
    postalCode: z.string().trim().max(20).optional(),
    instructions: z.string().trim().max(500).optional(),
  }),
});

export const orderStatuses = ["PENDING", "PACKING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as const;

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
