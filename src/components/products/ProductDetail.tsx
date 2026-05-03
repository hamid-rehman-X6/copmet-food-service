// Detailed product view with ordering action.
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { env } from "@/lib/env";
import type { Product } from "@/types/product";
import { WhatsAppOrderButton } from "./WhatsAppOrderButton";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative min-h-80 overflow-hidden rounded-[var(--radius-md)]">
        <Image alt={product.name} className="object-cover" fill src={product.imageUrl} />
      </div>
      <Card>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{product.description}</p>
        <p className="mt-3 text-base font-semibold">
          ${product.price.toFixed(2)} / {product.unitLabel}
        </p>
        <div className="mt-4">
          <WhatsAppOrderButton
            productName={product.name}
            productUrl={`${env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`}
            quantity={1}
            variant={product.unitLabel}
          />
        </div>
      </Card>
    </div>
  );
}
