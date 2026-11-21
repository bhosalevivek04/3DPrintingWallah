"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { customerService } from "@/services/customer-service";
import { AdminCustomer } from "@/types/admin";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Building,
  ShoppingBag,
  Layers,
  IndianRupee,
  Calendar,
  X,
  CheckCircle2,
  Save,
  ShieldCheck,
  FileBox,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [notes, setNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadCustomers = () => {
    customerService.getAllCustomers().then(setCustomers);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectCustomer = (c: AdminCustomer) => {
    setSelectedCustomer(c);
    setNotes(c.internalNotes || "");
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;
    const updated = await customerService.updateCustomerNotes(selectedCustomer.id, notes);
    if (updated) {
      setSelectedCustomer(updated);
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast("Customer notes updated successfully.");
    }
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q))
    );
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
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Client profiles, order enquiry volumes, confirmed lifetime purchases, and workshop material preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
            Total Accounts: {customers.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Customer Name, Email, Phone, Company, or City..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
        />
      </div>

      {/* Layout: Customer Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table (7 or 12 cols) */}
        <div className={selectedCustomer ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Client Name & Details</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-center">Orders</th>
                    <th className="py-3 px-4 text-center">Custom Prints</th>
                    <th className="py-3 px-4">Confirmed Value</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                        No customer accounts match your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => {
                      const isSelected = selectedCustomer?.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => handleSelectCustomer(c)}
                          className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50/70" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <strong className="block text-[var(--foreground)]">{c.name}</strong>
                            {c.company && (
                              <span className="text-[11px] text-stone-500 font-semibold block">
                                {c.company}
                              </span>
                            )}
                            <span className="text-[11px] text-[var(--muted-foreground)] block">{c.email}</span>
                            <span className="text-[10px] text-stone-400">{c.phone}</span>
                          </td>

                          <td className="py-3.5 px-4 text-stone-600">
                            <span>{c.city}, {c.state}</span>
                            <span className="text-[10px] text-stone-400 block">{c.pinCode}</span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-bold text-stone-800">
                            {c.orderCount}
                          </td>

                          <td className="py-3.5 px-4 text-center font-bold text-stone-800">
                            {c.customPrintCount}
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                            ₹{c.totalConfirmedValue.toLocaleString("en-IN")}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCustomer(c);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-stone-100"
                            >
                              Profile &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Customer data masked for prototype demonstration.</span>
              </span>
              <span className="text-[11px] text-stone-400">{filtered.length} customers listed</span>
            </div>
          </div>
        </div>

        {/* Customer Detail Drawer (5 cols) */}
        {selectedCustomer && (
          <div className="lg:col-span-5 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-lg flex flex-col gap-6 sticky top-20 animate-in fade-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Customer Profile
                </span>
                <h2 className="text-xl font-extrabold text-[var(--foreground)] mt-0.5">
                  {selectedCustomer.name}
                </h2>
                {selectedCustomer.company && (
                  <span className="text-xs text-stone-600 font-semibold block">
                    {selectedCustomer.company}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                  Confirmed Purchases
                </span>
                <span className="text-xl font-extrabold text-emerald-900 mt-1 block">
                  ₹{selectedCustomer.totalConfirmedValue.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold uppercase text-blue-800 block">
                  Activity Volume
                </span>
                <span className="text-xl font-extrabold text-blue-900 mt-1 block">
                  {selectedCustomer.orderCount} Orders • {selectedCustomer.customPrintCount} CAD
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-[var(--border)] space-y-2 text-xs">
              <strong className="block text-[10px] font-bold uppercase text-stone-500">
                Contact & Shipping Location
              </strong>
              <div className="flex items-center gap-2 text-stone-700">
                <Mail className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <a href={`mailto:${selectedCustomer.email}`} className="text-blue-600 hover:underline">
                  {selectedCustomer.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <a href={`tel:${selectedCustomer.phone}`} className="font-mono">
                  {selectedCustomer.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-stone-700 pt-1">
                <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  {selectedCustomer.deliveryAddress}, {selectedCustomer.city},{" "}
                  {selectedCustomer.state} - {selectedCustomer.pinCode}
                </span>
              </div>
            </div>

            {/* Recent Orders Link */}
            <div className="flex flex-col gap-2">
              <strong className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Recent Order Inquiries
              </strong>
              <div className="space-y-1.5">
                {selectedCustomer.recentOrderIds.map((ordId) => (
                  <Link
                    key={ordId}
                    href={`/admin/orders?ref=${ordId}`}
                    className="p-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-stone-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="font-mono font-bold text-[var(--foreground)]">{ordId}</span>
                    <span className="text-[var(--primary)] font-semibold text-[11px] hover:underline">
                      View Order &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Customer Notes */}
            <div className="flex flex-col gap-2">
              <strong className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Internal Customer Notes & Material Preferences
              </strong>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Requires ultra-fine layer height (0.12mm); corporate account with baner delivery..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-white text-xs placeholder:text-stone-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="self-end px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
