"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";

type AdminModalProps = {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional footer (e.g. action buttons) pinned below the scrollable body. */
  footer?: React.ReactNode;
  size?: "md" | "lg";
};

// Reusable modal shell for admin dialogs (forms, confirmations). Locks body
// scroll while open, closes on Escape, and uses the warm backdrop blur called
// for in the design system.
export function AdminModal({ title, description, open, onClose, children, footer, size = "lg" }: AdminModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button aria-label="Close dialog" className="absolute inset-0 bg-inverse/40 backdrop-blur-sm" onClick={onClose} type="button" />
      <div
        aria-modal="true"
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-card shadow-[var(--shadow-lift)] sm:rounded-2xl",
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md",
        )}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 className="heading-font text-xl font-semibold sm:text-2xl">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <button
            aria-label="Close dialog"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-surface-low hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <Icon className="h-5 w-5" name="x" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer ? <div className="border-t border-border/60 bg-surface-low px-5 py-4 sm:px-6">{footer}</div> : null}
      </div>
    </div>
  );
}
