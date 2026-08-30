"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  getEffectiveTheme,
  type Theme,
  themeToggleLabel,
} from "@/components/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getEffectiveTheme());
  }, []);

  function toggle() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-sm border-0 bg-transparent p-0 cursor-pointer"
      suppressHydrationWarning
    >
      {themeToggleLabel(theme)}
    </button>
  );
}
