"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Icon } from "@/components/common/Icon";

// Light/dark theme switch. Both icons are rendered and toggled purely via the
// `dark:` CSS variant (driven by the `.dark` class on <html>). Because the
// markup is identical on server and client, there's no hydration mismatch — the
// active icon is decided by CSS once the theme class is applied.
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle dark mode"
      className="grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-surface-low"
      onClick={toggleTheme}
      type="button"
    >
      <Icon className="h-5 w-5 dark:hidden" name="moon" />
      <Icon className="hidden h-5 w-5 dark:block" name="sun" />
    </button>
  );
}
