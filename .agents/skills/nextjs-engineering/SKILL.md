---
name: nextjs-engineering
description: "Build maintainable, accessible Next.js interfaces using the repository's existing router, rendering model, TypeScript conventions, and component architecture. Use for implementation and code-quality work."
---

# Next.js Frontend Engineering

Build production-quality UI while respecting the current repository.

## Framework discipline
- Detect the installed Next.js version and App Router vs Pages Router. Do not assume either.
- Follow the repository's existing route, layout, data-fetching, and component conventions.
- In App Router, default to Server Components. Add `"use client"` only where browser APIs, state, effects, or event handlers require it.
- Keep client boundaries as small as practical. Do not convert an entire route to a Client Component without a reason.
- Use the project's TypeScript/JavaScript conventions. Avoid `any` unless justified.
- Use `next/image` for appropriate local/remote images and configure remote patterns only when required. Preserve intentional image crop/aspect ratio.
- Use `next/font` or the existing font strategy; do not silently substitute typography.
- Use semantic HTML and accessible labels, keyboard interaction, visible focus, and correct heading order.
- Handle loading, empty, error, disabled, and success states where the feature requires them.
- Avoid hydration mismatches, unnecessary effects, duplicate state, and avoidable client-side data fetching.
- Use stable keys and correct form semantics.

## CSS/styling discipline
- Detect and continue the existing styling approach. Do not assume Tailwind or install a styling library without permission.
- Keep styles scoped and consistent with project conventions.
- Avoid global selectors that leak into unrelated pages.
- Prefer layout primitives and responsive constraints over brittle absolute positioning.
- Do not use arbitrary z-index values or `!important` as routine fixes.

## Code quality
- Keep components cohesive and avoid giant page components.
- Extract reusable components only when reuse or clarity justifies it.
- Keep business logic separate from presentation where appropriate.
- Do not add dependencies for trivial functionality.
- Preserve existing routes, API contracts, analytics hooks, and behavior.
- Run the available lint, typecheck, test, and build commands relevant to the change. Fix errors introduced by your work.
