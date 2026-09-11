// Flash of Unstyled Content (FOUC) prevention: apply a saved theme before first paint.
// React runs too late — without this, users briefly see the wrong colors on reload.
// Loaded synchronously from <head> in layout.tsx; only reads localStorage, never writes.
(() => {
  var preference;
  try {
    preference = localStorage.getItem("theme");
    if (preference === "light" || preference === "dark") {
      document.documentElement.dataset.theme = preference;
    } else {
      // "system", missing, or invalid — follow prefers-color-scheme via CSS.
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (_error) {}
})();
