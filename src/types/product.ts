export type ProductCategory =
  | "All Products"
  | "Collectibles"
  | "Anime Figures"
  | "Miniatures"
  | "Home Decor"
  | "Desk Accessories"
  | "Planters"
  | "Gaming"
  | "Custom Creations";

export type ProductAvailability =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "made_to_order"
  | "Ready to Order"
  | "Made to Order"
  | "Out of Stock";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku?: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel?: string;
  subcategory?: string;
  tagline: string;
  description: string;
  shortDescription: string;
  price: number | null;
  originalPrice?: number | null;
  priceDisplay: string;
  availability: ProductAvailability;
  available: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  allowBackorders?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  createdAt?: number;
  updatedAt?: number;
  images: string[];
  imageAlt: string;
  badge?: string;
  badgeVariant?: "new" | "sample" | "coming-soon" | "bestseller";
  rating?: number;
  reviewCount?: number;
  material?: string;
  dimensions?: string;
  weight?: string;
  printingTechnology?: string;
  finish?: string;
  colors?: string[];
  tags: string[];
  features?: string[];
  specifications?: ProductSpecification[];
  productionTime?: string;
  href: string;
}
