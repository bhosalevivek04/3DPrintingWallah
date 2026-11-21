# 3dprintingwallah

**3D Printing Wallah** — Ideas into objects, layer by layer.

A Next.js SSR storefront for the 3D printing service. Built from the OpenPencil / NewtronLabs design system.

## Stack

- **Next.js 16** (App Router, SSR)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve production build
```

## Project structure

```
src/
├── app/
│   ├── (storefront)/          # Storefront route group
│   │   ├── layout.tsx         # Announcement + Header + Footer shell
│   │   ├── page.tsx           # Homepage
│   │   ├── shop/page.tsx      # Product catalogue
│   │   ├── custom/
│   │   │   └── 3d-printing/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── about/page.tsx
│   │   └── track-order/page.tsx
│   ├── globals.css            # Design tokens + Tailwind base
│   └── layout.tsx             # Root layout (Inter font + metadata)
├── components/
│   ├── home/                  # Page sections (Hero, Products, FAQ…)
│   ├── layout/                # Header, Footer, Shell, Announcement
│   ├── navigation/            # Desktop + Mobile nav
│   └── ui/                   # Button, Badge, Container, SectionHeading
├── config/
│   ├── site.ts                # Brand config & contact info
│   └── navigation.ts          # Nav items
├── data/
│   └── products.ts            # Sample product data
├── types/
│   ├── navigation.ts
│   └── product.ts
└── lib/
    └── utils.ts               # cn(), formatPrice()
```

## Design system

Tokens come directly from the OpenPencil / NewtronLabs Figma file:

| Token | Value |
|---|---|
| `--background` | `#F7F6F2` |
| `--foreground` | `#1D2B39` |
| `--primary` | `#175CD3` |
| `--primary-hover` | `#124AA9` |
| `--border` | `#D7DDE2` |
| `--muted` | `#EDF4FF` |
| `--muted-foreground` | `#526170` |

## Pages

| Route | Description |
|---|---|
| `/` | Homepage (all sections) |
| `/shop` | Product catalogue |
| `/custom/3d-printing` | Custom print request form |
| `/how-it-works` | 3-step process page |
| `/about` | About the workshop |
| `/track-order` | Order tracking |
