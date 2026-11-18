import { useState, useEffect } from "react";
import { getActiveTheme, toggleTheme as utilToggleTheme, applyTheme } from "../utils/theme";

/**
 * Custom React hook to interact with and react to Parakh AI theme state.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(getActiveTheme);

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.detail || getActiveTheme());
    };

    window.addEventListener("parakh-theme-change", handleThemeChange);
    return () => window.removeEventListener("parakh-theme-change", handleThemeChange);
  }, []);

  const isDark = theme === "dark";

  const toggle = () => {
    const next = utilToggleTheme();
    setTheme(next);
  };

  const setMode = (mode) => {
    const applied = applyTheme(mode);
    setTheme(applied);
  };

  return {
    theme,
    isDark,
    toggle,
    setMode,
  };
};

export default useTheme;
