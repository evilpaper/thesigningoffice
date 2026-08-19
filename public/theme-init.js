// FOUC prevention: apply a saved theme before first paint.
// React runs too late — without this, users briefly see the wrong colors on reload.
// Loaded synchronously from <head> in layout.tsx; only reads localStorage, never writes.
(() => {
  var theme;
  try {
    theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch (_error) {}
})();
