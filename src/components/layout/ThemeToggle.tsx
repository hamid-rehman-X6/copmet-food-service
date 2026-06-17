"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Icon } from "@/components/common/Icon";

// Light/dark theme switch. Shows the icon for the theme you'd switch TO.
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-surface-low"
      onClick={toggleTheme}
      type="button"
    >
      <Icon className="h-5 w-5" name={isDark ? "sun" : "moon"} />
    </button>
  );
}
