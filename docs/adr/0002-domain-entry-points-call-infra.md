# Domain entry points call infra; Test and Prod share code

UI and Server Functions use product language (`startSigning`, Document, Signing). The Server Action is a thin adapter; domain orchestration (e.g. `createSigning`) sits in the same feature slice and calls persistence through ports — see ADR 0004. Infrastructure implementations live in `src/infrastructure/`: Postgres (Drizzle) for Signing state, local disk or an object bucket for Document bytes — not via a `features/documents/` slice and not named `uploadToS3` / `saveFile` on the form. Test and Prod are the same code with different env (database URL, bucket, secrets).

Naming the form action after storage, putting upload/bucket code in a peer feature folder, or forking Test vs Prod code paths were rejected: they make the product look like a file pipeline and duplicate the slice.
