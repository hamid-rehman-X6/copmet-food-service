import type { CartItem, FormField, OrderTotals } from "@/types/checkout.types";

export const checkoutItems: CartItem[] = [
  {
    id: "grain-bowl",
    name: "Mediterranean Grain Bowl",
    detail: "Regular Size - Extra Avocado",
    price: 16.5,
    quantity: 1,
    image: {
      src: "/images/secure-checkout/grain-bowl-img.png",
      alt: "Mediterranean grain bowl with colorful vegetables.",
    },
  },
  {
    id: "dark-torte",
    name: "Artisanal Dark Torte",
    detail: "Single Slice",
    price: 9,
    quantity: 2,
    image: {
      src: "/images/secure-checkout/dark-torte-img.png",
      alt: "Slice of dark chocolate torte with raspberry.",
    },
  },
];

export const checkoutTotals: OrderTotals = {
  subtotal: 34.5,
  deliveryFee: 4.99,
  total: 39.49,
  points: 40,
};

export const deliveryFields: FormField[] = [
  { id: "firstName", label: "First Name", placeholder: "Enter first name" },
  { id: "lastName", label: "Last Name", placeholder: "Enter last name" },
  { id: "address", label: "Delivery Address", placeholder: "Street address, apartment, suite", span: "full" },
  { id: "city", label: "City", placeholder: "City" },
  { id: "postalCode", label: "Postal Code", placeholder: "ZIP/Postal code" },
];
