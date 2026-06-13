// Order fulfilment lifecycle (mirrors the order_status DB enum).
export type OrderStatus = "PENDING" | "PACKING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

export type OrderCustomer = {
  id: string;
  name: string;
  email: string;
};

export type OrderItem = {
  id: string;
  productId: string | null;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

// Lean row used in order lists (admin table, customer history).
export type OrderSummary = {
  id: string;
  reference: string;
  status: OrderStatus;
  total: number;
  currencyCode: string;
  itemCount: number;
  placedAt: string;
  customer: OrderCustomer;
};

// Full order, including line items and the delivery snapshot.
export type OrderDetail = OrderSummary & {
  subtotal: number;
  deliveryFee: number;
  contact: {
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  delivery: {
    address: string;
    city: string;
    postalCode: string | null;
    instructions: string | null;
  };
  items: OrderItem[];
  updatedAt: string;
};
