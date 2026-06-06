import Image from "next/image";
import Link from "next/link";
import { brandAssets, brandName, footerColumns } from "@/constants/navigation";
import { Button } from "@/components/common/Button";

type SiteFooterProps = {
  newsletter?: boolean;
};

export function SiteFooter({ newsletter = false }: SiteFooterProps) {
  const visibleColumns = newsletter ? footerColumns.slice(0, 2) : footerColumns;

  return (
    <footer className="mt-14 border-t border-border/60 bg-muted py-10 sm:mt-20 sm:py-14">
      <div className="page-shell grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link className="mb-4 flex w-fit items-center" href="/">
            <Image
              alt={brandAssets.logo.alt}
              className="h-10 w-auto sm:h-12"
              height={724}
              src={brandAssets.logo.src}
              width={2172}
            />
            <span className="sr-only">{brandName}</span>
          </Link>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Homemade frozen meals, packed for busy homes and delivered ready for your freezer.
          </p>
        </div>

        {visibleColumns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">{column.title}</h2>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <Link className="transition-colors hover:text-secondary" href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}

        {newsletter ? (
          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Newsletter</h2>
            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              Get frozen batch drops, storage tips, and easy dinner ideas.
            </p>
            <form className="flex flex-col gap-2 min-[400px]:flex-row">
              <input
                className="min-w-0 flex-1 rounded-lg border border-transparent bg-card px-4 py-3 outline-none focus:border-primary"
                placeholder="Email"
                type="email"
              />
              <Button className="rounded-lg px-5" size="sm" type="submit">
                Join
              </Button>
            </form>
          </div>
        ) : null}
      </div>

      <div className="page-shell mt-10 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground sm:mt-12 sm:pt-8 sm:text-sm">
        &copy; 2026 {brandName}. Cooked for comfort, frozen for real life.
      </div>
    </footer>
  );
}
