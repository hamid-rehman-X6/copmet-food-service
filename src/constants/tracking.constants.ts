import type { Courier, TrackingOrder, TrackingStep } from "@/types/tracking.types";

export const trackingSteps: TrackingStep[] = [
  { label: "Preparing", icon: "utensils", state: "complete" },
  { label: "On the Way", icon: "bike", state: "active" },
  { label: "Delivered", icon: "check", state: "pending" },
];

export const courier: Courier = {
  name: "Alex",
  status: "Alex is on the way",
  rating: 4.9,
  orders: "2.4k",
  image: {
    src: "/images/tracking/alex-img.png",
    alt: "Portrait of Alex, the delivery courier.",
  },
};

export const trackingOrder: TrackingOrder = {
  id: "#NG-82910",
  arrival: "15 mins",
  items: [
    { name: "Wild Mushroom Risotto", price: 24 },
    { name: "Honey Glazed Carrots", price: 12 },
  ],
};

export const deliveryBike = {
  src: "/images/tracking/cycle-img.png",
  alt: "Illustrated delivery bicycle with warm terracotta delivery boxes.",
};
