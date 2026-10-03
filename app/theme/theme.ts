"use client";

import { useSyncExternalStore } from "react";
import { createTheme } from "@mui/material";

export const THEME_STORAGE_KEY = "god_handbook_theme_mode";

const storageListeners = new Set<() => void>();

export function subscribeStorage(callback: () => void) {
  storageListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    storageListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

export function notifyStorage() {
  storageListeners.forEach((cb) => cb());
}

export function getThemeSnapshot(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export const getServerTheme = () => "light" as const;

export function toggleThemeMode() {
  const current = getThemeSnapshot();
  const next = current === "light" ? "dark" : "light";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.style.colorScheme = next;
      document.documentElement.style.backgroundColor =
        next === "dark" ? "#070b14" : "#f4f1ea";
    }
    notifyStorage();
  } catch {}
}

export function createAppTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#b45309" },
            secondary: { main: "#0284c7" },
            background: {
              default: "#f4f1ea",
              paper: "#ffffff",
            },
            text: {
              primary: "#0f172a",
              secondary: "#475569",
            },
          }
        : {
            primary: { main: "#f59e0b" },
            secondary: { main: "#38bdf8" },
            background: {
              default: "#070b14",
              paper: "#0f172a",
            },
            text: {
              primary: "#f8fafc",
              secondary: "#94a3b8",
            },
          }),
    },
    typography: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    shape: {
      borderRadius: 10,
    },
  });
}

export function useHandbookTheme() {
  const mode = useSyncExternalStore(
    subscribeStorage,
    getThemeSnapshot,
    getServerTheme
  );

  const theme = createAppTheme(mode);

  return { mode, theme, toggleThemeMode };
}
