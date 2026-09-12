# Server Action is thin; createSigning owns the save

Prepare submit hits a thin Server Action that parses the form and calls `createSigning`. That orchestrator persists Document bytes (object store) and Signing metadata including Signers (Postgres). Naming and folders stay in product language — not `uploadToS3` / `saveFile`, and not a peer `features/documents/` slice. Test and Prod run the same code with different env (database URL, bucket, secrets).

Storage-named form actions, a separate documents feature, or Test-only code paths were rejected.
