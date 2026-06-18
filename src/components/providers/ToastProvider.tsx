"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";

type ToastTone = "success" | "error";
type Toast = { id: number; message: string; tone: ToastTone };

type ToastContextValue = {
  /** Show a transient notification (auto-dismisses after a few seconds). */
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION_MS = 3000;

// Lightweight app-wide toast system: a provider that exposes `toast()` and
// renders a small stack of notifications. Used for actions like "Added to cart".
export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = (idRef.current += 1);
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:pr-6">
        {toasts.map((item) => (
          <div
            className={cn(
              "animate-toast-in pointer-events-auto flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-semibold shadow-[var(--shadow-lift)]",
              item.tone === "error" ? "border-error/30 text-error" : "border-border text-foreground",
            )}
            key={item.id}
            role="status"
          >
            <Icon
              className={cn("h-5 w-5 shrink-0", item.tone === "error" ? "text-error" : "text-tertiary")}
              name={item.tone === "error" ? "x" : "check"}
            />
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
