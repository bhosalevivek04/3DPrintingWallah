import { AdminCustomer } from "@/types/admin";

export interface ICustomerService {
  getAllCustomers(): Promise<AdminCustomer[]>;
  getCustomerById(id: string): Promise<AdminCustomer | null>;
  updateCustomerNotes(id: string, notes: string): Promise<AdminCustomer | null>;
  searchCustomers(query: string): Promise<AdminCustomer[]>;
}

export const INITIAL_DEMO_CUSTOMERS: AdminCustomer[] = [
  {
    id: "cust-001",
    name: "Arjun Verma",
    email: "arjun.verma@example.com",
    phone: "+91 98230 14589",
    company: "Verma Studio Tech",
    deliveryAddress: "Flat 402, Sunshine Heights, Baner Road",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411045",
    orderCount: 3,
    totalConfirmedValue: 4850,
    customPrintCount: 1,
    recentOrderIds: ["NWL-ORD-20261120-4821", "NWL-ORD-20261015-1192"],
    internalNotes: "Prefers Cobalt Blue items. Always requests extra bubble wrap on fragile ribbed edges.",
    createdAt: Date.now() - 86400000 * 60,
    lastActiveAt: Date.now() - 86400000 * 1,
  },
  {
    id: "cust-002",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98765 43210",
    company: "Design Craft Studio",
    deliveryAddress: "12, 1st Cross, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560038",
    orderCount: 2,
    totalConfirmedValue: 3120,
    customPrintCount: 2,
    recentOrderIds: ["NWL-ORD-20261121-7104"],
    internalNotes: "Architectural designer. Very particular about layer line visual quality (under 0.16mm preferred).",
    createdAt: Date.now() - 86400000 * 45,
    lastActiveAt: Date.now() - 3600000 * 3,
  },
  {
    id: "cust-003",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@example.com",
    phone: "+91 99887 76655",
    deliveryAddress: "7A, Green Valley Colony, Kothrud",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411038",
    orderCount: 1,
    totalConfirmedValue: 1299,
    customPrintCount: 0,
    recentOrderIds: ["NWL-ORD-20261118-2991"],
    internalNotes: "Local pick-up/express delivery customer.",
    createdAt: Date.now() - 86400000 * 15,
    lastActiveAt: Date.now() - 86400000 * 3,
  },
  {
    id: "cust-004",
    name: "Dr. Sandeep Banerjee",
    email: "sandeep.b@medtech-labs.in",
    phone: "+91 98112 34567",
    company: "BioMed Prototype Solutions",
    deliveryAddress: "Sector V, Salt Lake, Bidhannagar",
    city: "Kolkata",
    state: "West Bengal",
    pinCode: "700091",
    orderCount: 4,
    totalConfirmedValue: 18450,
    customPrintCount: 3,
    recentOrderIds: ["NWL-ORD-20261105-9012"],
    internalNotes: "High-value custom biomedical prototype account. Needs GST invoices and resin precision prints.",
    createdAt: Date.now() - 86400000 * 90,
    lastActiveAt: Date.now() - 86400000 * 5,
  },
  {
    id: "cust-005",
    name: "Ananya Deshmukh",
    email: "ananya.d@creativespace.org",
    phone: "+91 97654 12389",
    company: "Atelier Deshmukh",
    deliveryAddress: "45, Prabhat Road, Lane 9",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411004",
    orderCount: 2,
    totalConfirmedValue: 2400,
    customPrintCount: 1,
    recentOrderIds: ["NWL-ORD-20261114-5541"],
    internalNotes: "Sculptor collaborating on limited edition Voronoi desk lamps.",
    createdAt: Date.now() - 86400000 * 35,
    lastActiveAt: Date.now() - 86400000 * 7,
  },
];

const STORAGE_KEY = "newtronlabs_admin_customers_v1";

class CustomerService implements ICustomerService {
  private customers: AdminCustomer[] = INITIAL_DEMO_CUSTOMERS;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.customers = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customers));
    } catch {}
  }

  async getAllCustomers(): Promise<AdminCustomer[]> {
    this.loadStorage();
    return [...this.customers].sort((a, b) => b.lastActiveAt - a.lastActiveAt);
  }

  async getCustomerById(id: string): Promise<AdminCustomer | null> {
    this.loadStorage();
    return this.customers.find((c) => c.id === id) || null;
  }

  async updateCustomerNotes(id: string, notes: string): Promise<AdminCustomer | null> {
    this.loadStorage();
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.customers[index] = {
      ...this.customers[index],
      internalNotes: notes,
      lastActiveAt: Date.now(),
    };
    this.saveStorage();
    return this.customers[index];
  }

  async searchCustomers(query: string): Promise<AdminCustomer[]> {
    this.loadStorage();
    const q = query.toLowerCase().trim();
    if (!q) return this.customers;
    return this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q))
    );
  }
}

export const customerService = new CustomerService();
