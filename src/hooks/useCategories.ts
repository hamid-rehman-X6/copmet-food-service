// Category data hook for client-side category fetches.
"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      const response = await fetch("/api/categories");
      const body = (await response.json()) as { data: Category[] | null };
      setCategories(body.data ?? []);
      setIsLoading(false);
    }
    void getCategories();
  }, []);

  return { categories, isLoading };
}
