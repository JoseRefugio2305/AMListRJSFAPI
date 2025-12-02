import { create } from "zustand";

export type ThemeType = "light" | "dark";

interface ThemeState {
     theme: ThemeType;
     toggleTheme: (theme: ThemeType) => void;
}

export const themeStore = create<ThemeState>((set) => ({
     theme: getThemeSystem(),
     toggleTheme: (newTheme: ThemeType) => {
          localStorage.setItem("color-theme", newTheme);

          if (newTheme === "dark") {
               document.documentElement.classList.add("dark");
          } else {
               document.documentElement.classList.remove("dark");
          }

          set({ theme: newTheme });
     },
}));

function getThemeSystem(): ThemeType {
     const themeStored = localStorage.getItem("color-theme");
     if (themeStored === "light" || themeStored === "dark") {
          return themeStored as ThemeType;
     }

     if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
          localStorage.setItem("color-theme", "dark");
          return "dark";
     }

     localStorage.setItem("color-theme", "light");
     return "light";
}