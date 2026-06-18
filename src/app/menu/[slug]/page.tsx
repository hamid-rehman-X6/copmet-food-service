import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProductBySlugService, listRelatedProductsService } from "@/server/catalog/catalog.service";
import { Icon } from "@/components/common/Icon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MenuCard } from "@/components/menu/MenuCard";
import { ProductDetail } from "@/components/menu/ProductDetail";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlugService(slug);

  if (!product) {
    return {
      title: "Product Not Found | Copmet Food Service",
      description: "The frozen meal you were looking for is no longer available.",
    };
  }

  return {
    title: `${product.name} | Copmet Food Service`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlugService(slug);

  if (!product) {
    notFound();
  }

  const related = await listRelatedProductsService(product.categorySlug, product.id);

  return (
    <>
      <SiteHeader showCartLabel loginTone="ghost" />
      <main className="page-shell py-8 sm:py-10 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:mb-8">
          <Link className="transition-colors hover:text-primary" href="/">
            Home
          </Link>
          <Icon className="h-4 w-4" name="arrowRight" />
          <Link className="transition-colors hover:text-primary" href="/menu">
            Frozen Menu
          </Link>
          <Icon className="h-4 w-4" name="arrowRight" />
          <span className="font-semibold text-foreground">{product.name}</span>
        </nav>

        <ProductDetail product={product} />

        {related.length > 0 ? (
          <section className="mt-16 sm:mt-20">
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <h2 className="heading-font text-2xl font-semibold text-foreground sm:text-3xl">You might also like</h2>
              <Link className="hidden items-center gap-2 text-sm font-semibold text-primary sm:flex" href="/menu">
                Back to Menu
                <Icon className="h-4 w-4" name="arrowRight" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              {related.map((item) => (
                <MenuCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter newsletter />
    </>
  );
}
