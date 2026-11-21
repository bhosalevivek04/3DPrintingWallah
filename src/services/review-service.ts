import { AdminProductReview, ReviewStatus } from "@/types/admin";

export interface IReviewService {
  getAllReviews(): Promise<AdminProductReview[]>;
  getReviewsByProductId(productId: string): Promise<AdminProductReview[]>;
  updateReviewStatus(id: string, status: ReviewStatus): Promise<AdminProductReview | null>;
  deleteReview(id: string): Promise<boolean>;
}

export const INITIAL_DEMO_REVIEWS: AdminProductReview[] = [
  {
    id: "rev-001",
    productId: "ribbed-planter",
    productName: "Ribbed Geometric Planter",
    productImage: "/images/product-ribbed-planter.webp",
    customerName: "Sneha Patil",
    customerEmail: "sneha.p@outlook.com",
    rating: 5,
    title: "Stunning layer consistency & watertight",
    comment:
      "I was skeptical about 3D printed planters holding water, but this one has no leakage at all! The cobalt blue matte texture looks like expensive ceramic on my studio desk.",
    status: "Approved",
    verifiedPurchase: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "rev-002",
    productId: "modular-desk-tray",
    productName: "Modular Desk Organiser Tray",
    productImage: "/images/product-desk-tray.webp",
    customerName: "Kunal Ghosh",
    customerEmail: "kunal.g@gmail.com",
    rating: 5,
    title: "Perfect fit for stationary & calipers",
    comment:
      "Clean bevels and chamfers. Snaps together satisfyingly with the other modular components. Highly recommend NewtronLabs!",
    status: "Approved",
    verifiedPurchase: true,
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: "rev-003",
    productId: "lowpoly-fox",
    productName: "Geometric Low-Poly Fox Statue",
    productImage: "/images/product-lowpoly-fox.webp",
    customerName: "Tarun Sharma",
    customerEmail: "tarun.sharma@techcorp.in",
    rating: 4,
    title: "Great faceted geometry, slight brim mark on base",
    comment:
      "The burnt orange color is gorgeous under warm lamp light. There was a tiny brim residual underneath the paws, but easily smoothed with fine grit sandpaper.",
    status: "Approved",
    verifiedPurchase: true,
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: "rev-004",
    productId: "voronoi-lamp",
    productName: "Organic Voronoi Mood Lamp",
    productImage: "/images/product-voronoi-lamp.webp",
    customerName: "Meera Joshi",
    customerEmail: "meera.j@designwork.com",
    rating: 5,
    title: "Shadow patterns are mesmerizing!",
    comment:
      "Photos do not do justice to how beautiful the Voronoi shadows cast across the bedroom wall at night. Worth every rupee.",
    status: "Pending",
    verifiedPurchase: false,
    createdAt: Date.now() - 3600000 * 14,
  },
  {
    id: "rev-005",
    productId: "everyday-cable-clips",
    productName: "Everyday Minimal Cable Clips (Set of 6)",
    productImage: "/images/product-cable-clips.webp",
    customerName: "Spam Bot",
    customerEmail: "spam@randomcrypto.xyz",
    rating: 1,
    title: "Check out this free crypto link",
    comment: "Visit http://free-token-airdrop.example for free coins!",
    status: "Rejected",
    verifiedPurchase: false,
    createdAt: Date.now() - 86400000 * 2,
  },
];

const STORAGE_KEY = "newtronlabs_admin_reviews_v1";

class ReviewService implements IReviewService {
  private reviews: AdminProductReview[] = INITIAL_DEMO_REVIEWS;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.reviews = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reviews));
    } catch {}
  }

  async getAllReviews(): Promise<AdminProductReview[]> {
    this.loadStorage();
    return [...this.reviews].sort((a, b) => b.createdAt - a.createdAt);
  }

  async getReviewsByProductId(productId: string): Promise<AdminProductReview[]> {
    this.loadStorage();
    return this.reviews.filter((r) => r.productId === productId);
  }

  async updateReviewStatus(id: string, status: ReviewStatus): Promise<AdminProductReview | null> {
    this.loadStorage();
    const index = this.reviews.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.reviews[index] = {
      ...this.reviews[index],
      status,
    };
    this.saveStorage();
    return this.reviews[index];
  }

  async deleteReview(id: string): Promise<boolean> {
    this.loadStorage();
    const prev = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== id);
    this.saveStorage();
    return this.reviews.length < prev;
  }
}

export const reviewService = new ReviewService();
