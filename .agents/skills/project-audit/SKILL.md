---
name: project-audit
description: "Inspect an existing Next.js project before implementation. Use when starting work in an unfamiliar repository, diagnosing architecture or styling, or planning a safe change."
---

# Existing Project Audit

You are working inside an existing codebase. Understand it before changing it.

## Required inspection
1. Read `package.json`, lockfile, `next.config.*`, `tsconfig.json`, and the app/router structure.
2. Identify whether the project uses App Router or Pages Router, JavaScript or TypeScript, and the installed Next.js version.
3. Determine the actual styling system from dependencies and source files: CSS Modules, global CSS, Tailwind, Sass, styled-components, Emotion, MUI, shadcn/ui, or another system. Do not assume Tailwind.
4. Identify existing design tokens, fonts, icon libraries, component primitives, form libraries, animation libraries, and test/lint commands.
5. Find the relevant page, layout, components, assets, and nearby conventions before editing.
6. Check existing scripts and run the most relevant baseline checks when practical.

## Output before a substantial change
Briefly state:
- detected framework/router/language;
- detected styling system and component library;
- relevant files/components to reuse;
- intended files to change;
- risks or unknowns.

## Guardrails
- Do not replace the styling system or introduce a new UI library just for convenience.
- Do not rewrite project configuration unless required and explained.
- Do not perform broad refactors while implementing a screen.
- Preserve existing behavior and naming conventions.
- If the repository contradicts an assumption in a task, trust the repository and explain the discrepancy.
