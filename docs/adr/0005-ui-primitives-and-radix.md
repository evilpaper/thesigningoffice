# UI primitives: semantic HTML + tokens; Radix for complex behavior only

We do not adopt shadcn/ui (CLI, registry, or pasted component kit) as our design system. Shared UI lives in `src/components/ui/`: thin wrappers around semantic HTML styled with our CSS tokens in `globals.css`. Chrome (header, footer, logo, theme) stays at `src/components/` root; feature UI stays in `src/features/<slice>/` (ADR-0001).

Native elements are the default for anything HTML already does well (`button`, `input`, `textarea`, `label`, and a plain native `select` when options are simple). Radix primitives are used only when interaction needs them: dialog, dropdown/context menu, popover, tooltip, tabs with roving focus, combobox/typeahead, or a custom select that is not a native `<select>`. Never pull in Radix for styling alone. Features import only from `src/components/ui/` — never `@radix-ui/*` directly. Radix-backed wrappers are added on demand; we do not pre-build a catalog.

Starter primitives: `Button`, `Input`, `Textarea`, `Label`. No Form/Field abstraction until composition pain shows up twice. `Button` exposes variants `primary` | `secondary` | `ghost` | `destructive`, sizes `sm` | `md` (default `md`), and `asChild` (Slot) from day one so it can style a link or Radix trigger without nested buttons. No broad polymorphic `as=` API.

A full shadcn-style kit was rejected: it would give us two button systems, drag in foreign conventions, and optimize for catalog breadth we do not need. Importing Radix from features was rejected: styling and focus/portal markup would fragment across slices. DIY ARIA for dialogs/menus was rejected: accessibility cost outweighs the dependency.
