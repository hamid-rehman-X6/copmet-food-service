"use client";

import { useState } from "react";
import Image from "next/image";
import { useAddToCart } from "@/hooks/useAddToCart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { useFavoritesStore } from "@/stores/favorites.store";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/common/Button";
import { Chip } from "@/components/common/Chip";
import { Icon } from "@/components/common/Icon";
import type { BadgeTone } from "@/types/common.types";
import type { PublicProduct } from "@/types/catalog.types";

// Deterministic chip tone per category, matching the menu card styling.
const categoryTones: Record<string, BadgeTone> = {
  "family-packs": "primary",
  mains: "secondary",
  sides: "tertiary",
  breakfast: "primary",
  desserts: "secondary",
};

export function ProductDetail({ product }: { product: PublicProduct }) {
  const { format } = useCurrency();
  const addToCart = useAddToCart();
  const tone = categoryTones[product.categorySlug] ?? "tertiary";

  const inCart = useCartStore((state) => state.items.find((item) => item.id === product.id)?.quantity ?? 0);
  const [qty, setQty] = useState(1);

  const { toast } = useToast();
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const isFavorite = useFavoritesStore((state) => state.items.some((item) => item.id === product.id));

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-surface-low shadow-[var(--shadow-soft)]">
        <Image
          alt={product.image.alt}
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
          src={product.image.src}
        />
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 shadow-sm backdrop-blur">
          <Icon className="h-4 w-4 fill-secondary text-secondary" name="star" />
          <span className="text-sm font-semibold">{product.rating}</span>
        </div>
        <button
          aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
          aria-pressed={isFavorite}
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/90 shadow-sm backdrop-blur transition-colors hover:bg-card"
          onClick={() => {
            toggleFavorite(product);
            toast(isFavorite ? `${product.name} removed from favorites` : `${product.name} saved to favorites`);
          }}
          type="button"
        >
          <Icon className={cn("h-5 w-5", isFavorite ? "fill-error text-error" : "text-muted-foreground")} name="heart" />
        </button>
      </div>

      <div className="flex flex-col">
        <Chip className="w-fit" tone={tone}>
          {product.category}
        </Chip>
        <h1 className="heading-font mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {product.name}
        </h1>
        <p className="heading-font mt-3 text-2xl font-semibold text-primary sm:text-3xl">{format(product.price)}</p>
        <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">{product.description}</p>

        {product.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Chip key={tag} tone="neutral">
                {tag}
              </Chip>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center rounded-full border border-border bg-surface-low px-1 py-1">
            <button
              aria-label={`Decrease quantity of ${product.name}`}
              className="grid h-10 w-10 place-items-center text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
              disabled={qty === 1}
              onClick={() => setQty((current) => Math.max(1, current - 1))}
              type="button"
            >
              <Icon className="h-4 w-4" name="minus" />
            </button>
            <span className="min-w-9 px-1 text-center text-base font-semibold">{qty}</span>
            <button
              aria-label={`Increase quantity of ${product.name}`}
              className="grid h-10 w-10 place-items-center text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setQty((current) => Math.min(99, current + 1))}
              type="button"
            >
              <Icon className="h-4 w-4" name="plus" />
            </button>
          </div>
          <Button
            aria-label={`Add ${qty} ${product.name} to freezer cart${inCart > 0 ? `. ${inCart} currently in cart` : ""}`}
            className="h-12 flex-1"
            onClick={() => {
              addToCart(
                {
                  id: product.id,
                  name: product.name,
                  detail: [product.category, ...product.tags].join(" - "),
                  price: product.price,
                  image: product.image,
                },
                qty,
              );
              setQty(1);
            }}
            size="lg"
          >
            <Icon className="h-5 w-5" name="cart" />
            Add to Cart
          </Button>
        </div>

        {inCart > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{inCart}</span> already in your cart.
          </p>
        ) : null}
      </div>
    </div>
  );
}
