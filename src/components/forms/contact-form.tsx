"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Print Project",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);

    // Simulate response delay for demonstration
    await new Promise((r) => setTimeout(r, 800));

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--color-success-border)] bg-[var(--color-success-bg)] p-6 sm:p-8 text-center flex flex-col items-center gap-3 animate-in fade-in">
        <div className="h-12 w-12 rounded-full bg-white border border-[var(--color-success-border)] text-[var(--color-success)] flex items-center justify-center shadow-2xs">
          <CheckCircle2 className="h-6 w-6 stroke-[2]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Message Sent to Workshop</h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-md">
          Thank you, <strong className="font-semibold">{formData.name}</strong>. Our workshop team has received your message regarding &quot;{formData.subject}&quot; and will get back to you at <strong className="font-semibold">{formData.email}</strong> within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              subject: "Custom Print Project",
              message: "",
            });
          }}
          className="mt-2 text-xs font-bold text-[var(--color-brand)] hover:underline cursor-pointer"
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

      {error && (
        <div className="p-3.5 rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-xs text-[var(--color-danger)] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-[var(--color-danger)] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Your Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Patil"
            className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="rahul@example.com"
            className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Phone / WhatsApp <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Topic / Subject
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
          >
            <option value="Custom Print Project">Custom 3D Print Project</option>
            <option value="Bulk / Commercial Order">Bulk / Commercial Order</option>
            <option value="Material & Tolerance Inquiry">Material & Tolerance Inquiry</option>
            <option value="Order Tracking Help">Order Tracking Help</option>
            <option value="General Question">General Question</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        <div className="flex justify-between items-center">
          <label className="font-bold uppercase tracking-wider text-[var(--foreground)]">
            Message <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-stone-400">{formData.message.length} / 500</span>
        </div>
        <textarea
          name="message"
          required
          maxLength={500}
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Describe your 3D printing requirements, dimensions, or questions..."
          className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-all shadow-xs active:scale-98 cursor-pointer mt-1"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending to Workshop...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Submit Message</span>
          </>
        )}
      </button>
    </form>
  );
}
