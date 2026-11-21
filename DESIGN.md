# NewtronLabs Design, Breadcrumbs & Motion System (DESIGN.md)

> Apple-inspired design engineering guidelines, unified typography, global breadcrumb conventions, and motion rules derived from Emil Kowalski's craft philosophy, translated for the NewtronLabs / 3D Printing Wallah digital platform.

---

## 1. Core Principles & Craft Philosophy

- **Taste is trained, not innate**: High-calibre craft elevates functional software into an experience that feels alive, intentional, and inevitable.
- **Unseen details compound**: Invisible correctness (instant `:active` press feedback, 1:1 direct touch tracking, hardware-accelerated transforms, zero layout shifts) creates an experience users enjoy effortlessly.
- **Beauty is leverage**: Precision typography, restrained semantic color, translucent materials, and generous whitespace differentiate NewtronLabs as a high-precision, trustworthy 3D workshop.
- **Enquiry-First Business Model**: Clear communication that NewtronLabs reviews requirements, inspects filament stocks, and confirms shipping before arranging payment separately — with zero hidden online gateway fees.

---

## 2. Surfaces, Materials & Depth

- **Translucent Glass Bar**: Navigation headers use dynamic glass blurring:
  ```css
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(215, 221, 226, 0.70);
  ```
  *Why: Maintains continuous spatial context as content scrolls beneath without compromising typographic contrast.*
- **Apple Elevation Cards (`.apple-card`)**: Layered optical shadows instead of heavy solid borders:
  ```css
  --shadow-card: 0 2px 4px rgba(29, 43, 57, 0.03), 0 8px 16px -2px rgba(29, 43, 57, 0.04);
  --shadow-hover: 0 4px 8px rgba(29, 43, 57, 0.04), 0 16px 32px -4px rgba(29, 43, 57, 0.08);
  ```
  *Why: Thick dark borders flatten UI elements; layered soft shadows reflect physical ambient light.*

---

## 3. Brand Colors & Semantic Palette

All interface colors inherit from NewtronLabs' Figma tokens:

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `--brand-inverse` | `#1D2B39` (Deep Navy) | Headings, primary text, dark action buttons, footer surface |
| `--foreground` | `#1D2B39` | Standard text and high-contrast labels |
| `--primary` | `#0071E3` / `#175CD3` | Interactive links, active navigation pills, primary CTAs |
| `--primary-hover`| `#0058B3` / `#154FB3` | Focused and hovered interactive states |
| `--accent` | `#F0F6FA` / `#EFF8FF` | Active background highlights, pill badges, subtle hover fills |
| `--background` | `#FFFFFF` | Core canvas and card background |
| `--border` | `#D7DDE2` | Subtle containment lines and dividers |
| `--muted-foreground` | `#64748B` | Secondary details, metadata, captions, timestamps |
| `status-green` | Emerald-600 / `#059669` | "In Stock", verified layers, order logged |
| `status-amber` | Amber-600 / `#D97706` | "Low Stock (<5 left)", urgent queue, high demand |
| `status-rose` | Rose-600 / `#E11D48` | "Out of Stock", validation errors, destructive actions |
| `status-blue` | Sky-600 / `#0284C7` | "Made to Order", workshop review, technical specs |

---

## 4. Typography Hierarchy & Optical Scaling

Font family: **Inter** (`var(--font-inter)`), paired with Apple-style negative letter-spacing on display headings:

- **Hero Display**: `text-3xl sm:text-5xl lg:text-6xl`, `font-extrabold`, tracking `-0.03em`, line-height `1.08`.
- **Page Titles**: `text-2xl sm:text-3xl lg:text-4xl`, `font-extrabold`, tracking `-0.025em`.
- **Section Headings**: `text-xl sm:text-2xl`, `font-bold`, tracking `-0.02em`.
- **Body Regular**: `text-sm sm:text-base`, `font-normal`, line-height `1.6`, text `var(--foreground)` or `var(--muted-foreground)`.
- **Eyebrow / Overline**: `text-[11px] sm:text-xs`, `font-bold`, `uppercase`, tracking `+0.06em`, color `var(--primary)`.
- **Captions & Fine Print**: `text-[11px] sm:text-xs`, `font-medium`, text `var(--muted-foreground)`.

---

## 5. Spacing System & Grid Containers

- **Standard 1440px Page Containers**:
  - Master width: `max-w-[1440px] mx-auto` across all primary pages, navigation header, carousels, and footer.
  - **Desktop View Horizontal Padding**: Strictly **32px** (`lg:px-8` / `2rem`).
  - **Mobile View Horizontal Padding**: Strictly **16px** (`px-4` / `1rem`).
  - **Top Padding Above Breadcrumbs**: Strictly **16px** (`pt-4`).
- **Focused Sub-Containers (Centered inside 1440px frame)**:
  - `max-w-5xl` for guided multi-step workflows (`/custom/3d-printing`).
  - `max-w-3xl` for forms and editorial narratives (`/about`, `/contact`, `/track-order`, order confirmation).
- **Vertical Spacing Rhythm**:
  - Inter-section spacing: `gap-8 sm:gap-12 lg:gap-16`.
  - Component gap: `gap-4 sm:gap-6`.

---

## 6. Border Radii & Shadows

- `rounded-3xl` (`24px`): Large feature banners, order confirmations, carousel showcases.
- `rounded-2xl` (`16px`): Standard cards (`.apple-card`), product grids, process step panels.
- `rounded-xl` (`12px`): Form inputs, select dropdowns, primary buttons.
- `rounded-lg` (`8px`): Small badges, color selectors, thumbnail image frames.
- `rounded-full` (`9999px`): Active navigation pills, notification counters, category chips.

---

## 7. Shared Component Rules

### A. Buttons & CTAs
- **Scale Feedback**: `:active:scale-97` with `transition-transform 120ms var(--ease-out)`.
- **Minimum Target**: Minimum 44×44px touch targets on mobile devices.
- **Focus States**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2`.

### B. Form Inputs & Textareas
- **iOS Font Zoom Protection**: 16px minimum text size on coarse pointer devices.
- **Surface**: Subtle background `bg-stone-50/50` transitioning to `bg-white` on `:focus` with ring illumination.
- **Clear Validation**: Inline message with icon (`AlertCircle` in rose/amber, `CheckCircle2` in emerald).

### C. Product Cards
- **Hover Motion**: Product image scales subtly (`group-hover:scale-104 transition-transform duration-500 var(--ease-out)`).
- **Stock Badges**: Translucent glass badge overlay (`backdrop-blur-xs`) in top-left.
- **Wishlist Action**: Tactile floating pill in top-right with scale bounce on save.

---

## 8. Global Navigation & Active Route Behavior

Desktop navigation order:
1. **Home** (`/`)
2. **Shop** (`/shop`)
3. **Custom 3D Printing** (`/custom/3d-printing`)
4. **How It Works** (`/how-it-works`)
5. **About** (`/about`)
6. *Utility*: **Track Order** (`/track-order`) & **Cart (N)** (`/cart`)

### Active State Rules
- **Home**: Active exclusively on `/`.
- **Shop**: Active on `/shop` and sub-routes `/shop/[slug]`.
- **Custom Printing**: Active on `/custom/3d-printing` and any `/custom/*` sub-routes.
- **How It Works / About / Track Order**: Active on exact match or subpath.
- **Cart**: Active on `/cart` and `/checkout`, dynamic count badge from `useCart()`.
- **Styling**: Apple-style subtle active pill (`bg-blue-50/80 text-[var(--primary)] font-bold shadow-2xs`).

### Mobile Navigation Drawer
- Body scroll locking (`document.body.style.overflow = "hidden"`) while open.
- Auto-closes upon link navigation.
- Accessible backdrop dismiss.
- Live cart count badge maintained.

---

## 9. Global Breadcrumb Conventions

The reusable `<Breadcrumbs>` component (`src/components/ui/breadcrumbs.tsx`) enforces consistent navigation:

| Page | Breadcrumb Hierarchy |
| :--- | :--- |
| **Homepage** | *None by default* |
| **Shop** | `Home / Shop` |
| **Product Detail** | `Home / Shop / [Product Name]` |
| **Custom 3D Printing** | `Home / Custom 3D Printing` |
| **How It Works** | `Home / How It Works` |
| **About** | `Home / About` |
| **Track Order** | `Home / Track Order` |
| **Cart** | `Home / Cart` |
| **Order Request Checkout** | `Home / Cart / Submit Order Request` |
| **Contact** | `Home / Contact` |

### Standards:
- Semantic markup: `<nav aria-label="Breadcrumb">`, `<ol>`, `<li>`, with `aria-current="page"` on current terminal.
- Top Spacing Rule: Exactly **16px** (`pt-4`) padding above breadcrumbs, ensuring consistent vertical rhythm below the sticky navigation bar across all pages.
- Parent elements are clickable links; terminal element is plain un-clickable bold text.
- Truncates gracefully with `truncate max-w-[200px] sm:max-w-md` on mobile viewports.
- No duplicated breadcrumbs on any page.

---

## 10. Motion, Choreography & Performance

- **Composite Only**: Animate exclusively `transform` and `opacity`. Never trigger layout recalculation with animated width/height.
- **Easing Curves**:
  ```css
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
  ```
- **Durations**:
  - Micro-interactions (press / tap): `100–140ms`
  - Dropdowns & Pills: `180–240ms`
  - Drawers & Sheets: `250–320ms`
- **Prefers-Reduced-Motion**: Respects user OS preference by nullifying transition durations and disabling auto-rotation.

---

## 11. Responsive Breakpoints

- **Mobile (390px)**: Single column layouts, sticky bottom bars, truncated breadcrumbs, 44px tap targets.
- **Tablet (768px)**: 2-column product grids, compact process steps.
- **Laptop (1280px)**: 3-column product cards, side-by-side purchase and gallery views.
- **Desktop (1440px+)**: Generous whitespace, sticky order summary sidebars.
