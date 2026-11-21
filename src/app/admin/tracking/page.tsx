"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { trackingService } from "@/services/tracking-service";
import { OrderTrackingRecord, CourierName, TrackingFulfillmentStatus } from "@/types/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  Truck,
  Search,
  ExternalLink,
  Edit2,
  Plus,
  CheckCircle2,
  X,
  Package,
  Calendar,
  MapPin,
  Clock,
  ShieldAlert,
} from "lucide-react";

const COURIERS: CourierName[] = [
  "Delhivery",
  "BlueDart",
  "DTDC",
  "India Post Speed Post",
  "Dunzo / Local Courier",
  "Standard Workshop Delivery",
];

const FULFILLMENT_STATUSES: TrackingFulfillmentStatus[] = [
  "Order Placed",
  "In Production",
  "Quality Checked",
  "Packed",
  "Dispatched",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Delayed",
];

export default function AdminTrackingPage() {
  const [records, setRecords] = useState<OrderTrackingRecord[]>([]);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Update Modal
  const [editingRecord, setEditingRecord] = useState<OrderTrackingRecord | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState<CourierName>("Delhivery");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<TrackingFulfillmentStatus>("In Transit");
  const [destinationCity, setDestinationCity] = useState("");
  const [trackingNotes, setTrackingNotes] = useState("");

  // Add Event
  const [newEventStatus, setNewEventStatus] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventNote, setNewEventNote] = useState("");

  const loadTracking = () => {
    trackingService.getAllTrackingRecords().then(setRecords);
  };

  useEffect(() => {
    loadTracking();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenEdit = (rec: OrderTrackingRecord) => {
    setEditingRecord(rec);
    setTrackingNumber(rec.trackingNumber);
    setCourierName(rec.courierName);
    setFulfillmentStatus(rec.fulfillmentStatus);
    setDestinationCity(rec.destinationCity);
    setTrackingNotes(rec.trackingNotes || "");
    setNewEventStatus("");
    setNewEventLocation("");
    setNewEventNote("");
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    await trackingService.updateTracking(editingRecord.orderId, {
      trackingNumber,
      courierName,
      fulfillmentStatus,
      destinationCity,
      trackingNotes,
    });

    if (newEventStatus.trim() && newEventLocation.trim()) {
      await trackingService.addTrackingEvent(editingRecord.orderId, {
        status: newEventStatus.trim(),
        location: newEventLocation.trim(),
        note: newEventNote.trim() || "Milestone reached.",
      });
    }

    setEditingRecord(null);
    loadTracking();
    showToast(`Updated tracking manifest for ${editingRecord.orderId}.`);
  };

  const filtered = records.filter((r) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      r.orderId.toLowerCase().includes(q) ||
      r.trackingNumber.toLowerCase().includes(q) ||
      r.destinationCity.toLowerCase().includes(q) ||
      r.courierName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Feedback */}
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
            Order Tracking & Logistics
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Manage courier tracking waybills, update fulfillment waypoints, and verify customer tracking pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
            Active Dispatches: {records.length}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID (NWL-ORD-...), Courier AWB, Destination City..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
        />
      </div>

      {/* Tracking Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Tracking AWB / Courier</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Milestones</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                    No order tracking records found.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.orderId} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--foreground)]">
                      <div>{rec.orderId}</div>
                      <span className="text-[10px] text-stone-400 font-sans block">
                        Updated {new Date(rec.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="block font-mono text-stone-800">{rec.trackingNumber}</strong>
                      <span className="text-[11px] text-[var(--primary)] font-semibold">{rec.courierName}</span>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      <span>From: {rec.originLocation}</span>
                      <span className="block text-[11px] text-stone-500">To: {rec.destinationCity}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-700">
                      {rec.events.length} Waypoints Logged
                      <span className="block text-[10px] text-stone-400 truncate max-w-[150px]">
                        Latest: {rec.events[rec.events.length - 1]?.status || "Pending"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminStatusBadge status={rec.fulfillmentStatus} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/track-order?ref=${rec.orderId}`}
                          target="_blank"
                          title="Preview Customer Tracking View"
                          className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Preview</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(rec)}
                          className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
          <span>Demonstration Logistics Engine: Live webhook polling ready for Delhivery API during backend phase.</span>
          <span className="text-[11px] text-stone-400">{filtered.length} waybills</span>
        </div>
      </div>

      {/* Edit Tracking Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div
            className="w-full max-w-lg max-h-[90vh] rounded-3xl bg-white border border-[var(--border)] shadow-2xl p-6 overflow-y-auto flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  Update Logistics Manifest
                </h3>
                <span className="text-xs font-mono text-[var(--muted-foreground)]">
                  {editingRecord.orderId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Courier Partner *</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value as CourierName)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-semibold focus:outline-hidden"
                  >
                    {COURIERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tracking Number / AWB *</label>
                  <input
                    type="text"
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. DEL9928172635"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 font-mono text-xs font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Current Milestone Status *</label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value as TrackingFulfillmentStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-bold focus:outline-hidden"
                  >
                    {FULFILLMENT_STATUSES.map((fs) => (
                      <option key={fs} value={fs}>
                        {fs}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Destination Hub City</label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Packaging & Dispatch Notes</label>
                <input
                  type="text"
                  value={trackingNotes}
                  onChange={(e) => setTrackingNotes(e.target.value)}
                  placeholder="e.g. Dispatched in reinforced corrugated box with foam protection sleeves"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                />
              </div>

              {/* Add Tracking Waypoint */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-2">
                <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">
                  Append New Waypoint Event (Optional)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newEventStatus}
                    onChange={(e) => setNewEventStatus(e.target.value)}
                    placeholder="Milestone (e.g. Out for Delivery)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    placeholder="Location (e.g. Baner Delivery Hub)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:outline-hidden"
                  />
                </div>
                <input
                  type="text"
                  value={newEventNote}
                  onChange={(e) => setNewEventNote(e.target.value)}
                  placeholder="Note (e.g. Assigned to delivery associate)"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-2xs"
                >
                  Save Waybill Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
