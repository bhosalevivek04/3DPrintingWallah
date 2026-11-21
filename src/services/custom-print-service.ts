import {
  CustomPrintRequest,
  CustomPrintSubmissionPayload,
  CustomPrintStatus,
} from "@/types/custom-print";

export interface ICustomPrintService {
  submitRequest(payload: CustomPrintSubmissionPayload): Promise<CustomPrintRequest>;
  getRequestById(referenceId: string): Promise<CustomPrintRequest | null>;
  getAllRequests(): Promise<CustomPrintRequest[]>;
  updateRequestStatus(
    referenceId: string,
    status: CustomPrintStatus,
    adminNote?: string
  ): Promise<CustomPrintRequest | null>;
  addInternalNote(referenceId: string, note: string): Promise<CustomPrintRequest | null>;
  deleteRequest(referenceId: string): Promise<boolean>;
}

export const INITIAL_DEMO_CUSTOM_PRINTS: CustomPrintRequest[] = [
  {
    id: "NWL-CP-20261120-9182",
    referenceId: "NWL-CP-20261120-9182",
    status: "under_review",
    modelFile: {
      id: "demo-stl-01",
      name: "drone_chassis_strut_v3.stl",
      extension: ".stl",
      mimeType: "model/stl",
      size: 18454912,
      formattedSize: "17.60 MB",
      uploadedAt: Date.now() - 86400000 * 1,
    },
    requirements: {
      technology: "fdm",
      material: "Carbon-Fiber Reinforced PETG",
      color: "Black",
      surfaceFinish: "High Detail Finish",
      quantity: 2,
      dimensions: {
        useOriginal: false,
        width: 140,
        height: 65,
        depth: 35,
        unit: "mm",
      },
      additionalNotes:
        "High impact stress landing gear strut. Must maintain dimensional tolerance of ±0.2mm on mounting holes.",
    },
    customer: {
      fullName: "Vikram Rathore",
      email: "vikram.r@drone-prototypes.in",
      phone: "+91 98220 88776",
      company: "AeroDrone Mechanics",
      city: "Bengaluru",
      pincode: "560066",
      consentGiven: true,
      additionalNotes: "Delivery needed before robotics conference on Dec 10th.",
    },
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000 * 5,
    estimatedQuotationHours: 24,
  },
  {
    id: "NWL-CP-20261115-4421",
    referenceId: "NWL-CP-20261115-4421",
    status: "quotation_sent",
    modelFile: {
      id: "demo-stl-02",
      name: "microfluidic_channel_chamber.step",
      extension: ".stl",
      mimeType: "application/octet-stream",
      size: 9410290,
      formattedSize: "8.97 MB",
      uploadedAt: Date.now() - 86400000 * 5,
    },
    requirements: {
      technology: "resin",
      material: "Biocompatible High-Clear Resin (8K)",
      color: "Custom Color",
      customColorDetails: "Optically clear translucent",
      surfaceFinish: "Smooth Finish",
      quantity: 4,
      dimensions: {
        useOriginal: true,
        unit: "mm",
      },
      additionalNotes: "Fine micro-channels (0.4mm diameter) must remain completely clear of resin cured blockages.",
    },
    customer: {
      fullName: "Dr. Sandeep Banerjee",
      email: "sandeep.b@medtech-labs.in",
      phone: "+91 98112 34567",
      company: "BioMed Prototype Solutions",
      city: "Kolkata",
      pincode: "700091",
      consentGiven: true,
    },
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 3,
    estimatedQuotationHours: 24,
  },
  {
    id: "NWL-CP-20261121-1004",
    referenceId: "NWL-CP-20261121-1004",
    status: "submitted",
    modelFile: {
      id: "demo-stl-03",
      name: "architectural_facade_1to50.obj",
      extension: ".obj",
      mimeType: "model/obj",
      size: 32194812,
      formattedSize: "30.70 MB",
      uploadedAt: Date.now() - 3600000 * 2,
    },
    requirements: {
      technology: "recommend",
      material: "Architectural Matte White PLA",
      color: "White",
      surfaceFinish: "Standard Finish",
      quantity: 1,
      dimensions: {
        useOriginal: true,
        unit: "cm",
      },
      additionalNotes: "Model for university master thesis presentation. Please advise on best orientation to reduce supports.",
    },
    customer: {
      fullName: "Pooja Hegde",
      email: "pooja.hegde@arch.edu.in",
      phone: "+91 97661 23456",
      city: "Pune",
      pincode: "411007",
      consentGiven: true,
    },
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
    estimatedQuotationHours: 24,
  },
];

const STORAGE_KEY = "newtronlabs_admin_custom_prints_v1";

class MockCustomPrintService implements ICustomPrintService {
  private requests: CustomPrintRequest[] = INITIAL_DEMO_CUSTOM_PRINTS;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.requests = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.requests));
    } catch {}
  }

  async submitRequest(payload: CustomPrintSubmissionPayload): Promise<CustomPrintRequest> {
    this.loadStorage();
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const referenceId = `NWL-CP-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq: CustomPrintRequest = {
      id: referenceId,
      referenceId,
      status: "submitted",
      modelFile: payload.modelFile,
      requirements: payload.requirements,
      customer: payload.customer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      estimatedQuotationHours: 24,
    };

    this.requests.unshift(newReq);
    this.saveStorage();
    return newReq;
  }

  async getRequestById(referenceId: string): Promise<CustomPrintRequest | null> {
    this.loadStorage();
    const found = this.requests.find(
      (r) => r.referenceId.toUpperCase().trim() === referenceId.toUpperCase().trim()
    );
    return found ? { ...found } : null;
  }

  async getAllRequests(): Promise<CustomPrintRequest[]> {
    this.loadStorage();
    return [...this.requests].sort((a, b) => b.createdAt - a.createdAt);
  }

  async updateRequestStatus(
    referenceId: string,
    status: CustomPrintStatus,
    adminNote?: string
  ): Promise<CustomPrintRequest | null> {
    this.loadStorage();
    const index = this.requests.findIndex(
      (r) => r.referenceId.toUpperCase().trim() === referenceId.toUpperCase().trim()
    );
    if (index === -1) return null;

    const current = this.requests[index];
    const updated: CustomPrintRequest = {
      ...current,
      status,
      updatedAt: Date.now(),
    };

    if (adminNote) {
      updated.customer = {
        ...updated.customer,
        additionalNotes: updated.customer.additionalNotes
          ? `${updated.customer.additionalNotes}\n[Admin Note]: ${adminNote}`
          : `[Admin Note]: ${adminNote}`,
      };
    }

    this.requests[index] = updated;
    this.saveStorage();
    return updated;
  }

  async addInternalNote(referenceId: string, note: string): Promise<CustomPrintRequest | null> {
    return this.updateRequestStatus(
      referenceId,
      this.requests.find((r) => r.referenceId === referenceId)?.status || "under_review",
      note
    );
  }

  async deleteRequest(referenceId: string): Promise<boolean> {
    this.loadStorage();
    const prev = this.requests.length;
    this.requests = this.requests.filter(
      (r) => r.referenceId.toUpperCase().trim() !== referenceId.toUpperCase().trim()
    );
    this.saveStorage();
    return this.requests.length < prev;
  }
}

export const customPrintService = new MockCustomPrintService();
