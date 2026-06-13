import type { InputHTMLAttributes } from "react";

// Simple labeled text/password input used by the profile forms.
type ProfileFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export function ProfileField({ label, id, ...props }: ProfileFieldProps) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <input
        className="w-full rounded-lg border border-border bg-surface-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-card disabled:opacity-60"
        id={id}
        {...props}
      />
    </label>
  );
}
