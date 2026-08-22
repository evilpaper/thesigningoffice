# Features are vertical slices; app is routes only

Next.js defaults to colocating UI next to routes. We are not doing that. `src/app/` owns routes and nothing else. `src/components/` owns shared chrome (header, footer, logo, theme). Each product capability lives in `src/features/<name>/` as a vertical slice: its UI and its Server Functions together.

Signing is the first slice. `/` is the Signing entry point. The route imports `StartSigningSection` from `src/features/signing/` and keeps only the `<main>` page shell (max-width, padding). `StartSigningSection` composes `StartSigningHero` (headline and pitch) and `StartSigningForm` (the file picker and submit). When a Server Function exists, it is `startSigning` in the same folder. Keep a slice flat until a second kind of file actually appears — no `ui/` / `actions/` / `model/` folders and no barrel file up front.

Colocating in `app/` was rejected because routes would accumulate product UI. Splitting feature UI into `components/` and feature logic into `features/` was rejected because the form and `startSigning` would live apart and invite a fake `ui`/`api` split to compensate.
