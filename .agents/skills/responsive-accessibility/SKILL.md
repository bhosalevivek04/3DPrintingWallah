---
name: responsive-accessibility
description: "Make a Figma-based Next.js interface work across desktop, tablet, and mobile while preserving the design language and accessibility. Use when implementing responsive behavior or fixing layout breakage."
---

# Responsive Design & Accessibility

Responsive behavior must preserve hierarchy and usability, not merely shrink the desktop layout.

## Start with evidence
- Inspect Figma responsive frames, variants, constraints, and breakpoints first.
- Inspect existing project breakpoints and CSS conventions.
- If only one viewport is supplied, state sensible assumptions before making major structural changes.

## Layout
- Use Grid/Flexbox, intrinsic sizing, `minmax()`, `clamp()`, and max-width containers where appropriate.
- Avoid fixed page widths and fixed heights for content-heavy regions.
- Prevent horizontal overflow, text clipping, overlapping controls, and awkward orphaned columns.
- Preserve intended content order and hierarchy when stacking.
- Make navigation, tables, menus, dialogs, and forms usable on touch screens.
- Use responsive images with correct aspect ratios and object positioning.
- Check long labels, empty states, validation messages, and unusually narrow widths.

## Accessibility
- Use semantic landmarks and native controls where possible.
- Associate labels and descriptions with form fields.
- Ensure keyboard access and visible focus indicators.
- Do not communicate state using color alone.
- Provide meaningful alt text for informative images and empty alt for decorative images.
- Respect reduced-motion preferences.
- Check text/background contrast and practical target sizes.
- Keep focus managed correctly in dialogs and menus.

## Verification
Check at minimum:
- wide desktop;
- common laptop width;
- tablet portrait/landscape as relevant;
- narrow mobile width.

Use actual browser inspection/screenshots where available. Fix issues at their source rather than adding isolated overrides.
