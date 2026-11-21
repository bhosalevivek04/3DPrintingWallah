import {
  OrderRequest,
  CreateOrderRequestPayload,
  OrderRequestStatus,
  PaymentStatus,
  StatusTimelineEvent,
  InternalAdminNote,
} from "@/types/order";

export interface IOrderService {
  createOrderRequest(payload: CreateOrderRequestPayload): Promise<OrderRequest>;
  getOrderById(orderId: string): Promise<OrderRequest | null>;
  getOrdersByEmail(email: string): Promise<OrderRequest[]>;
  getAllOrders(): Promise<OrderRequest[]>;
  updateOrderStatus(
    orderId: string,
    status: OrderRequestStatus,
    note?: string,
    updatedBy?: string
  ): Promise<OrderRequest | null>;
  updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    note?: string
  ): Promise<OrderRequest | null>;
  addInternalNote(
    orderId: string,
    content: string,
    author?: string
  ): Promise<OrderRequest | null>;
  deleteOrder(orderId: string): Promise<boolean>;
}

// Pre-populated demo order requests testing the full 12-status lifecycle
export const INITIAL_DEMO_ORDERS: OrderRequest[] = [
  {
    orderId: "NWL-ORD-20261121-7104",
    status: "Request Submitted",
    paymentStatus: "Unpaid",
    customer: {
      fullName: "Priya Nair",
      email: "priya.nair@example.com",
      phone: "+91 98765 43210",
      company: "Design Craft Studio",
      deliveryAddress: "12, 1st Cross, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560038",
      preferredContactMethod: "email",
      instructions: "High resolution finish preferred for exhibition display.",
    },
    items: [
      {
        productId: "modular-desk-tray",
        slug: "modular-desk-tray",
        name: "Modular Desk Organiser Tray",
        category: "Desk Accessories",
        image: "/images/product-desk-tray.webp",
        unitPrice: 449,
        priceDisplay: "₹449",
        quantity: 1,
        availability: "low_stock",
        maxAllowedQuantity: 4,
        selectedColor: "Sandstone Sand",
      },
    ],
    totalQuantity: 1,
    estimatedSubtotal: 449,
    shippingFee: 80,
    grandTotal: 529,
    paymentPolicyNote: "No online payment charged. Team reviewing filament batch.",
    createdAt: Date.now() - 3600000 * 3, // 3 hours ago
    updatedAt: Date.now() - 3600000 * 3,
    estimatedReviewHours: 24,
    statusHistory: [
      {
        status: "Request Submitted",
        timestamp: Date.now() - 3600000 * 3,
        note: "Customer submitted order enquiry via checkout portal.",
        updatedBy: "Customer (Web)",
      },
    ],
    internalNotes: [
      {
        id: "note-1",
        author: "Workshop Lead",
        content: "Customer requested layer height under 0.16mm. Filament inventory checked: Sandstone PLA available.",
        createdAt: Date.now() - 3600000 * 2,
      },
    ],
    quotationId: "NWL-QTN-202611-001",
  },
  {
    orderId: "NWL-ORD-20261120-4821",
    status: "Processing / In Production",
    paymentStatus: "Payment Confirmed",
    customer: {
      fullName: "Arjun Verma",
      email: "arjun.verma@example.com",
      phone: "+91 98230 14589",
      deliveryAddress: "Flat 402, Sunshine Heights, Baner Road",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411045",
      preferredContactMethod: "whatsapp",
      instructions: "Please pack with extra bubble wrap for fragile ribbed edge.",
    },
    items: [
      {
        productId: "ribbed-planter",
        slug: "ribbed-planter",
        name: "Ribbed Geometric Planter",
        category: "Planters",
        image: "/images/product-ribbed-planter.webp",
        unitPrice: 599,
        priceDisplay: "₹599",
        quantity: 2,
        availability: "in_stock",
        maxAllowedQuantity: 25,
        selectedColor: "Cobalt Blue",
      },
    ],
    totalQuantity: 2,
    estimatedSubtotal: 1198,
    shippingFee: 0,
    grandTotal: 1198,
    paymentPolicyNote: "Zero online payment collected at checkout. Payment verified via UPI.",
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    updatedAt: Date.now() - 3600000 * 4,
    estimatedReviewHours: 24,
    trackingNumber: "BLU771029831",
    courierName: "BlueDart",
    statusHistory: [
      {
        status: "Request Submitted",
        timestamp: Date.now() - 86400000 * 2,
        note: "Initial request received.",
        updatedBy: "Customer (Web)",
      },
      {
        status: "Under Review",
        timestamp: Date.now() - 86400000 * 1.8,
        note: "Model specifications and color batch approved.",
        updatedBy: "Lead Technician",
      },
      {
        status: "Payment Confirmed",
        timestamp: Date.now() - 86400000 * 1.5,
        note: "Verified UPI transaction reference: UPI/20261120/4821.",
        updatedBy: "Workshop Billing",
      },
      {
        status: "Processing / In Production",
        timestamp: Date.now() - 3600000 * 4,
        note: "Sent to 3D printer bed #3. ETA completion: 6 hours.",
        updatedBy: "Print Operator",
      },
    ],
    internalNotes: [
      {
        id: "note-2",
        author: "Tech Support",
        content: "Customer confirmed WhatsApp preview of the cobalt blue swatch.",
        createdAt: Date.now() - 86400000 * 1.6,
      },
    ],
  },
  {
    orderId: "NWL-ORD-20261118-2991",
    status: "Shipped",
    paymentStatus: "Payment Confirmed",
    customer: {
      fullName: "Rohan Kulkarni",
      email: "rohan.kulkarni@example.com",
      phone: "+91 99887 76655",
      deliveryAddress: "7A, Green Valley Colony, Kothrud",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411038",
      preferredContactMethod: "whatsapp",
    },
    items: [
      {
        productId: "everyday-cable-clips",
        slug: "everyday-cable-clips",
        name: "Everyday Desk Cable Clips (Set of 4)",
        category: "Desk Accessories",
        image: "/images/product-cable-clips.webp",
        unitPrice: 299,
        priceDisplay: "₹299",
        quantity: 2,
        availability: "in_stock",
        maxAllowedQuantity: 30,
        selectedColor: "Matte Black",
      },
    ],
    totalQuantity: 2,
    estimatedSubtotal: 598,
    shippingFee: 60,
    grandTotal: 658,
    paymentPolicyNote: "Dispatched with Delhivery tracking. Payment settled.",
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 3600000 * 12,
    estimatedReviewHours: 24,
    trackingNumber: "DEL4891029318",
    courierName: "Delhivery",
    dispatchDate: Date.now() - 86400000 * 2,
    estimatedDeliveryDate: Date.now() + 86400000 * 1,
    statusHistory: [
      {
        status: "Request Submitted",
        timestamp: Date.now() - 86400000 * 4,
        note: "Order enquiry submitted.",
        updatedBy: "Customer (Web)",
      },
      {
        status: "Payment Confirmed",
        timestamp: Date.now() - 86400000 * 3.5,
        note: "Payment settled via Google Pay.",
        updatedBy: "Billing",
      },
      {
        status: "Quality Check",
        timestamp: Date.now() - 86400000 * 2.2,
        note: "All clips tested for 4mm - 6mm cable grip tension.",
        updatedBy: "QA Inspector",
      },
      {
        status: "Ready for Dispatch",
        timestamp: Date.now() - 86400000 * 2.1,
        note: "Packed in cardboard box with invoice slip.",
        updatedBy: "Dispatch Team",
      },
      {
        status: "Shipped",
        timestamp: Date.now() - 86400000 * 2,
        note: "Handed to Delhivery associate. Tracking: DEL4891029318.",
        updatedBy: "Dispatch Team",
      },
    ],
  },
  {
    orderId: "NWL-ORD-20261114-5541",
    status: "Delivered",
    paymentStatus: "Payment Confirmed",
    customer: {
      fullName: "Ananya Deshmukh",
      email: "ananya.d@creativespace.org",
      phone: "+91 97654 12389",
      deliveryAddress: "45, Prabhat Road, Lane 9",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411004",
      preferredContactMethod: "phone",
    },
    items: [
      {
        productId: "voronoi-lamp",
        slug: "voronoi-lamp",
        name: "Organic Voronoi Mood Lamp",
        category: "Home Decor",
        image: "/images/product-voronoi-lamp.webp",
        unitPrice: 1299,
        priceDisplay: "₹1,299",
        quantity: 1,
        availability: "in_stock",
        maxAllowedQuantity: 6,
        selectedColor: "Warm Cream",
      },
    ],
    totalQuantity: 1,
    estimatedSubtotal: 1299,
    shippingFee: 0,
    grandTotal: 1299,
    paymentPolicyNote: "Delivered via express courier. Satisfied customer.",
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 4,
    estimatedReviewHours: 24,
    trackingNumber: "DEL9928172635",
    courierName: "Delhivery",
    dispatchDate: Date.now() - 86400000 * 5,
    estimatedDeliveryDate: Date.now() - 86400000 * 4,
    statusHistory: [
      {
        status: "Request Submitted",
        timestamp: Date.now() - 86400000 * 7,
        note: "Customer inquiry received.",
        updatedBy: "Customer (Web)",
      },
      {
        status: "Delivered",
        timestamp: Date.now() - 86400000 * 4,
        note: "Delivered and signed by customer.",
        updatedBy: "Courier Webhook",
      },
    ],
  },
];

const STORAGE_KEY = "newtronlabs_admin_orders_v1";

class MockOrderService implements IOrderService {
  private orders: OrderRequest[] = INITIAL_DEMO_ORDERS;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.orders = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders));
    } catch {}
  }

  async createOrderRequest(payload: CreateOrderRequestPayload): Promise<OrderRequest> {
    this.loadStorage();
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const orderId = `NWL-ORD-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: OrderRequest = {
      orderId,
      status: "Request Submitted",
      paymentStatus: "Unpaid",
      customer: payload.customer,
      items: payload.items.map((i) => ({
        productId: i.productId,
        slug: i.productId,
        name: `Product (${i.productId})`,
        category: "Custom Creations",
        image: "/images/hero-workshop.webp",
        unitPrice: 599,
        priceDisplay: "₹599",
        quantity: i.quantity,
        availability: "in_stock",
        maxAllowedQuantity: 10,
        selectedColor: i.selectedColor || "Standard Finish",
      })),
      totalQuantity: payload.items.reduce((s, i) => s + i.quantity, 0),
      estimatedSubtotal: payload.items.reduce((s, i) => s + i.quantity * 599, 0),
      paymentPolicyNote: "No online payment charged at checkout. Team will verify before payment.",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      estimatedReviewHours: 24,
      statusHistory: [
        {
          status: "Request Submitted",
          timestamp: Date.now(),
          note: "Customer submitted order enquiry via web storefront.",
          updatedBy: "Customer (Web)",
        },
      ],
      internalNotes: [],
    };

    this.orders.unshift(newOrder);
    this.saveStorage();
    return newOrder;
  }

  async getOrderById(orderId: string): Promise<OrderRequest | null> {
    this.loadStorage();
    const found = this.orders.find(
      (ord) => ord.orderId.toUpperCase().trim() === orderId.toUpperCase().trim()
    );
    return found ? { ...found } : null;
  }

  async getOrdersByEmail(email: string): Promise<OrderRequest[]> {
    this.loadStorage();
    const clean = email.toLowerCase().trim();
    return this.orders.filter((ord) => ord.customer.email.toLowerCase() === clean);
  }

  async getAllOrders(): Promise<OrderRequest[]> {
    this.loadStorage();
    return [...this.orders].sort((a, b) => b.createdAt - a.createdAt);
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderRequestStatus,
    note?: string,
    updatedBy?: string
  ): Promise<OrderRequest | null> {
    this.loadStorage();
    const index = this.orders.findIndex(
      (o) => o.orderId.toUpperCase().trim() === orderId.toUpperCase().trim()
    );
    if (index === -1) return null;

    const current = this.orders[index];
    const newHistoryEvent: StatusTimelineEvent = {
      status,
      timestamp: Date.now(),
      note: note || `Status updated to ${status}.`,
      updatedBy: updatedBy || "Admin Staff",
    };

    const updated: OrderRequest = {
      ...current,
      status,
      updatedAt: Date.now(),
      statusHistory: [...(current.statusHistory || []), newHistoryEvent],
    };

    this.orders[index] = updated;
    this.saveStorage();
    return updated;
  }

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    note?: string
  ): Promise<OrderRequest | null> {
    this.loadStorage();
    const index = this.orders.findIndex(
      (o) => o.orderId.toUpperCase().trim() === orderId.toUpperCase().trim()
    );
    if (index === -1) return null;

    const current = this.orders[index];
    const updated: OrderRequest = {
      ...current,
      paymentStatus,
      updatedAt: Date.now(),
    };

    if (note) {
      updated.internalNotes = [
        ...(current.internalNotes || []),
        {
          id: `note-${Date.now()}`,
          author: "Billing Admin",
          content: `Payment status updated to ${paymentStatus}: ${note}`,
          createdAt: Date.now(),
        },
      ];
    }

    this.orders[index] = updated;
    this.saveStorage();
    return updated;
  }

  async addInternalNote(
    orderId: string,
    content: string,
    author: string = "Admin Staff"
  ): Promise<OrderRequest | null> {
    this.loadStorage();
    const index = this.orders.findIndex(
      (o) => o.orderId.toUpperCase().trim() === orderId.toUpperCase().trim()
    );
    if (index === -1) return null;

    const current = this.orders[index];
    const newNote: InternalAdminNote = {
      id: `note-${Date.now()}`,
      author,
      content,
      createdAt: Date.now(),
    };

    const updated: OrderRequest = {
      ...current,
      internalNotes: [...(current.internalNotes || []), newNote],
      updatedAt: Date.now(),
    };

    this.orders[index] = updated;
    this.saveStorage();
    return updated;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    this.loadStorage();
    const prev = this.orders.length;
    this.orders = this.orders.filter(
      (o) => o.orderId.toUpperCase().trim() !== orderId.toUpperCase().trim()
    );
    this.saveStorage();
    return this.orders.length < prev;
  }
}

export const orderService = new MockOrderService();
