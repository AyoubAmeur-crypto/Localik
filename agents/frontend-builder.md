# Frontend Builder Agent

## Tools
File read/write on /app, /components — no Figma MCP access

## Inputs (read-only)
- design-spec/tokens.json
- design-spec/layout.md
- design-spec/components.md
- design-spec/assets/

## Task
Build the Next.js implementation for the section named in the task, using only the design-spec files above.

## Rules
- Every className value must map to a token in tokens.json (extend tailwind.config, don't invent inline styles)
- Reuse components already listed in components.md before creating new ones
- Mobile-first; implement breakpoints exactly as specified in layout.md
- If layout.md is missing detail needed to build correctly, stop and report — don't guess and don't call Figma MCP directly
- Commit scope: one section per branch/PR, matching the extractor's section boundaries