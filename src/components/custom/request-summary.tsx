"use client";

import React from "react";
import {
  UploadedModelMetadata,
  PrintingRequirements,
  CustomerInfo,
  ReferenceImageMetadata,
} from "@/types/custom-print";
import {
  Box,
  Cpu,
  Layers,
  Palette,
  Sparkles,
  Maximize2,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  Send,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";

interface RequestSummaryProps {
  modelFile: UploadedModelMetadata;
  referenceImages: ReferenceImageMetadata[];
  requirements: PrintingRequirements;
  customer: CustomerInfo;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
  submissionError: string | null;
  draftSavedToast: boolean;
}

export function RequestSummary({
  modelFile,
  referenceImages,
  requirements,
  customer,
  onEditStep,
  onSubmit,
  onSaveDraft,
  isSubmitting,
  submissionError,
  draftSavedToast,
}: RequestSummaryProps) {
  const techName =
    requirements.technology === "resin"
      ? "Resin Printing (SLA/MSLA)"
      : requirements.technology === "fdm"
      ? "FDM Printing"
      : "Not Sure — Recommend Best Option";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-[var(--foreground)]">
          Review Your Printing Request
        </h3>
        <p className="text-xs text-[var(--muted-foreground)]">
          Please verify your specifications and contact information before submitting. Our engineers will prepare an itemized quotation based on this request.
        </p>
      </div>

      {/* Grid: 3 summary cards */}
      <div className="flex flex-col gap-4">
        {/* Card 1: 3D Model File */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-[var(--primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Uploaded 3D Model
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="h-3 w-3" /> Edit
            </button>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-[var(--foreground)] truncate max-w-xs">
              {modelFile.name}
            </span>
            <span className="text-stone-500 font-mono text-xs">
              {modelFile.formattedSize} • {modelFile.extension.toUpperCase()}
            </span>
          </div>

          {referenceImages.length > 0 && (
            <div className="mt-2 text-xs text-[var(--muted-foreground)]">
              Reference images attached: {referenceImages.map((i) => i.name).join(", ")}
            </div>
          )}
        </div>

        {/* Card 2: Printing Preferences */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[var(--primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Printing Specifications
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="h-3 w-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs sm:text-sm">
            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Technology:</span>
              <strong className="font-semibold text-[var(--foreground)]">{techName}</strong>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Material:</span>
              <strong className="font-semibold text-[var(--foreground)]">{requirements.material}</strong>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Color:</span>
              <strong className="font-semibold text-[var(--foreground)]">
                {requirements.color}
                {requirements.customColorDetails ? ` (${requirements.customColorDetails})` : ""}
              </strong>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Finish:</span>
              <strong className="font-semibold text-[var(--foreground)]">{requirements.surfaceFinish}</strong>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Dimensions:</span>
              <strong className="font-semibold text-[var(--foreground)]">
                {requirements.dimensions.useOriginal
                  ? "Original 3D Model Scale"
                  : `${requirements.dimensions.width || "?"} × ${requirements.dimensions.height || "?"} × ${
                      requirements.dimensions.depth || "?"
                    } ${requirements.dimensions.unit}`}
              </strong>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Quantity:</span>
              <strong className="font-semibold text-[var(--foreground)]">
                {requirements.quantity} {requirements.quantity === 1 ? "unit" : "units"}
              </strong>
            </div>
          </div>

          {requirements.additionalNotes && (
            <div className="mt-3 pt-3 border-t border-stone-100 text-xs">
              <span className="text-[var(--muted-foreground)] block">Special Requirements:</span>
              <p className="text-[var(--foreground)] mt-0.5 italic">
                &ldquo;{requirements.additionalNotes}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Card 3: Customer Details */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Contact & Delivery
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="h-3 w-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs sm:text-sm">
            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Name:</span>
              <strong className="font-semibold text-[var(--foreground)]">{customer.fullName}</strong>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Email:</span>
              <strong className="font-semibold text-[var(--foreground)]">{customer.email}</strong>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block text-xs">Phone:</span>
              <strong className="font-semibold text-[var(--foreground)]">{customer.phone}</strong>
            </div>

            {customer.city && (
              <div>
                <span className="text-[var(--muted-foreground)] block text-xs">Delivery Location:</span>
                <strong className="font-semibold text-[var(--foreground)]">
                  {customer.city} {customer.pincode ? `(${customer.pincode})` : ""}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quotation Scope Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
        <FileText className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Quotation Request Notice:</strong> Submitting this form requests an official engineering review and quotation. No payment is charged today. You will receive an itemized quote with material weight, print hours, and dispatch timelines within 24 hours.
        </p>
      </div>

      {/* Submission Error Banner */}
      {submissionError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold">Submission failed: </strong>
            <span>{submissionError}</span>
          </div>
        </div>
      )}

      {/* Draft Saved Toast Notice */}
      {draftSavedToast && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          ✔ Draft saved locally! You can safely close or refresh your browser.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onSaveDraft}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-[var(--border)] bg-white hover:bg-stone-50 text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
        >
          <Save className="h-4 w-4 text-stone-500" />
          <span>Save as Draft</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating Quotation Request...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Printing Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
