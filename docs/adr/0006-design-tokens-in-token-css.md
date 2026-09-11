# Design tokens live in `token.css`; Dria primary + Documenso surfaces

App-wide look is defined by CSS custom properties in `src/app/token.css` (colors, radius, spacing). `globals.css` imports that file and maps tokens into Tailwind v4 `@theme inline`. No token pipeline or new dependencies.

Palette: Dria orange primary (`#e64c19` / dark `#f05a28`) on Documenso-style cool surfaces (white / near-black). Destructive is a cooler red so it stays distinct from primary. Radius is Dria-shaped (`sm` 6 / `md` 10 / `lg` 14 / `full`). Spacing is a 4px grid with `--space-1` as the Tailwind `--spacing` unit. No shadow tokens and no custom type-size scale in v1; Geist remains the sans/mono pair.

A Documenso lime primary was rejected in favor of Dria’s orange. Warm cream/olive Dria surfaces were rejected for cooler neutrals that fit a signing product. Style Dictionary / JS token packages were rejected to keep a single CSS file. Expanding the component catalog was rejected — ADR-0005 still governs primitives; this ADR only moves and deepens the token foundation (previously implied in `globals.css`).
