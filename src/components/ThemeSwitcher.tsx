// src/components/ThemeSwitcher.tsx
import { useState, useRef, useEffect } from "react";
import { useTheme, Theme } from "../contexts/ThemeContext";
import { Palette } from "lucide-react";

const themes: { value: Theme; label: string; emoji: string }[] = [
  { value: "light",    label: "Light",         emoji: "☀️" },
  { value: "dark",     label: "Dark",          emoji: "🌙" },
  { value: "warm",     label: "Warm",          emoji: "🔥" },
  { value: "ocean",    label: "Ocean",         emoji: "🌊" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Bahar click karne pe dropdown band ho jaye
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = themes.find((t) => t.value === theme);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-blood/10 hover:bg-blood/20 transition-colors button-effect shadow-sm"
        title="Change theme"
      >
        <Palette className="h-4 w-4 text-blood" />
        <span className="text-sm font-medium hidden sm:inline">{current?.emoji} Theme</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden animate-slide-down">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTheme(t.value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                ${theme === t.value
                  ? "bg-blood/10 text-blood font-semibold"
                  : "text-foreground hover:bg-muted"
                }`}
            >
              <span className="text-base">{t.emoji}</span>
              <span>{t.label}</span>
              {theme === t.value && (
                <span className="ml-auto text-blood">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}