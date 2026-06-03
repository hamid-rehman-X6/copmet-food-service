import type { ImageAsset } from "./common.types";

export type CartItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  quantity: number;
  image: ImageAsset;
};

export type OrderTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
  points: number;
};

export type FormField = {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "email";
  span?: "full";
};
