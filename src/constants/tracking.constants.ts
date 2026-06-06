import type { Courier, TrackingOrder, TrackingStep } from "@/types/tracking.types";

export const trackingSteps: TrackingStep[] = [
  { label: "Packed Frozen", icon: "utensils", state: "complete" },
  { label: "Out for Delivery", icon: "bike", state: "active" },
  { label: "In Your Freezer", icon: "check", state: "pending" },
];

export const courier: Courier = {
  name: "Alex",
  status: "Alex is bringing your frozen order",
  rating: 4.9,
  orders: "2.4k",
  image: {
    src: "/images/tracking/alex-img.png",
    alt: "Portrait of Alex, the delivery courier.",
  },
};

export const trackingOrder: TrackingOrder = {
  id: "#CFS-82910",
  arrival: "15 mins",
  items: [
    { name: "Wild Mushroom Risotto Pack", price: 24 },
    { name: "Herb Roasted Vegetable Pack", price: 12 },
  ],
};

export const deliveryBike = {
  src: "/images/tracking/cycle-img.png",
  alt: "Illustrated delivery bicycle with terracotta frozen meal delivery boxes.",
};
