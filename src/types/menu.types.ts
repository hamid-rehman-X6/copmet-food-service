import type { BadgeTone, ImageAsset } from "./common.types";

export type MenuCategory = "All Dishes" | "Family Packs" | "Mains" | "Sides" | "Breakfast" | "Desserts";

export type DietaryFilter = "Vegan" | "GF" | "Organic" | "Nut-Free";

export type MenuSort = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  popularity: number;
  createdAt: string;
  category: Exclude<MenuCategory, "All Dishes">;
  tags: DietaryFilter[];
  tagTone: BadgeTone;
  image: ImageAsset;
};
