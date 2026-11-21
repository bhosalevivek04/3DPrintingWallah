"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { quotationService } from "@/services/quotation-service";
import { Quotation, QuotationStatus, QuotationLineItem } from "@/types/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Send,
  CheckCircle2,
  X,
  Search,
  Filter,
  IndianRupee,
  Calendar,
  AlertCircle,
  FileCheck,
} from "lucide-react";

function QuotationsContent() {
  const searchParams = useSearchParams();
  const createFromPrint = searchParams.get("createFromPrint");

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active quotation for modal preview or creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  // New quotation form
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [company, setCompany] = useState("");
  const [orderId, setOrderId] = useState("");
  const [customPrintId, setCustomPrintId] = useState("");

  const [lineItems, setLineItems] = useState<QuotationLineItem[]>([
    {
      id: "item-1",
      title: "Precision 3D Fabrication Job",
      description: "0.16mm layer height, 40% gyroid infill",
      quantity: 1,
      unitPrice: 950,
      total: 950,
    },
  ]);

  const [materialCharge, setMaterialCharge] = useState<number>(150);
  const [finishingCharge, setFinishingCharge] = useState<number>(100);
  const [designCharge, setDesignCharge] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(80);
  const [discount, setDiscount] = useState<number>(0);
  const [validityDays, setValidityDays] = useState<number>(14);
  const [notes, setNotes] = useState(
    "Dimensional tolerance checked to ±0.2mm. Sliced with PrusaSlicer organic supports."
  );
  const [terms, setTerms] = useState(
    "Quotation valid for 14 days. 100% advance payment via UPI or NEFT required prior to production dispatch."
  );

  const loadQuotations = () => {
    quotationService.getAllQuotations().then(setQuotations);
  };

  useEffect(() => {
    loadQuotations();
    if (createFromPrint) {
      setCustomPrintId(createFromPrint);
      setCustomerName("Custom CAD Client");
      setLineItems([
        {
          id: `item-${Date.now()}`,
          title: `Custom Model Fabrication (${createFromPrint})`,
          description: "Sliced FDM/Resin precision print",
          quantity: 1,
          unitPrice: 1200,
          total: 1200,
        },
      ]);
      setIsModalOpen(true);
    }
  }, [createFromPrint]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Calculations
  const itemsSubtotal = lineItems.reduce((acc, i) => acc + i.total, 0);
  const subtotal =
    itemsSubtotal +
    Number(materialCharge) +
    Number(finishingCharge) +
    Number(designCharge) +
    Number(deliveryCharge);
  const grandTotal = Math.max(0, subtotal - Number(discount));

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: `item-${Date.now()}`,
        title: "Additional Part / Infill Treatment",
        description: "",
        quantity: 1,
        unitPrice: 350,
        total: 350,
      },
    ]);
  };

  const handleUpdateLineItem = (
    index: number,
    field: keyof QuotationLineItem,
    value: any
  ) => {
    const updated = [...lineItems];
    const item = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      item.total = Number(item.quantity) * Number(item.unitPrice);
    }
    updated[index] = item;
    setLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleSaveQuotation = async (status: QuotationStatus = "Draft") => {
    if (!customerName.trim() || !customerEmail.trim()) {
      alert("Please provide customer name and email.");
      return;
    }

    const created = await quotationService.createQuotation({
      orderId: orderId || undefined,
      customPrintId: customPrintId || undefined,
      customerName,
      customerEmail,
      customerPhone,
      company: company || undefined,
      items: lineItems,
      materialCharge: Number(materialCharge),
      finishingCharge: Number(finishingCharge),
      designCharge: Number(designCharge),
      deliveryCharge: Number(deliveryCharge),
      subtotal,
      discount: Number(discount),
      tax: 0,
      grandTotal,
      validityDate: Date.now() + 86400000 * validityDays,
      notes,
      terms,
      status,
      sentAt: status === "Sent" ? Date.now() : undefined,
    });

    setIsModalOpen(false);
    loadQuotations();
    showToast(
      `Quotation ${created.id} saved as "${status}". (Simulated notification logged)`
    );
  };

  const handleUpdateStatus = async (id: string, status: QuotationStatus) => {
    await quotationService.updateQuotationStatus(id, status);
    loadQuotations();
    showToast(`Quotation status updated to "${status}".`);
  };

  const filtered = quotations.filter((q) => {
    const term = search.toLowerCase().trim();
    const matchSearch =
      !term ||
      q.id.toLowerCase().includes(term) ||
      q.customerName.toLowerCase().includes(term) ||
      q.customerEmail.toLowerCase().includes(term) ||
      (q.orderId && q.orderId.toLowerCase().includes(term)) ||
      (q.customPrintId && q.customPrintId.toLowerCase().includes(term));

    const matchStatus = statusFilter === "All" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Quotation Management & Pricing Calculator
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Create itemized estimations for custom 3D model fabrication, corporate batches, and bespoke printing requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");
            setCompany("");
            setOrderId("");
            setCustomPrintId("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-all shadow-2xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Quote ID (NWL-QTN-...), Customer Name, Email, or Request Reference..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Quotation Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Ready for Review">Ready for Review</option>
            <option value="Sent">Sent (Simulated)</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Quote ID & Date</th>
                <th className="py-3 px-4">Client Details</th>
                <th className="py-3 px-4">Source Reference</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                    No quotations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--foreground)]">
                      <div>{quote.id}</div>
                      <span className="text-[10px] text-stone-400 font-sans block">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="block text-[var(--foreground)]">{quote.customerName}</strong>
                      {quote.company && (
                        <span className="text-[10px] text-stone-500 font-semibold block">{quote.company}</span>
                      )}
                      <span className="text-[11px] text-[var(--muted-foreground)]">{quote.customerEmail}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {quote.customPrintId ? (
                        <span className="text-blue-600 font-semibold">{quote.customPrintId}</span>
                      ) : quote.orderId ? (
                        <span className="text-stone-700">{quote.orderId}</span>
                      ) : (
                        <span className="text-stone-400">Direct Enquiry</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-[var(--foreground)]">
                      ₹{quote.grandTotal.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {new Date(quote.validityDate).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminStatusBadge status={quote.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewQuotation(quote)}
                          className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
                        >
                          <Printer className="h-3 w-3" />
                          <span>Preview</span>
                        </button>
                        {quote.status !== "Sent" && quote.status !== "Accepted" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(quote.id, "Sent")}
                            title="Simulate Sending to Customer Email"
                            className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-50"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {quote.status !== "Accepted" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(quote.id, "Accepted")}
                            title="Mark as Accepted"
                            className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
          <span>Notice: Quotations simulate email delivery. Real SMTP service will connect in backend phase.</span>
          <span className="text-[11px] text-stone-400">{filtered.length} quotes on record</span>
        </div>
      </div>

      {/* Printable Preview Modal */}
      {previewQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in">
          <div
            className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white border border-[var(--border)] shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] print:hidden">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[var(--foreground)]">
                  {previewQuotation.id}
                </span>
                <AdminStatusBadge status={previewQuotation.status} size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewQuotation(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="space-y-6 text-xs text-stone-800">
              {/* Letterhead */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)] tracking-tight">
                    NewtronLabs 3D Workshop
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Baner High Street, Pune, MH 411045
                  </p>
                  <p className="text-[11px] text-stone-500">
                    support@newtronlabs.in • +91 98230 14589
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[var(--foreground)] uppercase">
                    Commercial Quotation
                  </span>
                  <span className="block font-mono text-[11px] text-stone-500">
                    Ref: {previewQuotation.id}
                  </span>
                  <span className="block text-[10px] text-stone-400">
                    Date: {new Date(previewQuotation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Bill To */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Quotation For:</span>
                  <strong className="text-sm text-[var(--foreground)] block">{previewQuotation.customerName}</strong>
                  {previewQuotation.company && (
                    <span className="text-stone-600 block">{previewQuotation.company}</span>
                  )}
                  <span className="text-stone-500 block">{previewQuotation.customerEmail}</span>
                  <span className="text-stone-500 block">{previewQuotation.customerPhone}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Valid Until:</span>
                  <strong className="text-xs text-stone-700 block">
                    {new Date(previewQuotation.validityDate).toLocaleDateString()}
                  </strong>
                  <span className="text-[10px] text-stone-400 block mt-2">Source:</span>
                  <span className="font-mono text-stone-600 block">
                    {previewQuotation.customPrintId || previewQuotation.orderId || "Direct Workshop Custom"}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 font-bold text-stone-600 text-[11px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center w-16">Qty</th>
                    <th className="py-2 text-right w-24">Unit Rate</th>
                    <th className="py-2 text-right w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {previewQuotation.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2.5">
                        <strong className="block text-[var(--foreground)]">{item.title}</strong>
                        {item.description && (
                          <span className="text-[11px] text-stone-500 block">{item.description}</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 text-right">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 text-right font-bold">₹{item.total.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Fee Breakdown */}
              <div className="pt-2 border-t border-stone-200 flex flex-col items-end gap-1.5 text-xs">
                {previewQuotation.materialCharge > 0 && (
                  <div className="flex justify-between w-64 text-stone-600">
                    <span>Specialty Material Fee:</span>
                    <span>₹{previewQuotation.materialCharge.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {previewQuotation.finishingCharge > 0 && (
                  <div className="flex justify-between w-64 text-stone-600">
                    <span>Vapor Smoothing / Finishing:</span>
                    <span>₹{previewQuotation.finishingCharge.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {previewQuotation.designCharge > 0 && (
                  <div className="flex justify-between w-64 text-stone-600">
                    <span>CAD Repair / Optimization:</span>
                    <span>₹{previewQuotation.designCharge.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 text-stone-600">
                  <span>Logistics & Express Packaging:</span>
                  <span>₹{previewQuotation.deliveryCharge.toLocaleString("en-IN")}</span>
                </div>
                {previewQuotation.discount > 0 && (
                  <div className="flex justify-between w-64 text-emerald-700 font-semibold">
                    <span>Discount Applied:</span>
                    <span>-₹{previewQuotation.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 pt-2 border-t border-stone-200 text-sm font-extrabold text-[var(--foreground)]">
                  <span>Grand Total:</span>
                  <span>₹{previewQuotation.grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Terms and Notes */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-[11px] text-stone-600">
                <strong className="block text-stone-800 text-xs">Terms & Conditions:</strong>
                <p>{previewQuotation.terms}</p>
                {previewQuotation.notes && (
                  <p className="pt-1 text-stone-500 italic">Notes: {previewQuotation.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Quotation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div
            className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white border border-[var(--border)] shadow-2xl p-6 overflow-y-auto flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  Build Custom Quotation
                </h3>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Itemize materials, infill fabrication, post-processing, and logistics.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikram Rathore"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. vikram@domain.com"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98220 88776"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Company / Studio</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. AeroDrone Mechanics"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                    Quotation Line Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[11px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-stone-50 border border-[var(--border)] grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateLineItem(idx, "title", e.target.value)}
                          placeholder="Item title"
                          className="w-full px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs font-semibold focus:outline-hidden"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateLineItem(idx, "quantity", Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs font-mono text-center focus:outline-hidden"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min={0}
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateLineItem(idx, "unitPrice", Number(e.target.value))}
                          placeholder="Rate"
                          className="w-full px-2 py-1 rounded-lg border border-stone-200 bg-white text-xs font-mono text-right focus:outline-hidden"
                        />
                      </div>
                      <div className="col-span-2 text-right font-extrabold font-mono text-stone-800">
                        ₹{item.total.toLocaleString("en-IN")}
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surcharges & Fees */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[var(--border)]">
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Special Material (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={materialCharge}
                    onChange={(e) => setMaterialCharge(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Finishing / Polish (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={finishingCharge}
                    onChange={(e) => setFinishingCharge(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Discount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-emerald-700"
                  />
                </div>
              </div>

              {/* Grand Total Preview */}
              <div className="p-3 rounded-xl bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 block font-bold">Calculated Quotation Total</span>
                  <span className="text-xl font-extrabold font-mono">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
                <span className="text-xs text-stone-400 font-medium">Valid for {validityDays} Days</span>
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuotation("Draft")}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuotation("Ready for Review")}
                  className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs cursor-pointer"
                >
                  Save &amp; Ready for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminQuotationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading quotation generator...</div>}>
      <QuotationsContent />
    </Suspense>
  );
}
