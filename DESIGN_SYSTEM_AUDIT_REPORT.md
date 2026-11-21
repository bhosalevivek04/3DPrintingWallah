# NewtronLabs / 3D Printing Wallah — Design System Audit & Visual Refinement Report

**Document Date:** November 22, 2026  
**Architect:** Senior Brand Designer, Systems Architect & Frontend Engineer  
**Target Repository:** `Frontend/3dprintingwallah`  
**Git Branch:** `develop`  
**Framework Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS v4  

---

## 1. Executive Summary

This audit and refinement initiative established a unified, professional brand colour system and systematically eliminated generic AI-generated visual aesthetics across the entire NewtronLabs / 3D Printing Wallah website.

By anchoring our visual tokens directly to the original Figma designs (`01 — Storefront` & workshop components) and Apple's design philosophy, we transitioned away from arbitrary utility colors, rainbow card treatments, exaggerated radii (`rounded-3xl`), and deep diffused drop shadows (`shadow-2xl`) in favor of a restrained, premium, and cohesive industrial design identity suitable for a high-precision 3D printing manufacturer.

---

## 2. Previous Visual Inconsistencies Identified

Prior to this refinement, an audit revealed several patterns typical of AI-generated code generation:

| Location | Previous Pattern / Inconsistency | Issue Diagnosed |
| :--- | :--- | :--- |
| `process-cards.tsx` | Step 1 blue (`bg-blue-600`), Step 2 indigo (`bg-indigo-600`), Step 3 emerald (`bg-emerald-600`) with rainbow connecting bar (`from-blue-300 via-indigo-300 to-emerald-300`) and giant `6xl` watermark numerals | Unnecessary multi-color palette; inconsistent card identities |
| `custom/3d-printing/page.tsx` | Material cards rendered in arbitrary pastels: PLA in `bg-blue-50`, PETG in `bg-green-50`, TPU in `bg-orange-50`, Resin in `bg-purple-50` | AI-generated "rainbow card" aesthetic instead of brand materials |
| `submission-confirmation.tsx` | Neon green banner with `bg-gradient-to-b from-emerald-50/70 to-white border-emerald-200` | Exaggerated visual hierarchy; mismatched with store tokens |
| `custom-model-preview.tsx` | Arbitrary `bg-gradient-to-b from-stone-900 to-stone-950` with heavy shadows | Did not reflect crisp CAD workspace standards |
| `admin/page.tsx` | Indigo metrics (`text-indigo-700`, `bg-indigo-50/60`, `border-indigo-200`) and `rounded-3xl` containers | Competed with primary brand blue; introduced arbitrary secondary hue |
| `admin/analytics/page.tsx` | `text-indigo-700` for quotation pipeline and `rounded-3xl` cards | Inconsistent typography, oversized radii, and unanchored colours |
| `admin/custom-prints/page.tsx` | `bg-indigo-700` button and `bg-indigo-50/50 border-indigo-200` banner | Non-standard button variant violating design tokens |
| Admin Modals & Drawers | Pervasive `rounded-3xl` (24–32px radii) and `shadow-2xl` (deep blurred elevation) across 8 dialogs | Floating bubbly appearance typical of generic template generation |
| Footer | `group-hover:text-pink-400` on Instagram icon | Random decorative accent outside brand tokens |
| Component Primitives | `globals.css` lacked semantic status tokens (`--color-success`, `--color-warning`, `--color-danger`, `--color-info`), forcing inline arbitrary Tailwind classes | Fragmented color management across components |

---

## 3. Approved Brand Colour Palette

All brand colours are validated against the Figma master design and configured as CSS custom properties with Tailwind CSS v4 `@theme inline` integration.

### A. Core Architectural Palette
- **Deep Charcoal / Near-Black (`#1D2B39`):** Primary text, strong navigation elements, and premium visual anchors.
- **Warm Off-White (`#F7F6F2`):** Primary page background canvas for the entire storefront.
- **Clean White (`#FFFFFF`):** Product cards, form containers, modal surfaces, and content cards.
- **Neutral Grey (`#526170`):** Secondary body text, captions, and supporting information.
- **Muted Sub-Text (`#8B99A8`):** Inverse footer text and tertiary metadata.
- **Restrained Brand Blue (`#175CD3`):** Primary actions, active navigation indicators, and focused elements.
- **Brand Blue Hover (`#124AA9`):** Interactive hover state for primary controls.
- **Brand Blue Light (`#53B1FD`):** Accent text on dark surfaces and link indicators.
- **Brand Blue Subtle (`#EDF4FF`):** Tinted badge containers and active pill backdrops.
- **Inverse Dark Navy (`#142333`):** High-contrast footer, announcement bar, and CAD viewport surfaces.

### B. Functional Status Palette
Functional colours are strictly reserved for system states (never used as decorative backgrounds):
- **Success (Green):**
  - Text / Glyph: `#027A48`
  - Subtle Surface: `#ECFDF3`
  - Border: `#A6F4C5`
  - *Usage:* Verified payments, in-stock indicators, delivered orders, resolved enquiries.
- **Warning (Amber):**
  - Text / Glyph: `#B54708`
  - Subtle Surface: `#FFFAEB`
  - Border: `#FEDF89`
  - *Usage:* Workshop reviews, awaiting confirmations, quotations sent, low-stock warnings.
- **Danger (Red):**
  - Text / Glyph: `#B42318`
  - Subtle Surface: `#FEF3F2`
  - Border: `#FECDCA`
  - *Usage:* Out of stock, cancelled orders, rejected reviews, error banners.
- **Info (Blue):**
  - Text / Glyph: `#175CD3`
  - Subtle Surface: `#EFF8FF`
  - Border: `#B2DDFF`
  - *Usage:* Request submitted, in-production on printer beds, logistics dispatch, CAD inspection.

---

## 4. Semantic Token System (`globals.css`)

```css
:root {
  /* Core Surface Tokens */
  --color-background: #F7F6F2;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F2F4F7;
  --color-surface-inverse: #142333;
  --color-surface-card: #FFFFFF;

  /* Typography Tokens */
  --color-text-primary: #1D2B39;
  --color-text-secondary: #526170;
  --color-text-muted: #8B99A8;
  --color-text-inverse: #FFFFFF;

  /* Border Tokens */
  --color-border: #D7DDE2;
  --color-border-subtle: #E8ECEF;
  --color-border-inverse: #233547;
  --color-border-focus: #175CD3;

  /* Brand Accent Tokens */
  --color-brand: #175CD3;
  --color-brand-hover: #124AA9;
  --color-brand-light: #53B1FD;
  --color-brand-subtle: #EDF4FF;
  --color-brand-foreground: #FFFFFF;

  /* Functional Status Tokens */
  --color-success: #027A48;
  --color-success-bg: #ECFDF3;
  --color-success-border: #A6F4C5;
  --color-success-foreground: #FFFFFF;

  --color-warning: #B54708;
  --color-warning-bg: #FFFAEB;
  --color-warning-border: #FEDF89;
  --color-warning-foreground: #FFFFFF;

  --color-danger: #B42318;
  --color-danger-bg: #FEF3F2;
  --color-danger-border: #FECDCA;
  --color-danger-hover: #912018;
  --color-danger-foreground: #FFFFFF;

  --color-info: #175CD3;
  --color-info-bg: #EFF8FF;
  --color-info-border: #B2DDFF;
  --color-info-foreground: #FFFFFF;
}
```

---

## 5. Shared Components Updated

### A. Button Primitive (`src/components/ui/button.tsx`)
- Standardized variants:
  - `primary`: Solid brand blue (`bg-[var(--color-brand)] text-white shadow-2xs hover:bg-[var(--color-brand-hover)]`)
  - `secondary`: Clean white surface with crisp neutral border (`bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]`)
  - `outline`: Transparent with subtle border (`border border-[var(--color-border)] hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]`)
  - `tertiary`: Borderless subtle text button (`text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]`)
  - `ghost`: Transparent interactive button (`hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]`)
  - `danger`: Red action button (`bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)]`)
  - `link`: Inline text link (`text-[var(--color-brand)] hover:underline`)
- Added `isLoading` prop with integrated accessible spinner.
- Added tactile Apple-inspired press response (`active:scale-[0.98]`).

### B. Badge Primitive (`src/components/ui/badge.tsx`)
- Standardized variants to consume semantic variables: `default`, `brand`, `sample`, `coming-soon`, `new`, `bestseller`, `success`, `warning`, `danger`, `info`.
- Neutral, crisp borders matching the status stroke palette.

### C. Admin Status Badge (`src/components/admin/admin-status-badge.tsx`)
- All 12+ order lifecycle, quotation, review, and logistics states mapped cleanly into the 4 functional semantic color tokens + neutral.
- Replaced arbitrary ad-hoc Tailwind classes (`sky`, `indigo`, `rose`, `orange`).

### D. Process Cards (`src/components/home/process-cards.tsx`)
- Completely unified: all three cards ("Imagine", "Shape", "Make") now use identical clean white surfaces with crisp neutral borders and brand blue iconography.
- Removed rainbow card backgrounds, gradient connecting bar, and `6xl` watermark numbers.
- Connected via a refined neutral dashed divider on desktop.

---

## 6. Pages Visually Refined

1. **Homepage (`/`):**
   - Cleaned up `ProcessCards` to eliminate AI-generated rainbow gradients.
   - Refined hero image scrim to functional photographic overlay only.
   - Preserved Figma-aligned product carousel and customer trust indicators.
2. **Shop & Product Catalog (`/shop`, `/shop/[slug]`):**
   - Standardized product card badges to semantic status tokens.
   - Updated wishlist toggle to use semantic danger colors (`#B42318`) on active state.
   - Refined inventory availability indicator on product purchase card to consume semantic status tokens.
3. **Custom 3D Printing (`/custom/3d-printing`):**
   - Material cards (PLA, PETG, TPU, Resin) standardized to clean white cards with consistent borders and subtle brand hover accents.
   - 3D Model viewport container cleaned to solid `#142333` dark studio finish without noisy gradients.
   - Submission confirmation banner restyled to clean white card with restrained green success status token.
4. **Informational Pages (`/about`, `/how-it-works`, `/contact`, `/track-order`):**
   - Replaced rainbow card variations on How It Works with unified process cards.
   - Contact form success banner and error messages mapped to semantic success and danger tokens.
   - Updated footer contact link to point directly to `/contact`.
5. **Admin Operations Portal (`/admin/*`):**
   - Replaced all `rounded-3xl` modal and card wrappers with crisp `rounded-2xl` containers.
   - Eliminated `shadow-2xl` across search modal, confirmation dialog, mobile drawer, and product/quotation/category edit sheets.
   - Replaced all artificial `indigo` highlights (KPI card, pipeline metric, quotation generator banner) with brand blue and info tokens.

---

## 7. AI-Style Visual Patterns Removed

| Pattern | Action Taken | Current Standard |
| :--- | :--- | :--- |
| **Purple/Indigo Accents** | Removed from admin metrics, custom prints quotation generator, and process cards | Unified brand blue (`#175CD3`) |
| **Rainbow Process Cards** | Removed green, indigo, and blue variants from `process-cards.tsx` | Consistent clean white cards with brand blue icon container |
| **Rainbow Material Cards** | Removed `bg-blue-50`, `bg-green-50`, `bg-orange-50`, `bg-purple-50` | Clean white cards with neutral border and hover accent |
| **Watermark Background Numerals** | Removed `text-6xl text-stone-200/60` | Crisp, legible monospace `STEP 01` eyebrow |
| **Exaggerated Radii (`rounded-3xl`)** | Replaced across 12 files | Structured `rounded-2xl` (16px) and `rounded-xl` (12px) |
| **Exaggerated Drop Shadows (`shadow-2xl`)** | Replaced across 8 modals and drawers | Restrained layered shadows (`shadow-sm`, `shadow-md`, `shadow-xl`) |
| **Arbitrary Decorative Hover Colors** | Removed `group-hover:text-pink-400` from Instagram link | Standardized to `group-hover:text-white` |

---

## 8. Verification & Build Confirmation

- **TypeScript Typecheck:** `npx tsc --noEmit` passed with 0 errors.
- **Production Build:** `npm run build` compiled 38 static and dynamic routes in 4.0s with zero warnings or errors.
- **Responsive Layout Safeguards:**
  - Desktop: strictly `32px` padding (`lg:px-8`).
  - Mobile: strictly `16px` padding (`px-4`).
  - Master width: strictly `max-w-[1440px] mx-auto`.
  - Top breadcrumb spacing: strictly `16px` (`pt-4`).

---

## 9. Conclusion

The NewtronLabs storefront and admin dashboard now reflect a mature, art-directed e-commerce experience. Visual noise has been eliminated, brand identity is coherent across every route, and future pages can cleanly consume the centralized semantic token architecture without introducing arbitrary styles.
