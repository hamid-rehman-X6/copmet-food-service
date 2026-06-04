"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/common/Button";
import { Chip } from "@/components/common/Chip";
import { Icon } from "@/components/common/Icon";
import { formatCurrency } from "@/lib/formatters";
import type { MenuItem } from "@/types/menu.types";

export function MenuCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const quantity = useCartStore((state) => state.items.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0);

  return (
    <article className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
      <div className="relative h-56 overflow-hidden sm:h-64">
        <Image
          alt={item.image.alt}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={item.image.src}
        />
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 shadow-sm backdrop-blur">
          <Icon className="h-4 w-4 fill-secondary text-secondary" name="star" />
          <span className="text-sm font-semibold">{item.rating}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="heading-font text-xl font-semibold leading-tight sm:text-2xl">{item.name}</h2>
          <span className="heading-font whitespace-nowrap text-lg font-semibold text-primary sm:text-xl">
            {formatCurrency(item.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
        <div className="mt-auto grid gap-3 pt-2">
          <div className="flex min-w-0 flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Chip key={tag} tone={item.tagTone}>
                {tag}
              </Chip>
            ))}
          </div>
          <Button
            aria-label={`Add ${item.name} to cart${quantity > 0 ? `. ${quantity} currently in cart` : ""}`}
            className="h-11 w-full whitespace-nowrap px-4 py-2"
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                detail: [item.category, ...item.tags].join(" - "),
                price: item.price,
                image: item.image,
              })
            }
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
