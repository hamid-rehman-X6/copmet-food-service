// Product preview card used in listing grids.
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-52 w-full">
        <Image alt={product.name} className="object-cover" fill src={product.imageUrl} />
      </div>
      <div className="space-y-2 p-4">
        {product.isFeatured ? <Badge>Featured</Badge> : null}
        <h3 className="text-base font-semibold">{product.name}</h3>
        <p className="text-sm text-[var(--color-muted)]">{product.categoryName}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            ${product.price.toFixed(2)} / {product.unitLabel}
          </span>
          <Link className="text-sm font-medium text-[var(--color-primary)]" href={`${ROUTES.products}/${product.slug}`}>
            View
          </Link>
        </div>
      </div>
    </Card>
  );
}
