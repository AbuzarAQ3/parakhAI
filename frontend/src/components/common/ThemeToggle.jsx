import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

/**
 * Basic Theme Toggle Button
 * Switches between Light and Dark mode using pen-lined outline Moon/Sun vector icons.
 * Strict line-art (monochrome currentColor stroke, uncolored).
 */
export const ThemeToggle = ({ className = "", showLabel = false }) => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center p-2 rounded-xl border border-parakh-border bg-parakh-card hover:bg-parakh-cardHover text-parakh-text shadow-xs transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-parakh-primary/30 ${className}`}
    >
      {isDark ? (
        <Sun
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-parakh-text shrink-0"
          strokeWidth={1.8}
          fill="none"
          aria-hidden="true"
        />
      ) : (
        <Moon
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-parakh-text shrink-0"
          strokeWidth={1.8}
          fill="none"
          aria-hidden="true"
        />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-semibold text-parakh-text">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
