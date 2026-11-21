---
name: figma-precision
description: "Implement a Figma frame in the existing codebase with high visual fidelity using Figma MCP context, screenshots, assets, and Code Connect. Use whenever translating a Figma design into Next.js code."
---

# Figma-to-Code Precision

Figma is the visual source of truth. Your job is implementation, not redesign.

## Before coding
1. Inspect the project using the `project-audit` skill.
2. Obtain the exact Figma node/frame context through the connected Figma MCP integration. Use the Figma design-to-code workflow and include the required Figma skill when invoking design-context tools.
3. Request and inspect the Figma screenshot. It is the visual target.
4. If design context is sparse or incomplete, inspect the screenshot and request context for the relevant child nodes before implementing. Never fill major gaps by guessing.
5. Inspect existing code components, design tokens, assets, fonts, and Code Connect mappings.
6. Map the frame's visible regions: page shell, sections, containers, grids, typography, controls, imagery, and responsive variants where present.

## Implementation rules
- Match the provided frame; do not invent new sections, cards, badges, gradients, illustrations, or decorative UI.
- Use the exact supplied static assets in their intended slots. Prefer existing exact matches in the repository/design library. Do not replace a supplied asset with a vaguely similar image or icon.
- Download and use Figma-provided assets according to the MCP response. Do not leave temporary Figma asset URLs in source code.
- Preserve SVG intrinsic dimensions and viewBox behavior. Do not force every SVG to `width:100%; height:100%`.
- Reuse Code Connect components at their mapped nodes. Reuse existing project components and primitives where they accurately express the design.
- Translate prototype/absolute coordinates into robust project-native layout (Grid, Flexbox, normal flow) unless the design genuinely requires positioning.
- Match typography (family, weight, size, line-height, letter spacing), color, spacing, dimensions, borders, radii, shadows, and alignment from design context.
- Use design tokens when available. If tokens are absent, derive a small, consistent set from the actual design; do not impose a generic design system.
- Preserve meaningful text, content order, hierarchy, and line wrapping. Do not replace real content with generic placeholder copy.
- Implement interactive elements as functional controls, not screenshots or inert decoration.
- Keep dynamic/API-provided imagery dynamic; do not hardcode over data-driven image sources.

## Responsive behavior
- Follow explicit Figma breakpoints/variants when available.
- If only desktop is provided, infer the smallest reasonable responsive adaptation without changing the visual language. Document assumptions.
- Avoid horizontal overflow, clipped text, broken navigation, and arbitrary fixed widths on small screens.

## Scope discipline
- Implement only the requested frame/component and necessary dependencies.
- Do not "clean up" unrelated parts of the page.
- Do not alter existing out-of-scope mismatches during visual verification.

## Completion
Report the Figma node/frame implemented, files changed, assets used, assumptions, and remaining mismatches. Never claim pixel-perfect without browser comparison.
