import {
  OrderTrackingRecord,
  CourierName,
  TrackingFulfillmentStatus,
} from "@/types/admin";

export interface ITrackingService {
  getAllTrackingRecords(): Promise<OrderTrackingRecord[]>;
  getTrackingByOrderId(orderId: string): Promise<OrderTrackingRecord | null>;
  updateTracking(
    orderId: string,
    updates: Partial<OrderTrackingRecord>
  ): Promise<OrderTrackingRecord | null>;
  addTrackingEvent(
    orderId: string,
    event: { status: string; location: string; note: string }
  ): Promise<OrderTrackingRecord | null>;
}

export const INITIAL_DEMO_TRACKING: OrderTrackingRecord[] = [
  {
    orderId: "NWL-ORD-20261118-2991",
    trackingNumber: "DEL4891029318",
    courierName: "Delhivery",
    courierUrl: "https://www.delhivery.com/track/package/DEL4891029318",
    fulfillmentStatus: "In Transit",
    dispatchDate: Date.now() - 86400000 * 2,
    estimatedDeliveryDate: Date.now() + 86400000 * 1,
    originLocation: "Pune Workshop Hub (Baner)",
    destinationCity: "Pune (Kothrud)",
    trackingNotes: "Dispatched in reinforced corrugated box with protective foam sleeves.",
    events: [
      {
        timestamp: Date.now() - 86400000 * 2,
        status: "Package Picked Up",
        location: "Pune Workshop (Baner)",
        note: "Handed over to Delhivery logistics associate.",
      },
      {
        timestamp: Date.now() - 86400000 * 1.5,
        status: "Arrived at Processing Center",
        location: "Bhosari Sorting Facility, Pune",
        note: "Automated optical sorting complete.",
      },
      {
        timestamp: Date.now() - 3600000 * 8,
        status: "In Transit to Destination Delivery Station",
        location: "Kothrud Delivery Hub, Pune",
        note: "Scheduled for last-mile delivery attempt tomorrow morning.",
      },
    ],
    updatedAt: Date.now() - 3600000 * 8,
  },
  {
    orderId: "NWL-ORD-20261120-4821",
    trackingNumber: "BLU771029831",
    courierName: "BlueDart",
    courierUrl: "https://www.bluedart.com/tracking",
    fulfillmentStatus: "In Production",
    dispatchDate: Date.now() + 86400000 * 1,
    estimatedDeliveryDate: Date.now() + 86400000 * 3,
    originLocation: "Pune Workshop Hub",
    destinationCity: "Pune (Baner)",
    trackingNotes: "Model currently on Prusa MK4 printer bed. Scheduled for quality check tonight.",
    events: [
      {
        timestamp: Date.now() - 86400000 * 1,
        status: "Production Initiated",
        location: "Workshop Bed #3",
        note: "FDM high-resolution print job started (0.16mm layer height).",
      },
    ],
    updatedAt: Date.now() - 3600000 * 4,
  },
];

const STORAGE_KEY = "newtronlabs_admin_tracking_v1";

class TrackingService implements ITrackingService {
  private records: OrderTrackingRecord[] = INITIAL_DEMO_TRACKING;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.records = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
    } catch {}
  }

  async getAllTrackingRecords(): Promise<OrderTrackingRecord[]> {
    this.loadStorage();
    return [...this.records].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getTrackingByOrderId(orderId: string): Promise<OrderTrackingRecord | null> {
    this.loadStorage();
    return (
      this.records.find(
        (r) => r.orderId.toLowerCase() === orderId.toLowerCase()
      ) || null
    );
  }

  async updateTracking(
    orderId: string,
    updates: Partial<OrderTrackingRecord>
  ): Promise<OrderTrackingRecord | null> {
    this.loadStorage();
    let index = this.records.findIndex(
      (r) => r.orderId.toLowerCase() === orderId.toLowerCase()
    );

    if (index === -1) {
      // Create new record
      const newRec: OrderTrackingRecord = {
        orderId,
        trackingNumber: updates.trackingNumber || `TRK-${Date.now().toString().slice(-8)}`,
        courierName: updates.courierName || "Delhivery",
        fulfillmentStatus: updates.fulfillmentStatus || "Dispatched",
        originLocation: updates.originLocation || "Pune Workshop Hub",
        destinationCity: updates.destinationCity || "Customer Destination",
        events: updates.events || [
          {
            timestamp: Date.now(),
            status: "Fulfillment Started",
            location: "Pune Workshop",
            note: "Order prepared for dispatch.",
          },
        ],
        updatedAt: Date.now(),
        ...updates,
      };
      this.records.push(newRec);
      this.saveStorage();
      return newRec;
    }

    this.records[index] = {
      ...this.records[index],
      ...updates,
      updatedAt: Date.now(),
    };
    this.saveStorage();
    return this.records[index];
  }

  async addTrackingEvent(
    orderId: string,
    event: { status: string; location: string; note: string }
  ): Promise<OrderTrackingRecord | null> {
    this.loadStorage();
    const index = this.records.findIndex(
      (r) => r.orderId.toLowerCase() === orderId.toLowerCase()
    );
    if (index === -1) return null;

    const newEvent = {
      ...event,
      timestamp: Date.now(),
    };
    this.records[index].events.push(newEvent);
    this.records[index].updatedAt = Date.now();
    this.saveStorage();
    return this.records[index];
  }
}

export const trackingService = new TrackingService();
