"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Print Project",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);
  const [emailStatusNote, setEmailStatusNote] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        } else {
          setGeneralError(data.error || "Failed to submit enquiry. Please try again.");
        }
        setLoading(false);
        return;
      }

      setSubmittedEnquiryId(data.enquiryId);
      setEmailStatusNote(data.emailStatusNote || null);
      setLoading(false);
    } catch (err) {
      console.error("Contact form error:", err);
      setGeneralError("Network connection error. Please check your connection and retry.");
      setLoading(false);
    }
  };

  if (submittedEnquiryId) {
    return (
      <div className="rounded-2xl border border-[var(--color-success-border)] bg-[var(--color-success-bg)] p-6 sm:p-8 text-center flex flex-col items-center gap-3 animate-in fade-in">
        <div className="h-12 w-12 rounded-full bg-white border border-[var(--color-success-border)] text-[var(--color-success)] flex items-center justify-center shadow-2xs">
          <CheckCircle2 className="h-6 w-6 stroke-[2]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          Enquiry Logged in Workshop Queue
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-md">
          Thank you, <strong className="font-semibold text-[var(--color-text-primary)]">{formData.name}</strong>. Your enquiry has been recorded in our workshop queue under reference ID <strong className="font-mono font-bold text-[var(--color-brand)]">{submittedEnquiryId}</strong>.
        </p>

        {/* Honest Email Status Notice */}
        <div className="mt-1 p-3 rounded-xl bg-white/80 border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] max-w-md flex items-start gap-2 text-left">
          <Info className="h-4 w-4 text-[var(--color-brand)] shrink-0 mt-0.5" />
          <span>
            <strong>Note on Email Confirmation:</strong> {emailStatusNote || "Automated email auto-reply is currently in development mode. Our engineering team reviews messages daily and will reach out to you directly at "}<strong className="text-[var(--color-text-primary)]">{formData.email}</strong>.
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmittedEnquiryId(null);
            setEmailStatusNote(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              subject: "Custom Print Project",
              message: "",
            });
          }}
          className="mt-3 text-xs font-bold text-[var(--color-brand)] hover:underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-5">
      <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
        Send Us a Message
      </h3>

      {generalError && (
        <div className="p-3.5 rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-xs text-[var(--color-danger)] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-[var(--color-danger)] shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Your Name <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            maxLength={100}
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Patil"
            className={`px-3.5 py-2.5 rounded-xl border ${
              fieldErrors.name ? "border-[var(--color-danger)]" : "border-[var(--border)]"
            } bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all`}
          />
          {fieldErrors.name && (
            <span className="text-[11px] text-[var(--color-danger)] font-medium">
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Email Address <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            maxLength={150}
            value={formData.email}
            onChange={handleChange}
            placeholder="rahul@example.com"
            className={`px-3.5 py-2.5 rounded-xl border ${
              fieldErrors.email ? "border-[var(--color-danger)]" : "border-[var(--border)]"
            } bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all`}
          />
          {fieldErrors.email && (
            <span className="text-[11px] text-[var(--color-danger)] font-medium">
              {fieldErrors.email}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            maxLength={20}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={`px-3.5 py-2.5 rounded-xl border ${
              fieldErrors.phone ? "border-[var(--color-danger)]" : "border-[var(--border)]"
            } bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all`}
          />
          {fieldErrors.phone && (
            <span className="text-[11px] text-[var(--color-danger)] font-medium">
              {fieldErrors.phone}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Subject <span className="text-[var(--color-danger)]">*</span>
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all cursor-pointer"
          >
            <option value="Custom Print Project">Custom Print Project</option>
            <option value="Bulk Corporate Order">Bulk Corporate Order</option>
            <option value="Material & Tolerance Inquiry">Material & Tolerance Inquiry</option>
            <option value="CAD Modeling Assistance">CAD Modeling Assistance</option>
            <option value="Other Workshop Inquiry">Other Workshop Inquiry</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
          Your Message <span className="text-[var(--color-danger)]">*</span>
        </label>
        <textarea
          name="message"
          rows={4}
          required
          maxLength={3000}
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe your model, requirements, dimensions, or questions..."
          className={`px-3.5 py-2.5 rounded-xl border ${
            fieldErrors.message ? "border-[var(--color-danger)]" : "border-[var(--border)]"
          } bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all resize-y`}
        />
        <div className="flex justify-between text-[11px] text-[var(--muted-foreground)]">
          {fieldErrors.message ? (
            <span className="text-[var(--color-danger)] font-medium">{fieldErrors.message}</span>
          ) : (
            <span>Minimum 10 characters</span>
          )}
          <span>{formData.message.length} / 3000</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto self-start inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors shadow-2xs disabled:opacity-50 min-h-[44px] cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Submitting to Workshop Queue...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
