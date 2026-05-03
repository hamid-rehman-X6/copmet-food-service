// Product detail page for public storefront visitors.
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { productRepository } from "@/lib/repositories/mock";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await productRepository.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
