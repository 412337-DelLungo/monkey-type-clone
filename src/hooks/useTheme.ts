import { useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/**
 * Get initial theme from localStorage with lazy initialization.
 * Falls back to 'dark' when localStorage is unavailable.
 */
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // localStorage unavailable, fallback to dark
  }
  return "dark";
}

/**
 * Custom hook for managing dark/light theme persistence.
 * Syncs theme to localStorage and document.dataset on every change.
 * Implements FOUC prevention via pre-hydration (see index.html).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Sync theme to DOM and localStorage on every change
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable, ignore
    }
  }, [theme]);

  // Toggle between dark and light themes
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
}
