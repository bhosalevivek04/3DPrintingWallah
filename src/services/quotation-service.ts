import { Quotation, QuotationStatus, QuotationLineItem } from "@/types/admin";

export interface IQuotationService {
  getAllQuotations(): Promise<Quotation[]>;
  getQuotationById(id: string): Promise<Quotation | null>;
  createQuotation(quotation: Omit<Quotation, "id" | "createdAt" | "updatedAt">): Promise<Quotation>;
  updateQuotation(id: string, updates: Partial<Quotation>): Promise<Quotation | null>;
  updateQuotationStatus(id: string, status: QuotationStatus): Promise<Quotation | null>;
  deleteQuotation(id: string): Promise<boolean>;
}

export const INITIAL_DEMO_QUOTATIONS: Quotation[] = [
  {
    id: "NWL-QTN-202611-001",
    orderId: "NWL-ORD-20261121-7104",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@example.com",
    customerPhone: "+91 98765 43210",
    company: "Design Craft Studio",
    items: [
      {
        id: "item-1",
        title: "Modular Desk Organiser Tray (Sandstone Finish)",
        description: "Dense 40% infill with sanded top surfaces for exhibition display.",
        quantity: 1,
        unitPrice: 449,
        total: 449,
      },
    ],
    materialCharge: 0,
    finishingCharge: 150,
    designCharge: 0,
    deliveryCharge: 80,
    subtotal: 599,
    discount: 50,
    tax: 0,
    grandTotal: 629,
    validityDate: Date.now() + 86400000 * 14,
    notes: "Special surface smoothing applied for showroom presentation. Delivery via express air.",
    terms: "Quotation valid for 14 days. 100% advance payment via UPI or NEFT required prior to production dispatch.",
    status: "Sent",
    sentAt: Date.now() - 3600000 * 2,
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: "NWL-QTN-202611-002",
    customPrintId: "NWL-CP-20261120-9182",
    customerName: "Vikram Rathore",
    customerEmail: "vikram.r@drone-prototypes.in",
    customerPhone: "+91 98220 88776",
    company: "AeroDrone Mechanics",
    items: [
      {
        id: "item-1",
        title: "Drone Landing Gear Strut (Left & Right Pair)",
        description: "Printed in Carbon-fiber reinforced PETG, 0.20mm layer height, 80% gyroid infill.",
        quantity: 2,
        unitPrice: 850,
        total: 1700,
      },
      {
        id: "item-2",
        title: "Gimbal Motor Mount Adapter Plate",
        description: "High-temperature ABS with acetone vapor smoothing.",
        quantity: 1,
        unitPrice: 420,
        total: 420,
      },
    ],
    materialCharge: 250,
    finishingCharge: 200,
    designCharge: 500, // CAD optimization
    deliveryCharge: 120,
    subtotal: 3070,
    discount: 170,
    tax: 0,
    grandTotal: 3020,
    validityDate: Date.now() + 86400000 * 10,
    notes: "Dimensional tolerance guaranteed to ±0.2mm for M3 screw mounts.",
    terms: "Prices exclude GST. Prototype verification required on customer test rig.",
    status: "Ready for Review",
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: "NWL-QTN-202611-003",
    customPrintId: "NWL-CP-20261115-4421",
    customerName: "Dr. Sandeep Banerjee",
    customerEmail: "sandeep.b@medtech-labs.in",
    customerPhone: "+91 98112 34567",
    company: "BioMed Prototype Solutions",
    items: [
      {
        id: "item-1",
        title: "Microfluidic Sensor Enclosure Prototype",
        description: "Ultra-fine 8K resin print, translucent clear biocompatible resin with UV post-cure.",
        quantity: 4,
        unitPrice: 1250,
        total: 5000,
      },
    ],
    materialCharge: 800,
    finishingCharge: 600,
    designCharge: 0,
    deliveryCharge: 150,
    subtotal: 6550,
    discount: 0,
    tax: 0,
    grandTotal: 6550,
    validityDate: Date.now() + 86400000 * 7,
    notes: "Requires clean-room ultrasonic alcohol bath and post-curing.",
    terms: "Signed NDA in effect. Custom resin batch certificate included.",
    status: "Accepted",
    sentAt: Date.now() - 86400000 * 4,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 3,
  },
];

const STORAGE_KEY = "newtronlabs_admin_quotations_v1";

class QuotationService implements IQuotationService {
  private quotations: Quotation[] = INITIAL_DEMO_QUOTATIONS;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.quotations = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.quotations));
    } catch {}
  }

  async getAllQuotations(): Promise<Quotation[]> {
    this.loadStorage();
    return [...this.quotations].sort((a, b) => b.createdAt - a.createdAt);
  }

  async getQuotationById(id: string): Promise<Quotation | null> {
    this.loadStorage();
    return this.quotations.find((q) => q.id === id) || null;
  }

  async createQuotation(payload: Omit<Quotation, "id" | "createdAt" | "updatedAt">): Promise<Quotation> {
    this.loadStorage();
    const count = this.quotations.length + 1;
    const dateStr = new Date().toISOString().slice(0, 7).replace("-", "");
    const id = `NWL-QTN-${dateStr}-${String(count).padStart(3, "0")}`;
    const newQuote: Quotation = {
      ...payload,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.quotations.unshift(newQuote);
    this.saveStorage();
    return newQuote;
  }

  async updateQuotation(id: string, updates: Partial<Quotation>): Promise<Quotation | null> {
    this.loadStorage();
    const index = this.quotations.findIndex((q) => q.id === id);
    if (index === -1) return null;
    this.quotations[index] = {
      ...this.quotations[index],
      ...updates,
      updatedAt: Date.now(),
    };
    this.saveStorage();
    return this.quotations[index];
  }

  async updateQuotationStatus(id: string, status: QuotationStatus): Promise<Quotation | null> {
    this.loadStorage();
    const index = this.quotations.findIndex((q) => q.id === id);
    if (index === -1) return null;
    this.quotations[index] = {
      ...this.quotations[index],
      status,
      sentAt: status === "Sent" ? Date.now() : this.quotations[index].sentAt,
      updatedAt: Date.now(),
    };
    this.saveStorage();
    return this.quotations[index];
  }

  async deleteQuotation(id: string): Promise<boolean> {
    this.loadStorage();
    const prev = this.quotations.length;
    this.quotations = this.quotations.filter((q) => q.id !== id);
    this.saveStorage();
    return this.quotations.length < prev;
  }
}

export const quotationService = new QuotationService();
