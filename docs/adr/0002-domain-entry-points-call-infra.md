# Domain entry points call infra; Test and Prod share code

UI and Server Functions use product language (`startSigning`, Document, Draft Signing). Persistence is infrastructure behind those entry points: Postgres for Signing state, an object bucket for Document bytes, reached via `src/lib/` (or equivalent) — not via a `features/documents/` slice and not named `uploadToS3` / `saveFile` on the form. Test and Prod are the same code with different env (database URL, bucket, secrets).

Naming the form action after storage, putting upload/bucket code in a peer feature folder, or forking Test vs Prod code paths were rejected: they make the product look like a file pipeline and duplicate the slice.
