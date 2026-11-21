---
name: visual-qa
description: "Compare a running Next.js implementation against its Figma reference, identify visual and functional mismatches, and fix them systematically. Use after implementing or changing a screen."
---

# Visual QA & Figma Comparison

A page rendering without errors is not proof that the design is correct.

## Prepare
1. Run the project using its existing scripts.
2. Open the exact route and viewport represented by the Figma frame.
3. Capture a browser screenshot and compare it side-by-side with the Figma screenshot.
4. Verify that fonts and assets have loaded before judging geometry.

## Compare systematically
Review in this order:
1. Page structure and section order.
2. Overall container width, alignment, and major spacing.
3. Grid/flex proportions and component dimensions.
4. Typography: font, weight, size, line height, letter spacing, wrapping.
5. Colors, borders, radii, shadows, and backgrounds.
6. Exact assets, crop, scale, and position.
7. Icons, controls, and interaction states.
8. Responsive behavior and overflow.

## Fixing protocol
- Fix the highest-impact differences first.
- Find the responsible token, component, or layout rule; avoid random local overrides.
- Do not change unrelated routes or pre-existing out-of-scope mismatches.
- Re-capture after meaningful fixes.
- Test the target viewport and at least one narrow viewport.
- Check browser console, terminal output, lint, typecheck, and build where available.

## Completion report
Provide:
- route and viewport tested;
- visual issues found and fixed;
- any remaining differences and why;
- functional/accessibility checks performed;
- commands run and their outcomes.

Never state "pixel-perfect" unless a direct screenshot comparison was completed and no material differences remain.
