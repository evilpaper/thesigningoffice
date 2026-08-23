# Vitest beside features; Playwright in e2e/

Unit tests use Vitest and live next to the code under test (e.g. `src/features/signing/start-signing.test.ts`). End-to-end tests use Playwright and live under `e2e/` at the repo root — outside `src/` and outside feature slices. Vitest covers domain logic and validation in a Node environment — no jsdom or React renderer. Playwright covers React, the DOM, full user journeys, and async Server Functions that need a real server.

Run them with `pnpm test` (Vitest watch), `pnpm test:run` (Vitest once, for CI), and `pnpm test:e2e` (Playwright). E2e starts the dev server via Playwright `webServer` and uses `baseURL` `http://localhost:3000`.

Putting e2e specs inside `features/` was rejected: they exercise the whole app, not one slice. A top-level `tests/` folder mixing unit and e2e was rejected: the split between fast colocated tests and browser tests should stay obvious. Adding jsdom and React Testing Library to Vitest was rejected: Playwright already covers UI; Vitest stays a thin layer for pure domain and server-side logic.
