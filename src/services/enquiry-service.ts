import { ContactEnquiry, EnquiryStatus } from "@/types/admin";

export interface CreateEnquiryDTO {
  customerName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface IEnquiryService {
  getAllEnquiries(): Promise<ContactEnquiry[]>;
  getEnquiryById(id: string): Promise<ContactEnquiry | null>;
  createEnquiry(payload: CreateEnquiryDTO): Promise<ContactEnquiry>;
  updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    replyNote?: string
  ): Promise<ContactEnquiry | null>;
  deleteEnquiry(id: string): Promise<boolean>;
}

export const INITIAL_DEMO_ENQUIRIES: ContactEnquiry[] = [
  {
    id: "enq-001",
    customerName: "Aakash Mehta",
    email: "aakash.m@archistudio.in",
    phone: "+91 98201 55432",
    subject: "Bulk Order: 50 Custom Geometric Planters for Corporate Gifting",
    message:
      "Hello NewtronLabs team. We are planning corporate Diwali gifts for our clients and love your Ribbed Geometric Planter design. Can you do a batch of 50 units with custom debossed company logos on the base? What is your bulk turnaround time and tier pricing?",
    status: "New",
    submittedAt: Date.now() - 3600000 * 4,
  },
  {
    id: "enq-002",
    customerName: "Deepak Choudhary",
    email: "deepak.c@autodesign.org",
    phone: "+91 97665 11223",
    subject: "Material suitability for under-hood automotive bracket",
    message:
      "Hi, I need a replacement air intake sensor bracket printed for an off-road buggy. Standard PLA will warp under the 80°C engine bay heat. Do you have Carbon Fiber Nylon (PA-CF) or Polycarbonate (PC) capability?",
    status: "In Progress",
    submittedAt: Date.now() - 86400000 * 1.5,
    internalReplyNote: "Informed customer that we have PETG-CF and PC filament available. Quoted ₹1,200 for high-temp bake post-cure.",
  },
  {
    id: "enq-003",
    customerName: "Radhika Sen",
    email: "radhika.sen@schoolstem.edu",
    phone: "+91 98300 44556",
    subject: "STEM Workshop Model Demo Kits for High School Students",
    message:
      "We want to purchase 15 low-poly animal kits along with sample infill cross-sections (gyroid, honeycomb, cubic) for educational demonstration in our robotics lab. Do you offer an educational institution discount?",
    status: "Resolved",
    submittedAt: Date.now() - 86400000 * 6,
    internalReplyNote: "Provided 15% educational discount code and included free 3D infill visualizer cubes in their parcel.",
    resolvedAt: Date.now() - 86400000 * 4,
  },
];

const STORAGE_KEY = "newtronlabs_admin_enquiries_v1";

class EnquiryService implements IEnquiryService {
  private enquiries: ContactEnquiry[] = INITIAL_DEMO_ENQUIRIES;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.enquiries = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.enquiries));
    } catch {}
  }

  async getAllEnquiries(): Promise<ContactEnquiry[]> {
    this.loadStorage();
    return [...this.enquiries].sort((a, b) => b.submittedAt - a.submittedAt);
  }

  async getEnquiryById(id: string): Promise<ContactEnquiry | null> {
    this.loadStorage();
    return this.enquiries.find((e) => e.id === id) || null;
  }

  async createEnquiry(payload: CreateEnquiryDTO): Promise<ContactEnquiry> {
    this.loadStorage();
    const newEnquiry: ContactEnquiry = {
      id: `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      customerName: payload.customerName,
      email: payload.email,
      phone: payload.phone || "",
      subject: payload.subject,
      message: payload.message,
      status: "New",
      submittedAt: Date.now(),
    };
    this.enquiries.unshift(newEnquiry);
    this.saveStorage();
    return newEnquiry;
  }

  async updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    replyNote?: string
  ): Promise<ContactEnquiry | null> {
    this.loadStorage();
    const index = this.enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.enquiries[index] = {
      ...this.enquiries[index],
      status,
      internalReplyNote: replyNote !== undefined ? replyNote : this.enquiries[index].internalReplyNote,
      resolvedAt: status === "Resolved" ? Date.now() : this.enquiries[index].resolvedAt,
    };
    this.saveStorage();
    return this.enquiries[index];
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    this.loadStorage();
    const prev = this.enquiries.length;
    this.enquiries = this.enquiries.filter((e) => e.id !== id);
    this.saveStorage();
    return this.enquiries.length < prev;
  }
}

export const enquiryService = new EnquiryService();
