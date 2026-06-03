import type { ImageAsset } from "./common.types";

export type TrackingStep = {
  label: string;
  icon: "utensils" | "bike" | "check";
  state: "complete" | "active" | "pending";
};

export type Courier = {
  name: string;
  status: string;
  rating: number;
  orders: string;
  image: ImageAsset;
};

export type TrackingOrderItem = {
  name: string;
  price: number;
};

export type TrackingOrder = {
  id: string;
  arrival: string;
  items: TrackingOrderItem[];
};
