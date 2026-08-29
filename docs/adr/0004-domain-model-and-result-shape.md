# Domain model behind Server Actions; typed results for expected failures

Server Actions are HTTP adapters, not the domain. Each slice keeps a thin `"use server"` function (e.g. `startSigning`) that parses `FormData`, allocates a `signingId`, calls a domain orchestrator in the same folder (e.g. `createSigning`), maps the result for the UI, and runs framework concerns (`revalidatePath`) only on success. The orchestrator owns product language and workflow; it does not import Next.js, React, or Drizzle.

Domain orchestrators take plain input and injected **ports** (interfaces), not concrete infra:

- `DocumentStore` — store bytes, delete by key (`src/lib/document.ts` implements this).
- `SigningRepository` — persist Signing state (`src/lib/db/` implements this with Drizzle + Postgres). New Signings are stored with Draft status; that is a column default, not part of operation names.

Infra stays in `src/lib/`. The slice stays flat: `create-signing.ts` beside `start-signing.ts`, not a `model/` folder until a second kind of domain file actually appears. `createDocumentKey(signingId, fileName)` is a pure function in `src/lib/document.ts`.

## Result shape

Domain functions return a discriminated union — not `throw` for expected failure:

```ts
type StartSigningResult =
  | { ok: true; signingId: string }
  | { ok: false; reason: "invalidDocument" | "databaseUnavailable" | "storageFailed" };
```

`databaseUnavailable` covers connection refused, timeouts, and other network-level DB errors — same shape in local dev (Docker not running) and production. Reserve `throw` for programmer bugs and impossible states.

The Server Action returns this result unchanged. Client UI uses `useActionState` to read it and show feedback; a plain `<form action={…}>` without action state cannot surface returned errors.

## Cross-store consistency (file + Postgres)

Postgres transactions cannot include filesystem or bucket writes. "All succeed or leave no Signing" is a **compensating saga**, not one ACID transaction:

1. Derive `documentKey` from `signingId` and `fileName` (pure, no I/O).
2. Write bytes via `DocumentStore`.
3. Insert Signing + Document metadata in a DB transaction via `SigningRepository.create`.
4. If step 3 fails → delete the file via `DocumentStore` → return `databaseUnavailable` (or `storageFailed` if compensation fails).
5. If step 3 succeeds → return `{ ok: true, signingId }`.

A Signing does not exist until step 3 commits. Orphan files may exist only briefly between steps 2 and 4; orphan DB rows without a file must not be left behind.

## Testing seams

Vitest targets the domain orchestrator with fake ports — no `FormData`, no `revalidatePath`, no Drizzle. Integration tests against real Postgres (Docker in CI) sit on `SigningRepository` only. Playwright covers the full form → Server Action → UI feedback path.

Putting Drizzle calls, file I/O, or `FormData` parsing inside the domain orchestrator was rejected: it couples product logic to framework and storage and makes unit tests slow or impossible. Returning `throw` for expected infra failure was rejected: the app should stay up and the client should get a typed reason to display. Dev-only flags that soften DB errors in local but hard-fail in prod were rejected: the result shape is the same everywhere; only copy may differ. Fail-fast before any file write was rejected for this flow: it cannot guarantee the insert will succeed and conflicts with leaving no committed Signing when storage already ran.
