# Vitest for the save path; Playwright for the form journey

Vitest sits next to pure logic (`createSigning`, prepare validation) with fake ports — no FormData, React, or Drizzle. Playwright under `e2e/` covers prepare form → server → UI feedback. Repository checks against real Postgres (Docker in CI) are allowed when the real adapter lands.

`pnpm test` / `pnpm test:run` / `pnpm test:e2e`. E2e in `features/` or a mixed top-level `tests/` was rejected. jsdom/RTL in Vitest was rejected — Playwright owns the UI.
