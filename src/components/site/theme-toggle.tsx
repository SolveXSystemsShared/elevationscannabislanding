"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Light/Dark switch for Breaking Bud.
 * Dark = "fume lab" (brand default). Light = "lab paper".
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-btn border border-line text-ink transition-colors hover:border-purple hover:text-purple ring-focus",
        className,
      )}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle colour theme"
      }
      title={mounted ? (isDark ? "Light mode" : "Dark mode") : "Toggle theme"}
    >
      {/* Render both and toggle visibility to avoid hydration mismatch */}
      <Sun className={cn("h-5 w-5", mounted && isDark ? "block" : "hidden")} />
      <Moon className={cn("h-5 w-5", mounted && !isDark ? "block" : "hidden")} />
      {!mounted && <Sun className="h-5 w-5" />}
    </button>
  );
}
