# UI primitives: HTML + tokens; Radix only for complex behavior

Shared controls live in `src/components/ui/`, styled with tokens (ADR 0006). Native elements are the default. Radix only when interaction needs it (dialog, menu, combobox, …) — never for styling alone. Features import `ui/`, never `@radix-ui/*` directly. Chrome stays in `src/components/`; prepare UI stays in the signing slice (ADR 0001).

No shadcn kit. No Form/Field abstraction until pain shows up twice. Starter: `Button`, `Input`, `Textarea`, `Label`.
