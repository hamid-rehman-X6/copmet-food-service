// Public fallback loading state for async route transitions.
export default function PublicLoading() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-64 animate-pulse rounded bg-[var(--color-surface-strong)]" />
      <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-strong)]" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--color-surface-strong)]" />
    </div>
  );
}
