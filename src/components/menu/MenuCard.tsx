"use client";

import Image from "next/image";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useCartStore } from "@/stores/cart.store";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { Button } from "@/components/common/Button";
import { Chip } from "@/components/common/Chip";
import { Icon } from "@/components/common/Icon";
import type { BadgeTone } from "@/types/common.types";
import type { PublicProduct } from "@/types/catalog.types";

// Deterministic chip tone per category so the storefront stays visually varied
// without storing presentation data in the database.
const categoryTones: Record<string, BadgeTone> = {
  "family-packs": "primary",
  mains: "secondary",
  sides: "tertiary",
  breakfast: "primary",
  desserts: "secondary",
};

export function MenuCard({ product }: { product: PublicProduct }) {
  const { format } = useCurrency();
  const addToCart = useAddToCart();
  const quantity = useCartStore((state) => state.items.find((cartItem) => cartItem.id === product.id)?.quantity ?? 0);
  const tone = categoryTones[product.categorySlug] ?? "tertiary";

  return (
    <article className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
      <div className="relative h-56 overflow-hidden sm:h-64">
        <Image
          alt={product.image.alt}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={product.image.src}
        />
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 shadow-sm backdrop-blur">
          <Icon className="h-4 w-4 fill-secondary text-secondary" name="star" />
          <span className="text-sm font-semibold">{product.rating}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="heading-font text-xl font-semibold leading-tight sm:text-2xl">{product.name}</h2>
          <span className="heading-font whitespace-nowrap text-lg font-semibold text-primary sm:text-xl">
            {format(product.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
        <div className="mt-auto grid gap-3 pt-2">
          <div className="flex min-w-0 flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Chip key={tag} tone={tone}>
                {tag}
              </Chip>
            ))}
          </div>
          <Button
            aria-label={`Add ${product.name} to freezer cart${quantity > 0 ? `. ${quantity} currently in cart` : ""}`}
            className="h-11 w-full whitespace-nowrap px-4 py-2"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                detail: [product.category, ...product.tags].join(" - "),
                price: product.price,
                image: product.image,
              })
            }
            size="sm"
          >
            Add to Freezer Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
