# Inventory: prepare values and createSigning seams

Research for [GitHub issue #2](https://github.com/evilpaper/thesigningoffice/issues/2).  
Primary sources: feature code under `src/features/signing/`, `src/infrastructure/document.ts`, `CONTEXT.md`, ADRs 0001 / 0002 / 0004. No secondary writeups.

**Question:** What does the codebase and ADRs already define for prepare payload (`PrepareSigningValues` / Signers) and for `createSigning` / `DocumentStore` / planned `SigningRepository` — so a later ticket can extend the create contract rather than invent from scratch?

---

## 1. Current prepare input shape

### Types (`src/features/signing/prepare-values.ts`)

| Symbol | Shape |
|--------|--------|
| `MAX_SIGNERS` | `8` |
| `Signer` | `{ name: string; taxIdentificationNumber: string; email: string }` |
| `PrepareSigningValues` | `{ documentName: string; message: string; signers: Signer[] }` |

`parseSignersFromFormData(formData)` reads indexed fields `signers.{i}.name|taxIdentificationNumber|email` until a missing `name` key, capping at `MAX_SIGNERS`. Values are `String(...).trim()`.

### Product language (`CONTEXT.md`)

Aligns with prepare fields:

- **Document name** — human-facing name of the Document (avoid filename-as-title confusion).
- **Message** — optional text included when the Signing is sent to Signers.
- **Signer** — person asked to sign; **Tax identification number** — national tax ID (Swedish UI: Personnummer).

### UI assembly

| File | Role |
|------|------|
| `prepare-signing.tsx` | Layout: toolbar + sidebar + preview; optional `onContinue?(values: PrepareSigningValues)`; defaults document name from `file.name`. |
| `prepare-sidebar.tsx` | Client form submit → builds `PrepareSigningValues`. |
| `signer-list.tsx` | Dynamic signer rows (1…`MAX_SIGNERS`); field names match parser. |
| `prepare-toolbar.tsx` | Submit button targets prepare form via `form={formId}` (`Nästa`). |
| `start-signing-flow.tsx` | Idle → preparing with a `File`; **does not pass `onContinue`** — prepare values are collected in the sidebar but not forwarded to any server action yet. |

### Validation already in UI (`prepare-sidebar.tsx` + `signer-list.tsx`)

**HTML / browser:**

- `documentName`: `required` (`prepare-sidebar.tsx`).
- Each signer: `name`, `taxIdentificationNumber`, `email` (`type="email"`) all `required` (`signer-list.tsx`).
- Message: no `required` — labelled “(valfritt)”.

**Submit handler (`prepare-sidebar.tsx` `onSubmit`):**

1. Trim `documentName` and `message`; parse signers.
2. Abort (silent return) if `!documentName` or `signers.length === 0`.
3. Abort if any signer lacks `name`, `taxIdentificationNumber`, or `email`.
4. Otherwise `onSubmit({ documentName, message, signers })`.

No email-format check beyond `type="email"`. No tax-ID format check beyond `inputMode="numeric"`. No server-side validation of prepare fields yet.

---

## 2. Current createSigning input/output and ports

### Domain orchestrator (`src/features/signing/create-signing.ts`)

**Input today:**

```ts
{
  signingId: string;
  bytes: Uint8Array;
  fileName: string;
  documentStore: DocumentStore;
}
```

**Behavior:** `createDocumentKey(signingId, fileName)` then `documentStore.store({ bytes, key })`.

**Output today:** only success — `{ ok: true as const, signingId }`. No failure branch in the orchestrator yet.

### Port: `DocumentStore` (same file)

```ts
type DocumentStore = {
  store(input: { bytes: Uint8Array; key: string }): Promise<void>;
  delete(key: string): Promise<void>;
};
```

Comment in-file: when adding `SigningRepository`, extract both ports to something like `src/features/signing/ports.ts` (trigger described by ADR 0001’s “second kind of file” / flat-slice rule — ADR 0004 also says keep flat until a second domain kind appears).

### Infra adapter (`src/infrastructure/document.ts`)

- `createDocumentKey(signingId, fileName)` → `documents/{signingId}{ext}` (basename + extname of fileName).
- `storeDocument` / `deleteDocument` switch on `DOCUMENT_STORAGE` (`local` | `bucket`); bucket throws “not configured yet”.
- Exported `documentStore = { store: storeDocument, delete: deleteDocument }` satisfies the port.

**No `src/infrastructure/db/` yet** — `SigningRepository` is ADR-only; no Drizzle implementation in tree.

### Server Action adapter (`src/features/signing/start-signing.ts`)

- `"use server"`; `useActionState`-shaped `(prev, formData) → StartSigningState`.
- Reads only `formData.get("document")` as non-empty `File`; else `{ ok: false, reason: "invalidDocument" }`.
- Allocates `signingId` via `randomUUID()`, converts file to `Uint8Array`, calls `createSigning({ signingId, bytes, fileName: document.name, documentStore })`.
- On success: `revalidatePath("/")` and return result.
- `StartSigningState` reasons today: `"invalidDocument"` only (plus `null` initial). Does **not** yet expose ADR 0004’s `databaseUnavailable` / `storageFailed`.

### Tests (`src/features/signing/create-signing.test.ts`)

Single Vitest case: fake `DocumentStore`; asserts `store` called with key `documents/{uuid}.pdf` and result `{ ok: true, signingId }`. Comment anticipates “later also save Signing state”. Matches ADR 0004 testing seam (orchestrator + fake ports).

### Layering (ADRs)

- **ADR 0001:** `startSigning` lives in the signing slice; `StartSigningFlow` owns idle → preparing UI; Server Function starts a Draft Signing that owns a Document.
- **ADR 0002:** Server Action is thin adapter; `createSigning` orchestrates; infra in `src/infrastructure/` (Postgres for Signing state, disk/bucket for bytes); Test/Prod same code, different env.
- **ADR 0004:** Orchestrator owns product language/workflow; no Next/React/Drizzle imports; ports injected.

---

## 3. Gaps between prepare payload and createSigning

| Prepare / product concept | Where it exists today | Gap vs create path |
|---------------------------|----------------------|--------------------|
| Document bytes / file | `startSigning` FormData `"document"`; `createSigning` `bytes` + `fileName` | Wired for create; prepare UI holds `File` in client state only (`StartSigningFlow`) and does not call `startSigning`. |
| Document name | `PrepareSigningValues.documentName`; default `file.name` | **Not** in `createSigning` input; create uses upload `fileName` only for storage key extension via `createDocumentKey`. |
| Message | `PrepareSigningValues.message` (optional) | **Not** in `createSigning` / `startSigning`. |
| Signers | `PrepareSigningValues.signers` / `Signer` | **Not** in `createSigning` / `startSigning`. |
| Signing DB row (Draft) | ADR 0004 + CONTEXT Draft | **No** `SigningRepository`; create only stores bytes. |
| Failure reasons beyond invalid file | ADR 0004 union | Action has `invalidDocument` only; orchestrator never returns `ok: false`. |

**Wiring gap:** `PrepareSigning` can emit `PrepareSigningValues` via `onContinue`, but `StartSigningFlow` omits that prop. `startSigning` is not imported by the prepare UI. Extending create must also decide how prepare values + Document bytes reach the Server Action (single FormData vs staged client state) — out of scope here beyond noting the disconnect.

---

## 4. What ADR 0004 already mandates

File: `docs/adr/0004-domain-model-and-result-shape.md`.

### Ports and Draft

- Inject **`DocumentStore`** (store / delete) — implemented by `src/infrastructure/document.ts`.
- Inject **`SigningRepository`** — persist Signing state in `src/infrastructure/db/` (Drizzle + Postgres). **New Signings stored with Draft status as a column default**, not in operation names.
- Slice stays flat (`create-signing.ts` beside `start-signing.ts`); no `model/` until a second domain kind appears.

### Result shape (expected failures, not throw)

```ts
type StartSigningResult =
  | { ok: true; signingId: string }
  | { ok: false; reason: "invalidDocument" | "databaseUnavailable" | "storageFailed" };
```

- Server Action returns this unchanged; UI uses `useActionState`.
- `databaseUnavailable`: connection refused, timeouts, network-level DB errors (same shape local and prod).
- Reserve `throw` for programmer bugs / impossible states.

### Compensating saga (file + Postgres)

1. Derive `documentKey` from `signingId` and `fileName` (pure, no I/O) — already `createDocumentKey` in infrastructure.
2. Write bytes via `DocumentStore` — already done in `createSigning`.
3. Insert Signing + Document metadata in a DB transaction via **`SigningRepository.create`**.
4. If step 3 fails → delete file via `DocumentStore` → return `databaseUnavailable` (or `storageFailed` if compensation fails).
5. If step 3 succeeds → `{ ok: true, signingId }`.

A Signing does not exist until step 3 commits. Orphan files only briefly between 2 and 4; no orphan DB rows without a file.

### Testing

- Vitest: domain orchestrator + fake ports (existing `create-signing.test.ts` pattern).
- Integration: real Postgres on `SigningRepository` only.
- Playwright: full form → Server Action → UI feedback.

---

## 5. Concrete extension points (next ticket — no implementation)

| Extension | Location | Notes |
|-----------|----------|--------|
| Widen prepare → create data | Types in `prepare-values.ts` (`PrepareSigningValues`, `Signer`) are the UI contract to carry forward; do not redefine Signers from scratch. |
| Widen orchestrator input / saga | `createSigning` in `create-signing.ts` — add metadata (document name, message, signers) + inject `SigningRepository`; implement ADR 0004 steps 3–4 (compensate with `documentStore.delete`). |
| New port | Introduce `SigningRepository` (with `create` as named in ADR 0004); when both ports exist, consider extracting to `src/features/signing/ports.ts` per comment in `create-signing.ts`. |
| Infra | New `src/infrastructure/db/` (ADR 0002 / 0004); keep `documentStore` in `src/infrastructure/document.ts`. |
| Key derivation | Keep using `createDocumentKey` in `src/infrastructure/document.ts`; Document **name** is product metadata, distinct from storage `fileName` / key. |
| Server Action parse + reasons | `startSigning` in `start-signing.ts` — parse prepare fields (and/or Document) from `FormData`; extend `StartSigningState` reasons to match ADR 0004 (`databaseUnavailable`, `storageFailed`). |
| UI → action seam | `PrepareSigning` / `onContinue` in `prepare-signing.tsx`; wire from `start-signing-flow.tsx` (currently unused); form field names already in `prepare-sidebar.tsx` + `signer-list.tsx` + `parseSignersFromFormData`. |
| Tests | Extend `create-signing.test.ts` with fake `SigningRepository` and failure/compensation cases; add repository integration tests when DB exists. |

**Do not invent:** Signer field names (`name`, `taxIdentificationNumber`, `email`), prepare aggregate shape, `DocumentStore` method names, saga order, or result `reason` literals — they are already specified above.

---

## Source index

| Claim area | Paths |
|------------|--------|
| Prepare types / parser | `src/features/signing/prepare-values.ts` |
| Prepare validation / form fields | `src/features/signing/prepare-sidebar.tsx`, `signer-list.tsx` |
| Prepare composition / unused continue | `prepare-signing.tsx`, `start-signing-flow.tsx`, `prepare-toolbar.tsx` |
| createSigning + DocumentStore port | `src/features/signing/create-signing.ts` |
| startSigning adapter | `src/features/signing/start-signing.ts` |
| Document storage | `src/infrastructure/document.ts` |
| createSigning test | `src/features/signing/create-signing.test.ts` |
| Language | `CONTEXT.md` |
| Slice / entry points | `docs/adr/0001-features-are-vertical-slices.md`, `docs/adr/0002-domain-entry-points-call-infra.md` |
| Repository, saga, results | `docs/adr/0004-domain-model-and-result-shape.md` |
