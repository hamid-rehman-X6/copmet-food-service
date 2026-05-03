// Order log entities for WhatsApp inquiry records.
export interface OrderLog {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  variant: string;
  createdAt: string;
}
