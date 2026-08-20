# Rent-Car Landing Page — Agent Conventions

## Stack
- Next.js (App Router), TypeScript, Tailwind
- [component lib — e.g. shadcn/ui] — confirm before agents start generating components
- Image handling: next/image for all Figma-exported assets

## Source of truth
- `design-spec/tokens.json` — the ONLY valid source for colors, spacing, typography, radii
- `design-spec/layout.md` — the ONLY valid source for section structure/hierarchy
- `design-spec/components.md` — the ONLY valid source for component inventory/variants
- No agent may hardcode a pixel value, hex color, or font size that isn't traceable to tokens.json

## Ownership boundaries
- design-extractor: read-only on Figma, write-only on design-spec/
- frontend-builder: read-only on design-spec/, write-only on app source
- qa-agent: read-only everywhere, write-only on qa-reports/

## Definition of done (per section)
1. Visual diff against reference screenshot passes tolerance threshold
2. `npm run lint` and `npm run build` pass clean
3. All values traced to design-spec/, zero hardcoded magic numbers
4. Responsive at mobile/tablet/desktop breakpoints defined in layout.md

## Workflow order
extractor completes + you review a section → builder starts that section → qa-agent verifies → next section
Never run extractor and builder on the same section concurrently.