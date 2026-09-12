# createSigning: ports, typed results, file then Postgres

`createSigning` is the save: validate plain input, write Document bytes via `DocumentStore`, insert Signing metadata (Draft by default) via `SigningRepository`. It does not import Next.js, React, or Drizzle. The Server Action only adapts FormData / `revalidatePath`. Ports are injected; implementations live in `src/infrastructure/`.

Expected failures return a closed union — not `throw`:

```ts
type CreateSigningResult =
  | { ok: true; signingId: string }
  | { ok: false; reason: "invalidDocument" | "invalidInput" | "databaseUnavailable" | "storageFailed" };
```

Postgres cannot include the object store in one transaction. Order: validate → store bytes → repository create → on DB failure delete the file (compensating). No Signing row until the DB commit; no orphan DB row without a file.

Vitest targets `createSigning` with fake ports. Putting FormData, Drizzle, or file I/O inside the orchestrator was rejected.
