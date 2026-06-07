// src/contexts/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "warm" | "ocean" | "contrast";

// Theme ko <html> pe apply karne wale classes
const THEME_CLASSES: Record<Theme, string> = {
  light:    "",
  dark:     "dark",
  warm:     "theme-warm",
  ocean:    "theme-ocean",
  contrast: "theme-contrast",
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem("gw-theme") as Theme) || "light"
  );

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("gw-theme", t);
  };

  useEffect(() => {
    const root = document.documentElement;

    // Pehle saari theme classes hata do
    Object.values(THEME_CLASSES).forEach((cls) => {
      if (cls) root.classList.remove(cls);
    });

    // Nai theme class lagao
    const cls = THEME_CLASSES[theme];
    if (cls) root.classList.add(cls);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);