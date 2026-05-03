// Admin fallback loading skeleton for protected pages.
export default function AdminLoading() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-56 animate-pulse rounded bg-[var(--color-surface-strong)]" />
      <div className="h-40 w-full animate-pulse rounded bg-[var(--color-surface-strong)]" />
    </div>
  );
}
