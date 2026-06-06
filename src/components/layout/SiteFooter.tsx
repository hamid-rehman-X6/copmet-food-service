"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { brandAssets, brandName, footerColumns } from "@/constants/navigation";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { NavItem } from "@/types/common.types";

type SiteFooterProps = {
  newsletter?: boolean;
};

export function SiteFooter({ newsletter = false }: SiteFooterProps) {
  const visibleColumns = newsletter ? footerColumns.slice(0, 2) : footerColumns;
  const [comingSoonLink, setComingSoonLink] = useState<NavItem | null>(null);

  function handleComingSoonClick(event: MouseEvent<HTMLAnchorElement>, link: NavItem) {
    if (!link.comingSoon) {
      return;
    }

    event.preventDefault();
    setComingSoonLink(link);
  }

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
                <Link
                  aria-haspopup={link.comingSoon ? "dialog" : undefined}
                  className="transition-colors hover:text-secondary"
                  href={link.href}
                  key={link.label}
                  onClick={(event) => handleComingSoonClick(event, link)}
                >
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

      {comingSoonLink?.comingSoon ? (
        <div
          aria-labelledby="coming-soon-title"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-inverse/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          onClick={() => setComingSoonLink(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-left shadow-[var(--shadow-lift)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary-container text-secondary-container-foreground">
                <Icon className="h-6 w-6" name="helpCircle" />
              </div>
              <button
                aria-label="Close coming soon message"
                className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-low hover:text-primary"
                onClick={() => setComingSoonLink(null)}
                type="button"
              >
                <Icon className="h-5 w-5" name="x" />
              </button>
            </div>
            <h2 className="heading-font text-2xl font-semibold text-foreground" id="coming-soon-title">
              {comingSoonLink.comingSoon.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{comingSoonLink.comingSoon.message}</p>
            <Button className="mt-7 w-full rounded-xl" onClick={() => setComingSoonLink(null)} type="button">
              Got it
            </Button>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
