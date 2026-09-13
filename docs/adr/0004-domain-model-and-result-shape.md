# createSigning: ports, typed results, file then Postgres

`createSigning` is the save: validate a `CreateSigningCommand` (signing id, document bytes/file name, prepare values), write Document bytes via `DocumentStore`, insert Signing metadata (Draft by default) via `SigningRepository`. It does not import Next.js, React, or Drizzle. The Server Action only adapts FormData / `revalidatePath`. Ports are a second argument; implementations live in `src/infrastructure/`.

Expected failures return a closed union — not `throw`:

```ts
type CreateSigningResult =
  | { ok: true; signingId: string }
  | { ok: false; reason: "invalidDocument" | "invalidInput" | "storageFailed" }
  | { ok: false; reason: "databaseUnavailable"; documentOrphaned: boolean };
```

Postgres cannot include the object store in one transaction. Order: validate → store bytes → repository create → on DB failure delete the file (compensating). No Signing row until the DB commit; no orphan DB row without a file. `storageFailed` is only the initial store failure. A repository failure keeps `databaseUnavailable`; `documentOrphaned` is `true` when compensating delete also fails.

Vitest targets `createSigning` with fake ports. Putting FormData, Drizzle, or file I/O inside the orchestrator was rejected.
