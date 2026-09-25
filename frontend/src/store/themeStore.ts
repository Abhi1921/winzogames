import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  initTheme: () => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("winzo_theme") as ThemeMode;
  if (saved && ["light", "dark", "system"].includes(saved)) {
    return saved;
  }
  return "light"; // DEFAULT LIGHT MODE
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("winzo_theme", theme);
    applyThemeToDOM(theme);
    set({ theme });
  },
  initTheme: () => {
    const currentTheme = get().theme;
    applyThemeToDOM(currentTheme);
  },
}));

export function applyThemeToDOM(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // System
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}
