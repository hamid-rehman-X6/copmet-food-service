"use client";

import Image from "next/image";
import Link from "next/link";
import { featuredMeals } from "@/constants/home.constants";
import { useAddToCart } from "@/hooks/useAddToCart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Chip } from "@/components/common/Chip";
import { Icon } from "@/components/common/Icon";

export function FeaturedMeals() {
  const addToCart = useAddToCart();

  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-secondary">Freezer Favorites</p>
          <h2 className="heading-font text-2xl font-semibold text-foreground sm:text-3xl">Featured This Week</h2>
        </div>
        <Link className="hidden items-center gap-2 text-sm font-semibold text-primary sm:flex" href="/menu">
          View Frozen Catalog
          <Icon className="h-4 w-4" name="arrowRight" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:min-h-[580px] md:grid-cols-4 md:grid-rows-2 md:gap-6">
        {featuredMeals.map((meal) => (
          <article
            className={cn(
              "group relative min-h-80 overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft) sm:min-h-72 md:min-h-0",
              meal.size === "large" && "md:col-span-2 md:row-span-2",
              meal.size === "wide" && "md:col-span-2",
            )}
            key={meal.id}
          >
            <Image
              alt={meal.image.alt}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              src={meal.image.src}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
              <Chip className="mb-3" tone={meal.size === "large" ? "secondary" : "tertiary"}>
                {meal.label}
              </Chip>
              <h3 className="heading-font mb-2 text-2xl font-semibold">{meal.title}</h3>
              {meal.size === "large" ? (
                <p className="mb-5 max-w-md text-sm leading-6 opacity-90">{meal.description}</p>
              ) : null}
              {meal.size === "large" ? (
                <Button
                  className="bg-card text-primary hover:bg-surface-low"
                  onClick={() =>
                    addToCart({
                      id: meal.id,
                      name: meal.title,
                      detail: "Family Pack - Frozen",
                      price: meal.price,
                      image: meal.image,
                    })
                  }
                  size="sm"
                >
                  Add Freezer Tray - {meal.priceLabel}
                </Button>
              ) : meal.size === "wide" ? (
                <Chip tone="secondary">{meal.priceLabel}</Chip>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
