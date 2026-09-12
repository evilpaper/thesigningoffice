# Features are vertical slices; app is routes only

The preparer’s prepare form and the server call that saves a Draft live together in `src/features/signing/`. `src/app/` is routes only; `src/components/` is shared chrome; `src/infrastructure/` is Postgres and object-storage adapters. Signing is the first slice — there is no separate documents feature. Keep a slice flat (no `ui/` / `model/` folders, no barrel) until a second kind of file appears.

Colocating product UI in `app/` was rejected. Splitting feature UI into `components/` and logic into `features/` was rejected — the form and its save path would drift apart.
