"use client";

import React, { useState, useEffect } from "react";
import { inventoryService, InventoryItemState } from "@/services/inventory-service";
import { StockAdjustmentLog, StockAdjustmentReason } from "@/types/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Search,
  Filter,
  History,
  X,
  Package,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

const REASONS: StockAdjustmentReason[] = [
  "Restocked batch",
  "Damaged in workshop",
  "Calibration loss",
  "Physical audit correction",
  "Fulfillment deduction",
  "Reserved for custom order",
  "Other",
];

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItemState[]>([]);
  const [logs, setLogs] = useState<StockAdjustmentLog[]>([]);
  const [search, setSearch] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Adjustment Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryItemState | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(5);
  const [isIncrement, setIsIncrement] = useState<boolean>(true);
  const [reason, setReason] = useState<StockAdjustmentReason>("Restocked batch");
  const [notes, setNotes] = useState("");
  const [operatorName, setOperatorName] = useState("Workshop Operator");

  const loadData = () => {
    Promise.all([
      inventoryService.getInventoryOverview(),
      inventoryService.getAdjustmentLogs(),
    ]).then(([inv, adjLogs]) => {
      setItems(inv);
      setLogs(adjLogs);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAdjustment = (item: InventoryItemState) => {
    setSelectedItem(item);
    setAdjustmentQty(5);
    setIsIncrement(true);
    setReason("Restocked batch");
    setNotes("");
  };

  const handleApplyAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const delta = isIncrement ? Math.abs(adjustmentQty) : -Math.abs(adjustmentQty);
    const newStock = Math.max(0, selectedItem.stockQuantity + delta);

    await inventoryService.updateStock(
      selectedItem.productId,
      newStock,
      reason,
      notes,
      operatorName
    );

    showToast(
      `Adjusted stock for "${selectedItem.name}" to ${newStock} units (${delta > 0 ? `+${delta}` : delta}).`
    );

    setSelectedItem(null);
    loadData();
  };

  // Filtered items
  const filtered = items.filter((i) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q);

    const matchAvail = filterAvailability === "All" || i.availability === filterAvailability;
    return matchSearch && matchAvail;
  });

  const lowStockCount = items.filter((i) => i.availability === "low_stock").length;
  const outOfStockCount = items.filter((i) => i.availability === "out_of_stock").length;
  const totalUnits = items.reduce((sum, i) => sum + i.stockQuantity, 0);

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
            Inventory & Stock Control
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Monitor real-time filament batch counts, adjust stock levels with auditable logs, and configure low-stock warnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
            Total Finished Units: {totalUnits}
          </span>
        </div>
      </div>

      {/* Quick Inventory Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total In Stock
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] block mt-1">
              {items.filter((i) => i.availability === "in_stock").length} Products
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
              Healthy workshop levels
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
              Low-Stock Warnings (&le;5)
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-700 block mt-1">
              {lowStockCount} Products
            </span>
            <span className="text-[11px] text-orange-600 font-semibold block mt-0.5">
              Requires printer bed scheduling
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              Out of Stock
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 block mt-1">
              {outOfStockCount} Products
            </span>
            <span className="text-[11px] text-stone-500 font-semibold block mt-0.5">
              Backorders active on storefront
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Package className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search & Availability Filter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Product Name, SKU (NWL-PRD-...), or Category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Stock Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="made_to_order">Made to Order</option>
          </select>
        </div>
      </div>

      {/* Layout: Inventory Table & Audit Log History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inventory Items Table (8 cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Available Stock</th>
                    <th className="py-3 px-4 text-center">Low-Stock (&lt;)</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                        No inventory records match the search filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.productId} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <strong className="block text-[var(--foreground)]">{item.name}</strong>
                          <span className="font-mono text-[10px] text-stone-400">SKU: {item.sku}</span>
                        </td>

                        <td className="py-3 px-4 text-stone-600 font-semibold">{item.category}</td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                              item.stockQuantity <= 0
                                ? "bg-rose-100 text-rose-800"
                                : item.stockQuantity <= item.lowStockThreshold
                                ? "bg-orange-100 text-orange-800"
                                : "bg-stone-100 text-[var(--foreground)]"
                            }`}
                          >
                            {item.stockQuantity}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center font-mono text-stone-500 font-bold">
                          {item.lowStockThreshold}
                        </td>

                        <td className="py-3 px-4">
                          <AdminStatusBadge status={item.availability} size="sm" />
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenAdjustment(item)}
                            className="px-3 py-1.5 rounded-lg bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
              <span>Policy: Unconfirmed order requests do NOT automatically deduct stock.</span>
              <span className="text-[11px] text-stone-400">{filtered.length} items listed</span>
            </div>
          </div>
        </div>

        {/* Audit Log Stream (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 text-xs uppercase tracking-wider">
              <History className="h-4 w-4 text-blue-600" />
              <span>Stock Adjustment Log</span>
            </div>
            <span className="text-[10px] text-stone-400">Auditable Trail</span>
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-3">
            {logs.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">No adjustment history logged yet.</div>
            ) : (
              logs.map((log) => {
                const isPositive = log.adjustmentQuantity > 0;
                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-[var(--foreground)] truncate max-w-[170px]">
                        {log.productName}
                      </strong>
                      <span
                        className={`font-mono font-extrabold text-xs flex items-center gap-0.5 ${
                          isPositive ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isPositive ? `+${log.adjustmentQuantity}` : log.adjustmentQuantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>Reason: {log.reason}</span>
                      <span className="font-mono text-stone-700 font-bold">
                        {log.previousQuantity} &rarr; {log.updatedQuantity}
                      </span>
                    </div>

                    {log.notes && (
                      <p className="text-[11px] text-stone-600 bg-white p-1.5 rounded-md border border-stone-100 mt-1">
                        {log.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                      <span>By: {log.adjustedBy}</span>
                      <span>
                        {new Date(log.timestamp).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Manual Stock Adjustment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-[var(--border)] shadow-xl p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Manual Stock Adjustment</h3>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {selectedItem.name} ({selectedItem.sku})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="flex flex-col gap-4 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block">Current Available:</span>
                  <span className="text-2xl font-extrabold font-mono text-[var(--foreground)]">
                    {selectedItem.stockQuantity}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-400" />
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">New Estimated:</span>
                  <span className="text-2xl font-extrabold font-mono text-blue-600">
                    {Math.max(
                      0,
                      selectedItem.stockQuantity +
                        (isIncrement ? Math.abs(adjustmentQty) : -Math.abs(adjustmentQty))
                    )}
                  </span>
                </div>
              </div>

              {/* Increment or Decrement */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Adjustment Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsIncrement(true)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      isIncrement
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Units (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsIncrement(false)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      !isIncrement
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                    <span>Deduct Units (-)</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Adjustment Quantity *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-sm font-mono font-bold focus:outline-hidden"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Adjustment Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as StockAdjustmentReason)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs font-semibold focus:outline-hidden cursor-pointer"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technician Name */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Adjusted By (Operator)</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Audit Notes / Explanation</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Slicer nozzle clogged; restocked 5-unit batch from bed #2"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer"
                >
                  Apply Stock Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
