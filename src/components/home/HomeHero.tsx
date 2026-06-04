import Image from "next/image";
import Link from "next/link";
import { homeHero } from "@/constants/home.constants";
import { Icon } from "@/components/common/Icon";

export function HomeHero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-surface-low sm:min-h-[640px] md:min-h-[720px]">
      <Image
        alt={homeHero.image.alt}
        className="object-cover object-[62%_center] sm:object-center"
        fill
        priority
        sizes="100vw"
        src={homeHero.image.src}
      />
      <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/80 to-background/25 sm:via-background/65 sm:to-background/10" />
      <div className="page-shell relative flex min-h-[560px] items-center py-14 sm:min-h-[640px] sm:py-20 md:min-h-[720px] md:py-24">
        <div className="max-w-2xl">
          <h1 className="heading-font mb-5 text-4xl font-bold leading-tight tracking-tight text-primary sm:mb-6 sm:text-5xl md:text-6xl">
            Handcrafted meals,
            <br className="hidden min-[380px]:block" />
            delivered with heart.
          </h1>
          <p className="mb-7 max-w-xl text-sm leading-7 text-muted-foreground sm:mb-10 sm:text-base md:text-lg">
            {homeHero.copy}
          </p>
          <form className="flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-card/90 px-4 py-3 shadow-sm backdrop-blur">
              <Icon className="h-5 w-5 text-primary" name="location" />
              <span className="sr-only">Delivery address</span>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-border-strong"
                placeholder="Enter your delivery address"
                type="text"
              />
            </label>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-container active:scale-95"
              href="/menu"
            >
              Find Food
              <Icon className="h-4 w-4" name="arrowRight" />
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
