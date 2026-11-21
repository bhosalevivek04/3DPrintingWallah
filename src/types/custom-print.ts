/**
 * Centralized Type Definitions for Custom 3D Printing Workflow
 * Defines domain models for model files, printing requirements, customer information,
 * submission requests, draft persistence, and future admin/production workflows.
 */

export const SUPPORTED_3D_EXTENSIONS = [".stl", ".obj", ".3mf", ".glb", ".gltf"] as const;
export type Supported3DExtension = (typeof SUPPORTED_3D_EXTENSIONS)[number];

export const MAX_MODEL_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_REFERENCE_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export type PrintTechnology = "resin" | "fdm" | "recommend";

export interface TechnologyOption {
  id: PrintTechnology;
  name: string;
  tagline: string;
  badge?: string;
  description: string;
  bestFor: string;
}

export type PrintingColor =
  | "White"
  | "Black"
  | "Grey"
  | "Custom Color"
  | "Multiple Colors"
  | "Not Sure";

export type SurfaceFinish =
  | "Standard Finish"
  | "Smooth Finish"
  | "High Detail Finish"
  | "Custom Requirement";

export type DimensionsUnit = "mm" | "cm" | "inches";

export interface ModelDimensions {
  useOriginal: boolean;
  width?: number;
  height?: number;
  depth?: number;
  unit: DimensionsUnit;
}

export interface PrintingRequirements {
  technology: PrintTechnology;
  material: string;
  color: PrintingColor;
  customColorDetails?: string;
  surfaceFinish: SurfaceFinish;
  customFinishDetails?: string;
  quantity: number;
  dimensions: ModelDimensions;
  additionalNotes?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  city?: string;
  pincode?: string;
  additionalNotes?: string;
  consentGiven: boolean;
}

export interface UploadedModelMetadata {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
  extension: Supported3DExtension | string;
  mimeType: string;
  storageKey?: string;
  uploadedAt: number;
  blob?: Blob; // Available client-side in browser session
}

export interface ReferenceImageMetadata {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
  dataUrl?: string;
}

export type CustomPrintRequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "quotation_prepared"
  | "quotation_sent"
  | "requires_info"
  | "accepted"
  | "approved"
  | "in_production"
  | "completed"
  | "rejected"
  | "cancelled";

export type CustomPrintStatus = CustomPrintRequestStatus;

export interface CustomPrintSubmissionPayload {
  modelFile: Omit<UploadedModelMetadata, "blob">;
  referenceImages?: Omit<ReferenceImageMetadata, "dataUrl">[];
  requirements: PrintingRequirements;
  customer: CustomerInfo;
}

export interface CustomPrintRequest {
  id: string; // e.g. "NWL-REQ-20261121-8492"
  referenceId: string;
  status: CustomPrintRequestStatus;
  modelFile: Omit<UploadedModelMetadata, "blob">;
  referenceImages?: Omit<ReferenceImageMetadata, "dataUrl">[];
  requirements: PrintingRequirements;
  customer: CustomerInfo;
  createdAt: number;
  updatedAt: number;
  estimatedQuotationHours?: number;
}

export interface SubmissionResponse {
  success: boolean;
  referenceId?: string;
  message: string;
  request?: CustomPrintRequest;
  error?: string;
}

/**
 * Admin view interfaces for future quotation and order management
 */
export interface AdminCustomPrintRequest extends CustomPrintRequest {
  adminNotes?: string[];
  quotation?: {
    estimatedCostINR?: number;
    estimatedProductionDays?: number;
    suggestedTechnology?: PrintTechnology;
    preparedBy?: string;
    preparedAt?: number;
    quoteValidUntil?: number;
  };
  storageDownloadUrl?: string;
}

/**
 * Cloudflare R2 / S3 Object Storage Configuration Interface
 */
export interface R2StorageConfig {
  bucketName: string;
  accountId: string;
  publicUrlDomain?: string;
  presignedUrlTtlSeconds: number; // default: 900 (15 min)
}
