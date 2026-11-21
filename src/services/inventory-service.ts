import { ProductAvailability } from "@/types/product";
import { products } from "@/data/products";
import { StockAdjustmentLog, StockAdjustmentReason } from "@/types/admin";

export interface InventoryItemState {
  productId: string;
  name: string;
  sku: string;
  category: string;
  stockQuantity: number;
  lowStockThreshold: number;
  availability: ProductAvailability;
  trackInventory: boolean;
  allowBackorders: boolean;
  lastAdjusted?: number;
}

export interface IInventoryService {
  getInventoryOverview(): Promise<InventoryItemState[]>;
  updateStock(
    productId: string,
    newStock: number,
    reason?: StockAdjustmentReason,
    notes?: string,
    adjustedBy?: string
  ): Promise<boolean>;
  setAvailability(productId: string, availability: ProductAvailability): Promise<boolean>;
  getAdjustmentLogs(productId?: string): Promise<StockAdjustmentLog[]>;
}

const STORAGE_KEY_ITEMS = "newtronlabs_admin_inventory_items_v1";
const STORAGE_KEY_LOGS = "newtronlabs_admin_inventory_logs_v1";

export const INITIAL_DEMO_ADJUSTMENT_LOGS: StockAdjustmentLog[] = [
  {
    id: "adj-001",
    productId: "ribbed-planter",
    productName: "Ribbed Geometric Planter",
    sku: "NWL-PRD-0101",
    previousQuantity: 15,
    adjustmentQuantity: 10,
    updatedQuantity: 25,
    reason: "Restocked batch",
    adjustedBy: "Workshop Operator",
    notes: "Completed weekend 10-unit batch print in Cobalt Blue.",
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: "adj-002",
    productId: "modular-desk-tray",
    productName: "Modular Desk Organiser Tray",
    sku: "NWL-PRD-0102",
    previousQuantity: 6,
    adjustmentQuantity: -2,
    updatedQuantity: 4,
    reason: "Damaged in workshop",
    adjustedBy: "QA Inspector",
    notes: "Nozzle clog caused layer shift on 2 units during 80% mark.",
    timestamp: Date.now() - 86400000 * 1,
  },
  {
    id: "adj-003",
    productId: "everyday-cable-clips",
    productName: "Everyday Minimal Cable Clips (Set of 6)",
    sku: "NWL-PRD-0103",
    previousQuantity: 20,
    adjustmentQuantity: 10,
    updatedQuantity: 30,
    reason: "Restocked batch",
    adjustedBy: "Workshop Operator",
    notes: "Multi-part plate print finished.",
    timestamp: Date.now() - 86400000 * 3,
  },
];

class MockInventoryService implements IInventoryService {
  private inventory: Map<string, InventoryItemState> = new Map();
  private logs: StockAdjustmentLog[] = INITIAL_DEMO_ADJUSTMENT_LOGS;

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    products.forEach((p, idx) => {
      this.inventory.set(p.id, {
        productId: p.id,
        name: p.name,
        sku: p.sku || `NWL-PRD-${String(idx + 101).padStart(4, "0")}`,
        category: p.category,
        stockQuantity: p.stockQuantity ?? 10,
        lowStockThreshold: p.lowStockThreshold ?? 5,
        availability: p.availability,
        trackInventory: p.trackInventory ?? true,
        allowBackorders: p.allowBackorders ?? false,
        lastAdjusted: Date.now() - 86400000 * 2,
      });
    });
  }

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (storedItems) {
        const parsed: InventoryItemState[] = JSON.parse(storedItems);
        parsed.forEach((item) => this.inventory.set(item.productId, item));
      }
      const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_KEY_ITEMS,
        JSON.stringify(Array.from(this.inventory.values()))
      );
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.logs));
    } catch {}
  }

  async getInventoryOverview(): Promise<InventoryItemState[]> {
    this.loadStorage();
    return Array.from(this.inventory.values());
  }

  async updateStock(
    productId: string,
    newStock: number,
    reason: StockAdjustmentReason = "Restocked batch",
    notes: string = "",
    adjustedBy: string = "Workshop Manager"
  ): Promise<boolean> {
    this.loadStorage();
    const item = this.inventory.get(productId);
    if (!item) return false;

    const previousQuantity = item.stockQuantity;
    const adjustmentQuantity = newStock - previousQuantity;

    let computedAvailability: ProductAvailability = "in_stock";
    if (newStock <= 0) {
      computedAvailability = item.allowBackorders ? "made_to_order" : "out_of_stock";
    } else if (newStock <= item.lowStockThreshold) {
      computedAvailability = "low_stock";
    }

    const updatedItem: InventoryItemState = {
      ...item,
      stockQuantity: newStock,
      availability: computedAvailability,
      lastAdjusted: Date.now(),
    };

    this.inventory.set(productId, updatedItem);

    // Record adjustment log
    const log: StockAdjustmentLog = {
      id: `adj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName: item.name,
      sku: item.sku,
      previousQuantity,
      adjustmentQuantity,
      updatedQuantity: newStock,
      reason,
      adjustedBy,
      notes,
      timestamp: Date.now(),
    };
    this.logs.unshift(log);

    this.saveStorage();
    return true;
  }

  async setAvailability(productId: string, availability: ProductAvailability): Promise<boolean> {
    this.loadStorage();
    const item = this.inventory.get(productId);
    if (!item) return false;

    this.inventory.set(productId, {
      ...item,
      availability,
      lastAdjusted: Date.now(),
    });
    this.saveStorage();
    return true;
  }

  async getAdjustmentLogs(productId?: string): Promise<StockAdjustmentLog[]> {
    this.loadStorage();
    if (productId) {
      return this.logs.filter((l) => l.productId === productId);
    }
    return [...this.logs].sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const inventoryService = new MockInventoryService();
