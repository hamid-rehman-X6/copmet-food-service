import type { InputHTMLAttributes } from "react";
import { Icon } from "@/components/common/Icon";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: "lock" | "mail" | "user";
};

export function AuthField({ label, icon, id, ...props }: AuthFieldProps) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-border-strong" name={icon} />
        <input
          className="w-full rounded-xl border border-border bg-surface-low py-3.5 pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-border-strong focus:border-primary focus:bg-card"
          id={id}
          {...props}
        />
      </span>
    </label>
  );
}
