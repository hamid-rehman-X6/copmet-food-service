// Product data hook for client-side product fetches.
"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("/api/products");
      const body = (await response.json()) as { data: Product[] | null };
      setProducts(body.data ?? []);
      setIsLoading(false);
    }
    void getProducts();
  }, []);

  return { products, isLoading };
}
