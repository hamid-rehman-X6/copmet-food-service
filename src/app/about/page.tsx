import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { aboutStats, aboutValues } from "@/constants/about.constants";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "About | Copmet Food Service",
  description: "Learn how Copmet Food Service makes thoughtful, handcrafted meals for shared moments.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-shell grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-24">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-secondary">Our Story</p>
            <h1 className="heading-font max-w-xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl md:text-6xl">
              Good food should bring people closer.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-8">
              Copmet Food Service began with a simple idea: make it easier to share a warm, memorable meal. We prepare
              comforting dishes with thoughtful ingredients, then deliver them ready for the moments that matter.
            </p>
          </div>

          <div className="organic-shape relative aspect-square overflow-hidden bg-primary/10">
            <Image
              alt="Family and friends sharing a warm meal around a table."
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              src="/images/home-page/community-img.png"
            />
          </div>
        </section>

        <section className="bg-muted py-14 sm:py-20">
          <div className="page-shell">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-secondary">What Guides Us</p>
              <h2 className="heading-font text-3xl font-semibold sm:text-4xl">Food made for real life</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                From the first ingredient to the final delivery, we focus on the details that make a meal feel
                personal.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {aboutValues.map((value) => (
                <Card className="p-6 sm:p-8" key={value.title}>
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-success-soft text-tertiary">
                    <Icon className="h-7 w-7" name={value.icon} />
                  </div>
                  <h3 className="heading-font mb-3 text-2xl font-semibold">{value.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-14 sm:py-20">
          <div className="grid overflow-hidden rounded-3xl bg-primary text-primary-foreground lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-secondary-container">Our Promise</p>
              <h2 className="heading-font text-3xl font-semibold sm:text-4xl">Comfort, without the compromise.</h2>
              <p className="mt-5 max-w-xl leading-7 text-primary-foreground/85">
                We believe convenience can still feel generous. That means familiar food, careful preparation, and
                service you can count on from kitchen to doorstep.
              </p>
              <Link
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-card px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-low"
                href="/menu"
              >
                Explore the Menu
                <Icon className="h-4 w-4" name="arrowRight" />
              </Link>
            </div>
            <div className="relative min-h-64 sm:min-h-80">
              <Image
                alt="A selection of handcrafted dishes ready to share."
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                src="/images/home-page/hero-section-img-3.png"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-4 text-center sm:grid-cols-3">
            {aboutStats.map((stat) => (
              <div className="rounded-2xl border border-border bg-surface-low p-6" key={stat.label}>
                <p className="heading-font text-2xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
