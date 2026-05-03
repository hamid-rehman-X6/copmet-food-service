// Admin error boundary for protected route failures.
"use client";

import { Button } from "@/components/ui/Button";

interface AdminErrorProps {
  reset: () => void;
}

export default function AdminError({ reset }: AdminErrorProps) {
  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-white p-6">
      <h2 className="text-xl font-semibold">Admin page failed to load</h2>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
