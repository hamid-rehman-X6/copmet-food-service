// Public storefront footer links and legal area.
export function PublicFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--color-hairline)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[var(--color-muted)]">
        <p>© {new Date().getFullYear()} Compet Food Service. All rights reserved.</p>
      </div>
    </footer>
  );
}
