import Link from "next/link";
import { brandName } from "@/constants/navigation";
import type { LegalSection, LegalSummary } from "@/constants/legal.constants";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  summaries: LegalSummary[];
  sections: LegalSection[];
  alternateLink: {
    label: string;
    href: string;
  };
};

export function LegalPage({ eyebrow, title, description, lastUpdated, summaries, sections, alternateLink }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-muted py-10 sm:py-14 lg:py-18">
          <div className="page-shell">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-secondary">{eyebrow}</p>
              <h1 className="heading-font text-4xl font-bold leading-tight text-primary sm:text-5xl">{title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 font-semibold text-secondary-container-foreground">
                  <Icon className="h-4 w-4" name="book" />
                  Last updated {lastUpdated}
                </span>
                <Link className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-container" href={alternateLink.href}>
                  {alternateLink.label}
                  <Icon className="h-4 w-4" name="arrowRight" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-10 sm:py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {summaries.map((item) => (
              <Card className="border border-border/60 p-5 sm:p-6" key={item.title}>
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-success-soft text-tertiary">
                  <Icon className="h-5 w-5" name={item.icon} />
                </div>
                <h2 className="heading-font text-xl font-semibold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-shell pb-14 sm:pb-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-12">
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-2xl border border-border bg-surface-low p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Contents</p>
                <nav className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                  {sections.map((section) => (
                    <a className="transition-colors hover:text-primary" href={`#${toSectionId(section.title)}`} key={section.title}>
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <article className="rounded-2xl border border-border/70 bg-card px-5 py-6 shadow-soft sm:px-8 sm:py-8">
              <p className="border-b border-border pb-6 text-sm leading-7 text-muted-foreground">
                This page explains the general policy for {brandName}. It is written for clarity and should be reviewed
                alongside any frozen meal storage, heating, and order-specific notices shown during checkout.
              </p>
              <div className="divide-y divide-border">
                {sections.map((section) => (
                  <section className="scroll-mt-24 py-7 first:pt-6 last:pb-0" id={toSectionId(section.title)} key={section.title}>
                    <h2 className="heading-font text-2xl font-semibold text-foreground">{section.title}</h2>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function toSectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
