/**
 * Local Draft & Session Storage Service for Custom 3D Printing Requests
 * Stores in-progress request configurations in browser localStorage and
 * ties them with binary blobs stored in IndexedDB.
 */

import {
  PrintingRequirements,
  CustomerInfo,
  UploadedModelMetadata,
} from "@/types/custom-print";

const DRAFT_STORAGE_KEY = "newtronlabs_custom_print_draft_v1";

export interface CustomPrintDraft {
  modelFile: UploadedModelMetadata | null;
  requirements: PrintingRequirements;
  customer: CustomerInfo;
  activeStep: number;
  updatedAt: number;
}

export const DEFAULT_REQUIREMENTS: PrintingRequirements = {
  technology: "recommend",
  material: "Standard Workshop Recommendation",
  color: "Grey",
  surfaceFinish: "Standard Finish",
  quantity: 1,
  dimensions: {
    useOriginal: true,
    unit: "mm",
  },
  additionalNotes: "",
};

export const DEFAULT_CUSTOMER: CustomerInfo = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  pincode: "",
  additionalNotes: "",
  consentGiven: false,
};

export function saveDraftToStorage(draft: Partial<CustomPrintDraft>): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadDraftFromStorage();
    const merged: CustomPrintDraft = {
      modelFile: draft.modelFile ?? existing?.modelFile ?? null,
      requirements: draft.requirements ?? existing?.requirements ?? DEFAULT_REQUIREMENTS,
      customer: draft.customer ?? existing?.customer ?? DEFAULT_CUSTOMER,
      activeStep: draft.activeStep ?? existing?.activeStep ?? 1,
      updatedAt: Date.now(),
    };
    // Exclude blob binary before serializing to localStorage
    const serializable = {
      ...merged,
      modelFile: merged.modelFile
        ? {
            id: merged.modelFile.id,
            name: merged.modelFile.name,
            size: merged.modelFile.size,
            formattedSize: merged.modelFile.formattedSize,
            extension: merged.modelFile.extension,
            mimeType: merged.modelFile.mimeType,
            uploadedAt: merged.modelFile.uploadedAt,
          }
        : null,
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.warn("Failed to persist custom print draft:", err);
  }
}

export function loadDraftFromStorage(): CustomPrintDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomPrintDraft;
  } catch (err) {
    console.warn("Failed to read custom print draft:", err);
    return null;
  }
}

export function clearDraftFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear custom print draft:", err);
  }
}
