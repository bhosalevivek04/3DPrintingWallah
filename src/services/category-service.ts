import { AdminCategory } from "@/types/admin";
import { products } from "@/data/products";

export interface ICategoryService {
  getAllCategories(): Promise<AdminCategory[]>;
  getCategoryById(id: string): Promise<AdminCategory | null>;
  createCategory(category: Omit<AdminCategory, "id" | "createdAt" | "updatedAt">): Promise<AdminCategory>;
  updateCategory(id: string, updates: Partial<AdminCategory>): Promise<AdminCategory | null>;
  deleteCategory(id: string): Promise<boolean>;
  reorderCategories(orderedIds: string[]): Promise<AdminCategory[]>;
}

export const INITIAL_DEMO_CATEGORIES: AdminCategory[] = [
  {
    id: "planters",
    name: "Planters",
    slug: "planters",
    description: "Architectural, geometric, and textured indoor planter vessels designed for succulents and flora.",
    image: "/images/product-ribbed-planter.webp",
    displayOrder: 1,
    isActive: true,
    subcategories: ["Geometric Planters", "Self-Watering Vessels", "Mini Desktop Pots"],
    productCount: products.filter((p) => p.category === "Planters").length,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "desk-accessories",
    name: "Desk Accessories",
    slug: "desk-accessories",
    description: "Minimalist workspace organizers, cable organizers, phone stands, and hex trays.",
    image: "/images/product-desk-tray.webp",
    displayOrder: 2,
    isActive: true,
    subcategories: ["Organiser Trays", "Cable Clips", "Phone Stands", "Pen Holders"],
    productCount: products.filter((p) => p.category === "Desk Accessories").length,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "collectibles",
    name: "Collectibles",
    slug: "collectibles",
    description: "Artistic desktop display figures, low-poly statues, and polygon art sculptures.",
    image: "/images/product-lowpoly-fox.webp",
    displayOrder: 3,
    isActive: true,
    subcategories: ["Low Poly Animals", "Busts & Statues", "Sci-Fi Sculptures"],
    productCount: products.filter((p) => p.category === "Collectibles").length,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: "home-decor",
    name: "Home Decor",
    slug: "home-decor",
    description: "Contemporary vases, organic aesthetic lamps, sculptural wall hooks, and decor accents.",
    image: "/images/product-voronoi-lamp.webp",
    displayOrder: 4,
    isActive: true,
    subcategories: ["Spiral Vases", "Voronoi Lamps", "Coaster Sets"],
    productCount: products.filter((p) => p.category === "Home Decor").length,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: "miniatures",
    name: "Miniatures",
    slug: "miniatures",
    description: "Ultra-fine detail resin figurines, tabletop RPG terrain, and display miniatures.",
    image: "/images/product-mini-dragon.webp",
    displayOrder: 5,
    isActive: true,
    subcategories: ["Tabletop Miniatures", "Dragon Figures", "Scale Dioramas"],
    productCount: products.filter((p) => p.category === "Miniatures").length,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: "gaming",
    name: "Gaming",
    slug: "gaming",
    description: "Custom controller stands, headphone hangars, and ergonomic gaming peripherals.",
    image: "/images/product-controller-stand.webp",
    displayOrder: 6,
    isActive: true,
    subcategories: ["Controller Stands", "Headset Docks", "Keycap Artisans"],
    productCount: products.filter((p) => p.category === "Gaming").length,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: "custom-creations",
    name: "Custom Creations",
    slug: "custom-creations",
    description: "Bespoke engineered prototypes, personalised nameplates, and customer CAD prints.",
    image: "/images/hero-workshop.webp",
    displayOrder: 7,
    isActive: true,
    subcategories: ["Rapid Prototypes", "Bespoke Gifts", "Replacement Parts"],
    productCount: 1,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

const STORAGE_KEY = "newtronlabs_admin_categories_v1";

class CategoryService implements ICategoryService {
  private categories: AdminCategory[] = INITIAL_DEMO_CATEGORIES;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.categories = JSON.parse(stored);
      }
    } catch {
      // fallback to memory
    }
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categories));
    } catch {
      // ignore
    }
  }

  async getAllCategories(): Promise<AdminCategory[]> {
    this.loadStorage();
    return [...this.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCategoryById(id: string): Promise<AdminCategory | null> {
    this.loadStorage();
    return this.categories.find((c) => c.id === id) || null;
  }

  async createCategory(payload: Omit<AdminCategory, "id" | "createdAt" | "updatedAt">): Promise<AdminCategory> {
    this.loadStorage();
    const newCat: AdminCategory = {
      ...payload,
      id: payload.slug || `cat-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      productCount: 0,
    };
    this.categories.push(newCat);
    this.saveStorage();
    return newCat;
  }

  async updateCategory(id: string, updates: Partial<AdminCategory>): Promise<AdminCategory | null> {
    this.loadStorage();
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.categories[index] = {
      ...this.categories[index],
      ...updates,
      updatedAt: Date.now(),
    };
    this.saveStorage();
    return this.categories[index];
  }

  async deleteCategory(id: string): Promise<boolean> {
    this.loadStorage();
    const prevLen = this.categories.length;
    this.categories = this.categories.filter((c) => c.id !== id);
    this.saveStorage();
    return this.categories.length < prevLen;
  }

  async reorderCategories(orderedIds: string[]): Promise<AdminCategory[]> {
    this.loadStorage();
    this.categories = this.categories.map((c) => {
      const idx = orderedIds.indexOf(c.id);
      return idx !== -1 ? { ...c, displayOrder: idx + 1, updatedAt: Date.now() } : c;
    });
    this.categories.sort((a, b) => a.displayOrder - b.displayOrder);
    this.saveStorage();
    return this.categories;
  }
}

export const categoryService = new CategoryService();
