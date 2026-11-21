export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "ready" | "personalised" | "custom";
  categoryLabel: string;
  price: number | null;
  priceDisplay: string;
  badge?: string;
  badgeVariant?: "new" | "sample" | "coming-soon" | "bestseller";
  imageAlt: string;
  imageColor: string; // tailwind bg class for placeholder
  href: string;
  available: boolean;
}
