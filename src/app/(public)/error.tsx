// Public error boundary UI for recoverable route failures.
"use client";

import { Button } from "@/components/ui/Button";

interface PublicErrorProps {
  reset: () => void;
}

export default function PublicError({ reset }: PublicErrorProps) {
  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-hairline)] p-6">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-[var(--color-muted)]">
        We could not load this section. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
