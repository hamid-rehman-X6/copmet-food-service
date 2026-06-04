"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

export function Select({ label, value, options, onChange, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-low px-5 py-3 text-left text-sm font-semibold text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label}</span>
        <Icon className={cn("h-4 w-4 transition-transform", open && "rotate-180")} name="chevronDown" />
      </button>

      {open ? (
        <div
          aria-label={label}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 min-w-full overflow-hidden rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-lift)]"
          id={listboxId}
          role="listbox"
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                aria-selected={selected}
                className={cn(
                  "flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition-colors hover:bg-surface-low",
                  selected && "bg-primary/10 font-semibold text-primary",
                )}
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                role="option"
                type="button"
              >
                <span className="flex-1">{option.label}</span>
                {selected ? <Icon className="h-4 w-4" name="check" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
