import type { ImageAsset } from "@/types/common.types";
import type { IconName } from "@/components/common/Icon";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: IconName;
};

// A WhatsApp number that can receive placed orders (managed in admin settings).
export type AdminWhatsappNumber = {
  id: string;
  label: string | null;
  phone: string;
  isActive: boolean;
  createdAt: string;
};

export type AdminStatusTone = "success" | "warning" | "danger" | "neutral" | "primary";

export type AdminMetric = {
  label: string;
  value: string;
  change?: string;
  detail?: string;
  icon: IconName;
  tone: AdminStatusTone;
};

export type AdminDish = {
  id: string;
  name: string;
  detail: string;
  category: string;
  price: number;
  status: "Active" | "Inactive" | "Out of Stock" | "Draft";
  image: ImageAsset;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
  status: "Active" | "Inactive";
};

export type AdminOrder = {
  id: string;
  customer: string;
  items: number;
  total: number;
  placed: string;
  status: "Packing Frozen" | "Cold Delivery" | "Delivered" | "Cancelled";
};
