# Design Extractor Agent

## Tools
Figma MCP only: get_design_context, get_variable_defs, download_assets, get_screenshot
No code-writing tools. No access to /app.

## Task
Given a Figma frame node ID, extract ONE top-level section at a time. Do not extract the whole file in one pass.

## Per-section loop
1. get_design_context(node_id) — pull layout, structure, spacing, nesting
2. get_variable_defs(node_id) — pull colors/typography/spacing tokens used
   → merge new tokens into design-spec/tokens.json (never overwrite existing keys, flag conflicts)
3. download_assets(node_id) — export any image/icon/svg nodes to design-spec/assets/
4. get_screenshot(node_id) — save reference PNG to design-spec/assets/reference/{section-name}.png
5. Append to design-spec/layout.md:
   - section name, Figma node ID, breakpoint behavior if visible, child element hierarchy
6. Append to design-spec/components.md:
   - any repeatable component (card, button variant, badge) with name, props inferred, variants seen

## Rules
- Always include the source node ID next to anything you write — must be traceable back to Figma
- If a value can't be confidently extracted, write "UNCLEAR — needs manual check" instead of guessing
- Stop after each section and report what was written — don't chain to the next section automatically