---
name: design-system-guardrails
description: "Extract and preserve the project's real visual language: tokens, typography, color, spacing, components, and iconography. Use when creating or modifying shared UI or when pages look visually inconsistent or generic."
---

# Design System Guardrails

Create consistency from the actual product design, not from generic UI trends.

## Discover first
- Inspect global styles, theme providers, CSS variables, Tailwind config (if present), typography setup, component library theme, and existing components.
- Extract colors, typography, spacing, radii, borders, shadows, breakpoints, and semantic states from the repository and Figma.
- Determine which values are tokens and which are one-off exceptions.

## Rules
- Extend existing tokens instead of creating parallel token systems.
- Use semantic names such as `--color-text-primary`, `--surface-muted`, or the project's established naming convention.
- Avoid arbitrary one-off values when a matching token exists.
- Do not globally change tokens to fix one isolated component.
- Keep type scale, line heights, and font weights consistent with the design.
- Use the project's icon library or exact Figma assets. Do not use emoji as interface icons.
- Avoid generic AI-style decoration: unnecessary gradients, glassmorphism, random blobs, excessive pill shapes, oversized headings, repeated floating cards, gratuitous shadows, and meaningless badges.
- Do not remove intentional visual character in the name of minimalism. Match the supplied design.
- Ensure focus, hover, active, disabled, error, and success states fit the product's visual language.

## Component reuse
- Search for an existing component before creating a new one.
- Extend through documented variants/props where practical.
- Avoid near-duplicate buttons, inputs, cards, dialogs, and navigation components.
- Keep component APIs small and semantic.

## Deliverable
When making shared-system changes, list tokens/components reused, added, or modified and explain why.
