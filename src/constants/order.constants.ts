import type { AdminStatusTone } from "@/types/admin.types";
import type { OrderStatus } from "@/types/order.types";

// Human-friendly labels and badge tones for the order status enum.
export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PACKING: "Packing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const orderStatusTones: Record<OrderStatus, AdminStatusTone> = {
  PENDING: "neutral",
  PACKING: "warning",
  OUT_FOR_DELIVERY: "primary",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export const orderStatusOptions: { label: string; value: OrderStatus }[] = (
  Object.keys(orderStatusLabels) as OrderStatus[]
).map((status) => ({ label: orderStatusLabels[status], value: status }));
