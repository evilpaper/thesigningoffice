export type Theme = "light" | "dark";
export type ThemePreference = "system" | Theme;

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function isThemePreference(
  value: string | null | undefined,
): value is ThemePreference {
  return value === "system" || isTheme(value);
}

export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Stored preference; defaults to system when missing or invalid. */
export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) {
      return stored;
    }
  } catch {
    // localStorage can throw in private modes
  }
  return "system";
}

/** Resolved appearance from data-theme, or the OS when unset. */
export function getEffectiveTheme(): Theme {
  const stored = document.documentElement.dataset.theme;
  if (isTheme(stored)) {
    return stored;
  }
  return getSystemTheme();
}

export function applyThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Ignore persistence failures; still update the document.
  }

  if (preference === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = preference;
  }
}

export function themePreferenceLabel(preference: ThemePreference): string {
  switch (preference) {
    case "system":
      return "System";
    case "light":
      return "Light";
    case "dark":
      return "Dark";
  }
}
