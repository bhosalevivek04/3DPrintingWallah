"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CustomPrintRequest } from "@/types/custom-print";
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Printer,
  Mail,
  Clock,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface SubmissionConfirmationProps {
  request: CustomPrintRequest;
  onReset: () => void;
}

export function SubmissionConfirmation({ request, onReset }: SubmissionConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in duration-300">
      {/* Top Success Banner */}
      <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-[var(--color-border)] shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)] shadow-2xs mb-4">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-success)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] px-3 py-1 rounded-full mb-2">
          Request Submitted
        </span>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Your custom printing request has been submitted successfully!
        </h3>

        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2 max-w-lg leading-relaxed">
          Our engineering team will review your model and contact you regarding feasibility, pricing and production.
        </p>

        {/* Generated Reference ID Box */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted-foreground)] font-medium">Reference ID:</span>
            <span className="font-mono font-bold text-base text-[var(--primary)] select-all">
              {request.referenceId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-stone-50 text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-stone-500" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Model File Storage State Callout */}
        <div className="mt-4 p-3.5 rounded-xl border border-stone-200 bg-stone-50/80 text-left max-w-lg w-full text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--color-text-primary)]">3D Model File Status:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[var(--color-brand)] border border-blue-200">
              Cached Locally (IndexedDB)
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
            Your file <strong className="font-semibold text-[var(--color-text-primary)]">{request.modelFile.name}</strong> ({request.modelFile.formattedSize}) and printing specifications have been recorded in our workshop queue. The raw file remains cached in your local browser session until cloud object storage (R2/S3) is connected.
          </p>
        </div>
      </div>

      {/* What Happens Next - Timeline */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--primary)]" />
          <span>What Happens Next?</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1.5">
            <span className="font-bold text-xs text-[var(--primary)]">Step 1 • Geometry Slicing</span>
            <strong className="font-semibold text-stone-900">Mesh Inspection</strong>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              We check your 3D mesh for watertightness, wall-thickness, and overhang angles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1.5">
            <span className="font-bold text-xs text-[var(--primary)]">Step 2 • Quotation</span>
            <strong className="font-semibold text-stone-900">Official Pricing</strong>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              You receive an itemized quotation by email at <strong>{request.customer.email}</strong> within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1.5">
            <span className="font-bold text-xs text-[var(--primary)]">Step 3 • Fabrication</span>
            <strong className="font-semibold text-stone-900">Print & Dispatch</strong>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Upon your approval, your parts are scheduled for printing, post-processing, and dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Recap Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-stone-50/70 p-5 text-xs flex flex-col gap-3">
        <h5 className="font-bold text-[var(--foreground)]">Submission Recap</h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-700">
          <div>
            <span className="text-[var(--muted-foreground)] block">Model:</span>
            <strong className="truncate block font-semibold">{request.modelFile.name}</strong>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)] block">Technology:</span>
            <strong className="font-semibold capitalize">{request.requirements.technology}</strong>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)] block">Quantity:</span>
            <strong className="font-semibold">{request.requirements.quantity} units</strong>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)] block">Customer:</span>
            <strong className="font-semibold">{request.customer.fullName}</strong>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-stone-50 text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
        >
          <Printer className="h-4 w-4 text-stone-500" />
          <span>Print / Save Summary</span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/track-order"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-stone-50 text-xs font-semibold text-[var(--foreground)] transition-colors"
          >
            <span>Track Order / Inquiries</span>
          </Link>

          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Submit Another Model</span>
          </button>
        </div>

        {/* Model File Storage State Callout */}
        <div className="mt-4 p-3.5 rounded-xl border border-stone-200 bg-stone-50/80 text-left max-w-lg w-full text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--color-text-primary)]">3D Model File Status:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[var(--color-brand)] border border-blue-200">
              Cached Locally (IndexedDB)
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
            Your file <strong className="font-semibold text-[var(--color-text-primary)]">{request.modelFile.name}</strong> ({request.modelFile.formattedSize}) and printing specifications have been recorded in our workshop queue. The raw file remains cached in your local browser session until cloud object storage (R2/S3) is connected.
          </p>
        </div>
      </div>
    </div>
  );
}
