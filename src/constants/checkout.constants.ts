import type { CartItem, FormField } from "@/types/checkout.types";

export const initialCartItems: CartItem[] = [
  {
    id: "harvest-quinoa",
    name: "Vegetable Quinoa Freezer Bowl",
    detail: "Mains - Vegan - GF",
    price: 14.5,
    quantity: 1,
    image: {
      src: "/images/menu/harvest-bowl-img.png",
      alt: "Harvest quinoa bowl with avocado, chickpeas, greens, and roasted vegetables.",
    },
  },
  {
    id: "mint-sparkler",
    name: "Mint Lemonade Concentrate",
    detail: "Sides - Organic - Nut-Free",
    price: 6.5,
    quantity: 2,
    image: {
      src: "/images/menu/mint-sparkler-img.png",
      alt: "Ruby hibiscus mint sparkler in a tall glass.",
    },
  },
];

export const checkoutConfig = {
  deliveryFee: 4.99,
  freeDeliveryThreshold: 45,
  pointsPerDollar: 1,
} as const;

export const deliveryFields: FormField[] = [
  { id: "firstName", label: "First Name", placeholder: "Enter first name" },
  { id: "lastName", label: "Last Name", placeholder: "Enter last name" },
  { id: "address", label: "Frozen Meal Delivery Address", placeholder: "Street address, apartment, suite", span: "full" },
  { id: "city", label: "City", placeholder: "City" },
  { id: "postalCode", label: "Postal Code", placeholder: "ZIP/Postal code" },
];
