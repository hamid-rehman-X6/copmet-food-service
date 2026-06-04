import type { DietaryFilter, MenuCategory, MenuItem } from "@/types/menu.types";

export const menuCategories: MenuCategory[] = ["All Dishes", "Bowls", "Sides", "Drinks"];

export const dietaryFilters: DietaryFilter[] = ["Vegan", "GF", "Organic", "Nut-Free"];

export const menuItems: MenuItem[] = [
  {
    id: "harvest-quinoa",
    name: "Harvest Quinoa Bowl",
    description: "Roasted root vegetables, massaged kale, and maple-tahini dressing.",
    price: 14.5,
    rating: 4.9,
    category: "Bowls",
    tags: ["Vegan", "GF"],
    tagTone: "tertiary",
    image: {
      src: "/images/menu/harvest-bowl-img.png",
      alt: "Harvest quinoa bowl with avocado, chickpeas, greens, and roasted vegetables.",
    },
  },
  {
    id: "wild-salmon",
    name: "Wild Salmon Poke",
    description: "Sustainably sourced salmon, edamame, and house citrus ponzu.",
    price: 18,
    rating: 4.7,
    category: "Bowls",
    tags: ["Organic"],
    tagTone: "secondary",
    image: {
      src: "/images/menu/wild-salmon-img.png",
      alt: "Wild salmon poke bowl with edamame and pickled vegetables.",
    },
  },
  {
    id: "heirloom-caprese",
    name: "Heirloom Caprese",
    description: "Local farm tomatoes, buffalo mozzarella, and aged balsamic.",
    price: 12,
    rating: 4.8,
    category: "Sides",
    tags: ["Gluten-Free"],
    tagTone: "tertiary",
    image: {
      src: "/images/menu/heirloom-img.png",
      alt: "Heirloom tomato caprese with fresh mozzarella and basil.",
    },
  },
  {
    id: "herb-sides",
    name: "Herb Roasted Sides",
    description: "Seasonal garden vegetables roasted with thyme and rosemary oil.",
    price: 9,
    rating: 4.6,
    category: "Sides",
    tags: ["Vegan", "GF"],
    tagTone: "tertiary",
    image: {
      src: "/images/menu/herb-roasted-sides-img.png",
      alt: "Roasted asparagus and carrots on a ceramic plate.",
    },
  },
  {
    id: "mint-sparkler",
    name: "Hibiscus Mint Sparkler",
    description: "Cold-pressed hibiscus flowers, fresh mint, and sparkling spring water.",
    price: 6.5,
    rating: 4.9,
    category: "Drinks",
    tags: ["Organic"],
    tagTone: "tertiary",
    image: {
      src: "/images/menu/mint-sparkler-img.png",
      alt: "Ruby hibiscus mint sparkler in a tall glass.",
    },
  },
  {
    id: "green-goddess",
    name: "Green Goddess Salad",
    description: "Butter lettuce, snap peas, radishes, and creamy avocado dressing.",
    price: 13,
    rating: 4.5,
    category: "Sides",
    tags: ["Vegan", "GF"],
    tagTone: "tertiary",
    image: {
      src: "/images/menu/green-salad-img.png",
      alt: "Green goddess salad plated on a sage ceramic dish.",
    },
  },
];
