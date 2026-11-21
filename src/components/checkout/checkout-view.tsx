"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  CustomerOrderDetails,
  OrderRequest,
  OrderRequestResponse,
} from "@/types/order";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MessageSquare,
  PackageCheck,
  Clock,
  PhoneCall,
} from "lucide-react";

export function CheckoutView() {
  const router = useRouter();
  const { items, totalCount, subtotal, isLoaded, clearCart } = useCart();

  // Form states
  const [formData, setFormData] = useState<CustomerOrderDetails>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    deliveryAddress: "",
    city: "",
    state: "",
    pinCode: "",
    preferredContactMethod: "whatsapp",
    instructions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRequest | null>(null);

  // Field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s\-\(\)\+]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMessage("Please provide your delivery address.");
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage("Please provide your city.");
      return;
    }
    if (!formData.state.trim()) {
      setErrorMessage("Please provide your state.");
      return;
    }
    const cleanPin = formData.pinCode.replace(/\s/g, "");
    if (!/^\d{6}$/.test(cleanPin)) {
      setErrorMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add products before checking out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          ...formData,
          phone: cleanPhone,
          pinCode: cleanPin,
        },
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
        })),
      };

      const res = await fetch("/api/order-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as OrderRequestResponse;

      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.message || data.error || "Failed to submit order request.");
      }

      // Success: Clear cart & save confirmation
      clearCart();
      setSubmittedOrder(data.order);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while submitting your order request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading state
  if (!isLoaded) {
    return (
      <div className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="h-8 w-48 bg-stone-200/70 rounded-lg animate-pulse mb-8" />
        <div className="h-64 w-full bg-stone-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // 2. Success Confirmation Screen
  if (submittedOrder) {
    return (
      <div className="pt-4 pb-12 sm:pb-16 max-w-3xl mx-auto px-4 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Cart", href: "/cart" },
            { label: "Order Request Confirmation" },
          ]}
        />

        <div className="rounded-2xl border border-[var(--color-success-border)] bg-white p-6 sm:p-10 shadow-xs flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <CheckCircle2 className="h-8 w-8 stroke-[1.8]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                Order Request Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                Thank You, {submittedOrder.customer.fullName}!
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1.5 max-w-lg mx-auto">
                Your order request has been logged in our workshop system. We have also sent a confirmation summary to{" "}
                <strong className="text-[var(--foreground)]">{submittedOrder.customer.email}</strong>.
              </p>
            </div>
          </div>

          {/* Reference ID Banner */}
          <div className="rounded-2xl border border-[var(--border)] bg-stone-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
                Order Reference ID
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--foreground)] tracking-tight">
                {submittedOrder.orderId}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/track-order?ref=${submittedOrder.orderId}`}
                className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer"
              >
                Track Status
              </Link>
            </div>
          </div>

          {/* Workshop Enquiry Workflow Explanation */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-5 sm:p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-950">
              <Info className="h-4 w-4 text-[var(--primary)] shrink-0" />
              <span>What Happens Next? (Enquiry Workflow)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs text-blue-900">
              <div className="p-3 rounded-xl bg-white/80 border border-blue-100 flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
                <div>
                  <strong className="font-bold block">1. Workshop Review</strong>
                  <span className="text-stone-600">
                    Our engineering team reviews filament inventory and print bed schedule within 24 hours.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-blue-100 flex items-start gap-2.5">
                <PhoneCall className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
                <div>
                  <strong className="font-bold block">2. Personal Contact</strong>
                  <span className="text-stone-600">
                    We reach out via {submittedOrder.customer.preferredContactMethod.toUpperCase()} to confirm delivery charges and options.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-blue-100 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="font-bold block">3. Separate Payment</strong>
                  <span className="text-stone-600">
                    Payment is arranged via UPI or Bank Transfer only after your final approval.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-blue-100 flex items-start gap-2.5">
                <PackageCheck className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
                <div>
                  <strong className="font-bold block">4. Layer Inspection & Ship</strong>
                  <span className="text-stone-600">
                    Parts are printed, cured/finished, layer inspected, and dispatched with live courier tracking.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Requested Items Snapshot */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
              Requested Items Summary
            </h3>
            <div className="rounded-2xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]/70">
              {submittedOrder.items.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="p-4 flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <strong className="block text-[var(--foreground)]">{item.name}</strong>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {item.selectedColor || "Standard"} • Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[var(--foreground)]">
                    ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div className="p-4 bg-stone-50 flex items-center justify-between text-sm font-bold">
                <span>Estimated Subtotal (excl. shipping)</span>
                <span className="text-base">
                  ₹{submittedOrder.estimatedSubtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Shop</span>
            </Link>

            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold hover:bg-[var(--primary-hover)] transition-all shadow-sm active:scale-97 cursor-pointer"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Empty Cart Guard
  if (items.length === 0) {
    return (
      <div className="pt-4 pb-12 sm:pb-16 max-w-xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center gap-5">
        <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Submit Order Request" }]} />
        <div className="h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
          <Info className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Your Cart is Empty</h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-md">
          Please select products from the shop before submitting an order request.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:bg-[var(--primary-hover)] transition-all shadow-sm active:scale-97"
        >
          <span>Explore Shop</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // 4. Main Checkout Form
  return (
    <div className="pt-4 pb-12 sm:pb-16 max-w-[1440px] mx-auto px-4 lg:px-8">
      {/* Global Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Cart", href: "/cart" },
          { label: "Submit Order Request" },
        ]}
      />

      {/* Header */}
      <div className="pb-6 mb-8 border-b border-[var(--border)]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Submit Order Request
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
          Provide your delivery details. No online payment is charged at checkout; our team will contact you to verify requirements and finalize payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Form (8 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs sm:text-sm text-rose-900 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Contact Information */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs flex flex-col gap-5">
            <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight pb-3 border-b border-[var(--border)]">
              1. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aditi Sharma"
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="aditi@example.com"
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Company / Studio <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Studio Newtron"
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Preferred Contact Method
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "whatsapp", label: "WhatsApp Message" },
                  { id: "phone", label: "Phone Call" },
                  { id: "email", label: "Email" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      formData.preferredContactMethod === method.id
                        ? "bg-blue-50 border-blue-300 text-[var(--primary)] shadow-2xs"
                        : "bg-white border-[var(--border)] text-[var(--foreground)] hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredContactMethod"
                      value={method.id}
                      checked={formData.preferredContactMethod === method.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="h-2 w-2 rounded-full bg-current" />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Destination */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs flex flex-col gap-5">
            <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight pb-3 border-b border-[var(--border)]">
              2. Delivery Address
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress"
                required
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="House / Flat No., Apartment / Street, Area"
                className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Pune"
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="pinCode"
                  required
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="411001"
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Special Notes */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Workshop Notes / Finishing Preferences <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              name="instructions"
              rows={3}
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g. Please use high infill for drop resistance, or let us know if you need this by a specific date."
              className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 h-14 rounded-2xl bg-[var(--primary)] text-white font-bold text-base hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md active:scale-98 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting Your Order Request...</span>
              </>
            ) : (
              <>
                <span>Submit Order Request</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Right Summary (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 sticky top-20">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
                Order Items ({totalCount})
              </h2>
              <Link
                href="/cart"
                className="text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                Edit Cart
              </Link>
            </div>

            <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto divide-y divide-[var(--border)]/60 pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedColor || "default"}`}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-11 w-11 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div className="truncate">
                      <strong className="block text-[var(--foreground)] truncate">{item.name}</strong>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        {item.quantity} × {item.priceDisplay}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[var(--foreground)] shrink-0">
                    ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[var(--foreground)]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span>Shipping</span>
                <span className="text-emerald-700 font-semibold">Calculated by team</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span>GST / Taxes</span>
                <span className="font-semibold text-[var(--foreground)]">Inclusive</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex items-baseline justify-between">
                <span className="text-sm font-bold text-[var(--foreground)]">Estimated Total</span>
                <span className="text-lg font-extrabold text-[var(--foreground)]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Zero Payment Callout */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/80 text-xs text-blue-950 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
              <p className="text-[11.5px] leading-relaxed">
                <strong className="font-bold block text-blue-900">Zero Online Payment</strong>
                No payment is collected at this step. We confirm availability and courier charges before you pay.
              </p>
            </div>
          </div>

          {/* Guarantees */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-stone-50 flex flex-col gap-2 text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Full workshop inspection before dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[var(--primary)] shrink-0" />
              <span>Protective multi-layer shockproof packing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
