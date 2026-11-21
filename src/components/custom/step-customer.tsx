"use client";

import React from "react";
import Link from "next/link";
import { CustomerInfo } from "@/types/custom-print";
import { User, Mail, Phone, Building2, MapPin, ShieldCheck, AlertCircle } from "lucide-react";

interface StepCustomerProps {
  customer: CustomerInfo;
  onChange: (customer: CustomerInfo) => void;
  errors: Record<string, string>;
}

export function StepCustomer({ customer, onChange, errors }: StepCustomerProps) {
  const updateField = <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) => {
    onChange({
      ...customer,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-[var(--foreground)]">
          Contact & Delivery Information
        </h3>
        <p className="text-xs text-[var(--muted-foreground)]">
          Where should we send your quotation, estimated turnaround time, and delivery estimate?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Full Name *</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={customer.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className={`px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 ${
              errors.fullName
                ? "border-rose-400 focus:ring-rose-400"
                : "border-[var(--border)] focus:ring-[var(--primary)]"
            }`}
          />
          {errors.fullName && (
            <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.fullName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Email Address *</span>
          </label>
          <input
            id="email"
            type="email"
            value={customer.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="e.g. rahul@example.com"
            className={`px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-rose-400 focus:ring-rose-400"
                : "border-[var(--border)] focus:ring-[var(--primary)]"
            }`}
          />
          {errors.email && (
            <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.email}
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Phone / WhatsApp Number *</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={customer.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="e.g. 9876543210"
            className={`px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 ${
              errors.phone
                ? "border-rose-400 focus:ring-rose-400"
                : "border-[var(--border)] focus:ring-[var(--primary)]"
            }`}
          />
          {errors.phone && (
            <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.phone}
            </span>
          )}
        </div>

        {/* Company (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-stone-400" />
            <span>Company / Studio Name (Optional)</span>
          </label>
          <input
            id="company"
            type="text"
            value={customer.company || ""}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="e.g. Studio Vertex Designs"
            className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Delivery City (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-stone-400" />
            <span>Delivery City (Optional)</span>
          </label>
          <input
            id="city"
            type="text"
            value={customer.city || ""}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="e.g. Pune / Mumbai / Bengaluru"
            className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Delivery PIN Code (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pincode" className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-stone-400" />
            <span>Delivery PIN Code (Optional)</span>
          </label>
          <input
            id="pincode"
            type="text"
            maxLength={6}
            value={customer.pincode || ""}
            onChange={(e) => updateField("pincode", e.target.value)}
            placeholder="e.g. 411038"
            className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer-notes" className="text-xs font-bold text-[var(--foreground)]">
          Additional Delivery or Project Notes (Optional)
        </label>
        <textarea
          id="customer-notes"
          rows={2}
          value={customer.additionalNotes || ""}
          onChange={(e) => updateField("additionalNotes", e.target.value)}
          placeholder="Any special dispatch instructions or company GST billing requests..."
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={customer.consentGiven}
            onChange={(e) => updateField("consentGiven", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)]"
          />
          <span className="text-xs text-[var(--foreground)] leading-relaxed">
            I agree that NewtronLabs may contact me regarding this printing request and use the uploaded model to prepare a quotation. (See our{" "}
            <Link href="/about" className="text-[var(--primary)] hover:underline font-semibold">
              privacy terms
            </Link>
            ).
          </span>
        </label>
        {errors.consentGiven && (
          <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.consentGiven}
          </span>
        )}
      </div>
    </div>
  );
}
