---
name: motion-interaction
description: "Implement refined, purposeful interaction states and motion in an existing Next.js interface. Use when adding hover, focus, menus, dialogs, transitions, loading feedback, or animation."
---

# Interaction & Motion Design

Motion should clarify cause and effect, not decorate the interface.

## Interaction states
For each interactive component, consider:
- default;
- hover (pointer devices);
- focus-visible;
- pressed/active;
- disabled;
- loading;
- success/error where relevant.

Use real buttons, links, inputs, and appropriate semantics. Ensure all controls work with keyboard and touch.

## Motion principles
- Prefer subtle, short transitions that communicate state changes.
- Animate opacity and transforms where possible; avoid layout-thrashing animation.
- Keep timing and easing consistent with the product's established motion language.
- Avoid gratuitous parallax, bouncing, scroll hijacking, animated gradients, and attention-seeking effects.
- Respect `prefers-reduced-motion`.
- Do not add animation libraries if CSS or an existing dependency is sufficient.
- Never make essential information available only through animation.

## Functional behavior
- Menus and dialogs must open, close, and support expected keyboard behavior.
- Forms need validation and clear feedback.
- Buttons must perform their advertised action.
- Avoid fake controls, dead links, and decorative elements styled as interactive controls.
- Preserve existing product behavior and analytics integration.
