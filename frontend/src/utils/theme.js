// ==============================================================================
// PARAKH AI - THEME MANAGEMENT UTILITY
// Supports Standard Light Mode (Blue, Grey & White) and Dark Mode
// ==============================================================================

export const STANDARD_THEME = {
  id: "blue-grey-white",
  name: "Blue, Grey & White",
  description: "Standard Departmental Theme: Vibrant royal blue (#2563EB), soft cool grey canvas (#F1F5F9), pristine white cards (#FFFFFF) and slate borders (#E2E8F0)",
  bg: "#F1F5F9",
  card: "#FFFFFF",
  primary: "#2563EB",
  text: "#0F172A",
  border: "#E2E8F0",
};

export const DARK_THEME = {
  id: "dark",
  name: "Dark Mode",
  description: "High Contrast Dark Mode: Deep slate canvas (#0B1120), dark slate cards (#1E293B), bright blue accent (#3B82F6) and white text (#F8FAFC)",
  bg: "#0B1120",
  card: "#1E293B",
  primary: "#3B82F6",
  text: "#F8FAFC",
  border: "#334155",
};

export const AVAILABLE_THEMES = [STANDARD_THEME, DARK_THEME];

const THEME_STORAGE_KEY = "parakh_active_theme";

// In-memory theme state (provides instant sync & test environment resilience)
let currentActiveTheme = "blue-grey-white";

/**
 * Returns the active theme id: 'blue-grey-white' (light) or 'dark'.
 * Ignores legacy obsolete theme ids ('earthy', 'slate', 'silver-dark').
 */
export const getActiveTheme = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark") {
        currentActiveTheme = "dark";
        return "dark";
      }
      if (stored === "blue-grey-white" || stored === "light") {
        currentActiveTheme = "blue-grey-white";
        return "blue-grey-white";
      }
      // If an obsolete/unsupported theme was stored, purge and default to blue-grey-white
      if (stored && stored !== "blue-grey-white" && stored !== "dark") {
        localStorage.setItem(THEME_STORAGE_KEY, "blue-grey-white");
        currentActiveTheme = "blue-grey-white";
      }
    } catch {}
  }
  return currentActiveTheme || "blue-grey-white";
};

/**
 * Apply theme to document element.
 * Accepts 'dark', 'light', 'blue-grey-white'.
 * Any unrecognized / obsolete theme name defaults to 'blue-grey-white'.
 */
export const applyTheme = (themeName) => {
  let targetTheme = "blue-grey-white";
  if (themeName === "dark") {
    targetTheme = "dark";
  } else if (themeName === "blue-grey-white" || themeName === "light") {
    targetTheme = "blue-grey-white";
  } else if (!themeName) {
    targetTheme = getActiveTheme();
  } else {
    // Unrecognized / legacy theme (e.g. earthy, slate, silver-dark) -> fallback to blue-grey-white
    targetTheme = "blue-grey-white";
  }

  currentActiveTheme = targetTheme;

  if (typeof document !== "undefined" && document.documentElement) {
    const root = document.documentElement;
    if (targetTheme === "dark") {
      root.setAttribute("data-theme", "dark");
      root.classList?.add("dark");
    } else {
      root.setAttribute("data-theme", "blue-grey-white");
      root.classList?.remove("dark");
    }
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme);
    } catch {}

    try {
      window.dispatchEvent(new CustomEvent("parakh-theme-change", { detail: targetTheme }));
    } catch {}
  }

  return targetTheme;
};

/**
 * Toggle between light ('blue-grey-white') and 'dark'
 */
export const toggleTheme = () => {
  const current = getActiveTheme();
  const next = current === "dark" ? "blue-grey-white" : "dark";
  return applyTheme(next);
};

/**
 * Initialize theme on app boot
 */
export const initTheme = () => {
  return applyTheme();
};
