import type { BadgeTone, ImageAsset } from "./common.types";

export type MenuCategory = "All Dishes" | "Bowls" | "Sides" | "Drinks";

export type DietaryFilter = "Vegan" | "GF" | "Organic" | "Nut-Free";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: Exclude<MenuCategory, "All Dishes">;
  tags: string[];
  tagTone: BadgeTone;
  image: ImageAsset;
};
