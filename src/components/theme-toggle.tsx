"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyThemePreference,
  getEffectiveTheme,
  getThemePreference,
  type Theme,
  type ThemePreference,
  themePreferenceLabel,
} from "@/components/theme";
import { cn } from "@/components/ui/cn";

const OPTIONS = [
  { value: "system" as const, Icon: Monitor },
  { value: "light" as const, Icon: Sun },
  { value: "dark" as const, Icon: Moon },
];

export default function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<Theme>("light");

  useEffect(() => {
    setPreference(getThemePreference());
    setEffectiveTheme(getEffectiveTheme());
  }, []);

  useEffect(() => {
    if (preference !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncEffective = () => {
      setEffectiveTheme(getEffectiveTheme());
    };

    syncEffective();
    media.addEventListener("change", syncEffective);
    return () => media.removeEventListener("change", syncEffective);
  }, [preference]);

  function select(next: ThemePreference) {
    applyThemePreference(next);
    setPreference(next);
    setEffectiveTheme(getEffectiveTheme());
  }

  return (
    <fieldset
      data-effective-theme={effectiveTheme}
      className="m-0 flex items-center gap-1 border-0 p-0"
    >
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map(({ value, Icon }) => {
        const checked = preference === value;
        return (
          <label
            key={value}
            className={cn(
              "inline-flex cursor-pointer items-center justify-center rounded-full p-2 outline-none transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background",
              checked
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name="theme-preference"
              value={value}
              checked={checked}
              onChange={() => select(value)}
              className="sr-only"
            />
            <span className="sr-only">{themePreferenceLabel(value)}</span>
            <Icon aria-hidden className="size-4" strokeWidth={1.75} />
          </label>
        );
      })}
    </fieldset>
  );
}
