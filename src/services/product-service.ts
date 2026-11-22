import { Product, ProductCategory, ProductAvailability } from "@/types/product";
import { products as baseProducts, SHOP_CATEGORIES } from "@/data/products";

export interface ProductFilterParams {
  category?: ProductCategory | "All Products";
  minPrice?: number;
  maxPrice?: number;
  availability?: ProductAvailability;
  material?: string;
  color?: string;
  featuredOnly?: boolean;
  bestsellerOnly?: boolean;
  query?: string;
  status?: "all" | "active" | "draft" | "archived";
}

export type ProductSortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "stock-low"
  | "stock-high"
  | "availability";

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByCategory(category: ProductCategory): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getBestSellers(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getPopularCollectibles(limit?: number): Promise<Product[]>;
  getRelatedProducts(currentProduct: Product, limit?: number): Promise<Product[]>;
  getCategoryCounts(): Promise<Record<ProductCategory, number>>;
  createProduct(product: Partial<Product>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | null>;
  duplicateProduct(id: string): Promise<Product | null>;
  archiveProduct(id: string): Promise<boolean>;
  deleteProduct(id: string): Promise<boolean>;
  searchAndFilter(
    params: ProductFilterParams,
    sort?: ProductSortOption
  ): Promise<{ products: Product[]; total: number }>;
}

const STORAGE_KEY = "newtronlabs_admin_products_v1";

class MockProductService implements IProductService {
  private customProducts: Product[] = [];

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.customProducts = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customProducts));
    } catch {}
  }

  private getMergedProducts(): Product[] {
    this.loadStorage();
    // Start with base products
    const map = new Map<string, Product>();
    baseProducts.forEach((p) => map.set(p.id, { ...p }));
    // Overlay or add custom products
    this.customProducts.forEach((p) => map.set(p.id, { ...p }));
    return Array.from(map.values());
  }

  async getAllProducts(): Promise<Product[]> {
    return this.getMergedProducts();
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const list = this.getMergedProducts();
    const found = list.find((p) => p.slug === slug);
    return found ? { ...found } : null;
  }

  async getProductById(id: string): Promise<Product | null> {
    const list = this.getMergedProducts();
    const found = list.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    const list = this.getMergedProducts();
    if (category === "All Products") return list;
    return list.filter((p) => p.category === category);
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    const list = this.getMergedProducts().filter(
      (p) => p.featured || p.badgeVariant === "bestseller" || (p.rating && p.rating >= 4.8)
    );
    return list.slice(0, limit);
  }

  async getBestSellers(limit = 6): Promise<Product[]> {
    const list = this.getMergedProducts().filter(
      (p) => p.bestseller || p.badge === "Bestseller" || (p.reviewCount && p.reviewCount > 20)
    );
    return list.slice(0, limit);
  }

  async getNewArrivals(limit = 6): Promise<Product[]> {
    const all = this.getMergedProducts();
    const list = all.filter((p) => p.newArrival || p.badge === "New" || p.badgeVariant === "new");
    return list.length > 0 ? list.slice(0, limit) : all.slice(0, limit);
  }

  async getPopularCollectibles(limit = 6): Promise<Product[]> {
    const list = this.getMergedProducts().filter(
      (p) =>
        p.category === "Collectibles" ||
        p.category === "Anime Figures" ||
        p.category === "Gaming" ||
        p.category === "Miniatures"
    );
    return list.slice(0, limit);
  }

  async getRelatedProducts(currentProduct: Product, limit: number = 3): Promise<Product[]> {
    const list = this.getMergedProducts();
    return list
      .filter((p) => p.id !== currentProduct.id)
      .sort((a, b) => {
        const aCategoryMatch = a.category === currentProduct.category ? 2 : 0;
        const bCategoryMatch = b.category === currentProduct.category ? 2 : 0;
        const aTagOverlap = a.tags.filter((t) => currentProduct.tags.includes(t)).length;
        const bTagOverlap = b.tags.filter((t) => currentProduct.tags.includes(t)).length;
        return bCategoryMatch + bTagOverlap - (aCategoryMatch + aTagOverlap);
      })
      .slice(0, limit);
  }

  async getCategoryCounts(): Promise<Record<ProductCategory, number>> {
    const list = this.getMergedProducts();
    const counts: Record<string, number> = {
      "All Products": list.length,
    };

    SHOP_CATEGORIES.forEach((cat) => {
      if (cat !== "All Products") {
        counts[cat] = list.filter((p) => p.category === cat).length;
      }
    });

    return counts as Record<ProductCategory, number>;
  }

  async createProduct(payload: Partial<Product>): Promise<Product> {
    this.loadStorage();
    const slug =
      payload.slug ||
      (payload.name ? payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `prod-${Date.now()}`);
    const id = payload.id || slug;

    const newProd: Product = {
      id,
      sku: payload.sku || `NWL-PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      slug,
      name: payload.name || "Untitled 3D Print",
      category: payload.category || "Planters",
      categoryLabel: payload.categoryLabel || `${payload.category || "Planters"} Collection`,
      subcategory: payload.subcategory,
      tagline: payload.tagline || "Custom precision crafted 3D creation.",
      description: payload.description || "Detailed 3D printed object created with high-durability infill.",
      shortDescription: payload.shortDescription || payload.tagline || "",
      price: payload.price ?? 499,
      originalPrice: payload.originalPrice,
      priceDisplay: payload.price ? `₹${payload.price.toLocaleString("en-IN")}` : "₹499",
      availability: payload.availability || "in_stock",
      available: payload.available ?? true,
      stockQuantity: payload.stockQuantity ?? 15,
      lowStockThreshold: payload.lowStockThreshold ?? 5,
      trackInventory: payload.trackInventory ?? true,
      allowBackorders: payload.allowBackorders ?? false,
      featured: payload.featured ?? false,
      bestseller: payload.bestseller ?? false,
      newArrival: payload.newArrival ?? true,
      images: payload.images && payload.images.length > 0 ? payload.images : ["/images/product-ribbed-planter.webp"],
      imageAlt: payload.imageAlt || payload.name || "3D printed creation",
      badge: payload.badge,
      badgeVariant: payload.badgeVariant,
      rating: payload.rating || 5.0,
      reviewCount: payload.reviewCount || 0,
      material: payload.material || "Matte PLA",
      dimensions: payload.dimensions || "100mm × 100mm × 100mm",
      weight: payload.weight || "150g",
      printingTechnology: payload.printingTechnology || "High-precision FDM",
      finish: payload.finish || "Smooth Satin",
      colors: payload.colors || ["Matte Black", "White", "Cobalt Blue"],
      tags: payload.tags || ["new", "3dprint"],
      features: payload.features || ["High infill", "Heat-resistant"],
      specifications: payload.specifications || [],
      productionTime: payload.productionTime || "24-48 Hours",
      href: `/shop/${slug}`,
    };

    this.customProducts.push(newProd);
    this.saveStorage();
    return newProd;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    this.loadStorage();
    const all = this.getMergedProducts();
    const existing = all.find((p) => p.id === id);
    if (!existing) return null;

    const updated: Product = {
      ...existing,
      ...updates,
      priceDisplay:
        updates.price !== undefined && updates.price !== null
          ? `₹${updates.price.toLocaleString("en-IN")}`
          : existing.priceDisplay,
    };

    // If already in customProducts, update it; otherwise add to customProducts overlay
    const idx = this.customProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.customProducts[idx] = updated;
    } else {
      this.customProducts.push(updated);
    }

    this.saveStorage();
    return updated;
  }

  async duplicateProduct(id: string): Promise<Product | null> {
    const existing = await this.getProductById(id);
    if (!existing) return null;

    const copySuffix = Math.floor(100 + Math.random() * 900);
    const newSlug = `${existing.slug}-copy-${copySuffix}`;

    return this.createProduct({
      ...existing,
      id: newSlug,
      slug: newSlug,
      name: `${existing.name} (Copy)`,
      sku: `NWL-PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      badge: "Draft",
      badgeVariant: "new",
      rating: 5.0,
      reviewCount: 0,
    });
  }

  async archiveProduct(id: string): Promise<boolean> {
    const updated = await this.updateProduct(id, {
      available: false,
      availability: "out_of_stock",
      badge: "Archived",
    });
    return !!updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    this.loadStorage();
    this.customProducts = this.customProducts.filter((p) => p.id !== id);
    this.saveStorage();
    return true;
  }

  async searchAndFilter(
    params: ProductFilterParams,
    sort: ProductSortOption = "featured"
  ): Promise<{ products: Product[]; total: number }> {
    let result = this.getMergedProducts();

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.category && params.category !== "All Products") {
      result = result.filter((p) => p.category === params.category);
    }

    if (params.availability) {
      result = result.filter((p) => p.availability === params.availability);
    }

    if (params.minPrice !== undefined) {
      result = result.filter((p) => p.price !== null && p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      result = result.filter((p) => p.price !== null && p.price <= params.maxPrice!);
    }

    // Sort
    switch (sort) {
      case "price-low":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "stock-low":
        result.sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0));
        break;
      case "stock-high":
        result.sort((a, b) => (b.stockQuantity ?? 0) - (a.stockQuantity ?? 0));
        break;
      case "newest":
        result.reverse();
        break;
      default:
        // featured
        break;
    }

    return {
      products: result,
      total: result.length,
    };
  }
}

export const productService = new MockProductService();
