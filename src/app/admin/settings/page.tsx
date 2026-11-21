"use client";

import React, { useState, useEffect } from "react";
import { settingsService, DEFAULT_ADMIN_SETTINGS } from "@/services/settings-service";
import { AdminSettings } from "@/types/admin";
import {
  Settings,
  Store,
  FileBox,
  SlidersHorizontal,
  FileText,
  Truck,
  Bell,
  User,
  Save,
  RotateCcw,
  CheckCircle2,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

type SettingsTab =
  | "store"
  | "order"
  | "inventory"
  | "quotations"
  | "shipping"
  | "notifications"
  | "profile";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("store");
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadSettings = () => {
    settingsService.getSettings().then(setSettings);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await settingsService.updateSettings(settings);
    showToast("Settings saved and persisted locally.");
  };

  const handleReset = async () => {
    if (confirm("Reset all workshop settings to factory defaults?")) {
      const reset = await settingsService.resetToDefaults();
      setSettings(reset);
      showToast("Reset settings to initial defaults.");
    }
  };

  const tabs = [
    { id: "store", label: "Store & Brand", icon: Store },
    { id: "order", label: "Order Reference", icon: FileBox },
    { id: "inventory", label: "Inventory Rules", icon: SlidersHorizontal },
    { id: "quotations", label: "Quotation Defaults", icon: FileText },
    { id: "shipping", label: "Shipping Rates", icon: Truck },
    { id: "notifications", label: "Alert Preferences", icon: Bell },
    { id: "profile", label: "Admin Profile", icon: User },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-12">
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
            Workshop Operations Settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Configure default order prefixes, quotation terms, low-stock thresholds, and notification rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-2xs font-bold"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Tab Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white border border-[var(--border)] shadow-xs flex flex-col gap-6">
        {/* Tab 1: Store & Brand */}
        {activeTab === "store" && (
          <div className="flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-[var(--foreground)]">Workshop Identity & Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Store / Workshop Name</label>
                <input
                  type="text"
                  value={settings.store.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      store: { ...settings.store, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.store.tagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      store: { ...settings.store, tagline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.store.supportEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      store: { ...settings.store, supportEmail: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Support Phone / WhatsApp</label>
                <input
                  type="text"
                  value={settings.store.supportPhone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      store: { ...settings.store, supportPhone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-mono focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Physical Workshop Address</label>
              <input
                type="text"
                value={settings.store.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    store: { ...settings.store, address: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Order Reference */}
        {activeTab === "order" && (
          <div className="flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-[var(--foreground)]">Order Reference Format & SLAs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Order Prefix</label>
                <input
                  type="text"
                  value={settings.order.prefix}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      order: { ...settings.order, prefix: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 font-mono text-xs font-bold focus:outline-hidden"
                />
                <span className="text-[10px] text-stone-400 block mt-1">
                  Example: {settings.order.prefix}-20261121-4821
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Review SLA (Hours)</label>
                <input
                  type="number"
                  min={1}
                  value={settings.order.defaultReviewHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      order: {
                        ...settings.order,
                        defaultReviewHours: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-mono focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Inventory Rules */}
        {activeTab === "inventory" && (
          <div className="flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-[var(--foreground)]">Inventory & Stock Safeguards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Default Low-Stock Threshold</label>
                <input
                  type="number"
                  min={1}
                  value={settings.inventory.defaultLowStockThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inventory: {
                        ...settings.inventory,
                        defaultLowStockThreshold: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 font-mono text-xs font-bold focus:outline-hidden"
                />
                <span className="text-[10px] text-stone-400 block mt-1">
                  Triggers orange banner on storefront &amp; alert badge on admin sidebar
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={settings.inventory.enableLowStockBanners}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inventory: {
                        ...settings.inventory,
                        enableLowStockBanners: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[var(--primary)]"
                />
                <span>Display &quot;Only X Left!&quot; Warning Banners on Storefront</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Quotation Defaults */}
        {activeTab === "quotations" && (
          <div className="flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-[var(--foreground)]">Quotation Terms & Banking Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Default Validity (Days)</label>
                <input
                  type="number"
                  min={1}
                  value={settings.quotations.defaultValidityDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      quotations: {
                        ...settings.quotations,
                        defaultValidityDays: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Official UPI VPA Handle</label>
                <input
                  type="text"
                  value={settings.quotations.upiId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      quotations: { ...settings.quotations, upiId: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-mono focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Standard Bank Account Details</label>
              <input
                type="text"
                value={settings.quotations.bankDetails}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    quotations: {
                      ...settings.quotations,
                      bankDetails: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Standard Quotation Terms & Conditions</label>
              <textarea
                rows={3}
                value={settings.quotations.defaultTerms}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    quotations: {
                      ...settings.quotations,
                      defaultTerms: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Shipping Rates */}
        {activeTab === "shipping" && (
          <div className="flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-[var(--foreground)]">Domestic Shipping Rates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Flat Shipping Fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={settings.shipping.standardShippingFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        standardShippingFee: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-mono font-bold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={settings.shipping.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        freeShippingThreshold: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-mono font-bold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Standard Production Lead Days</label>
                <input
                  type="number"
                  min={1}
                  value={settings.shipping.productionLeadDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        productionLeadDays: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-mono focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Alert Preferences */}
        {activeTab === "notifications" && (
          <div className="flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-[var(--foreground)]">Staff Notification Channels</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailAlertsEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emailAlertsEnabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[var(--primary)]"
                />
                <span>Email Notifications for Workshop Technicians (Simulated)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={settings.notifications.whatsappAlertsEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        whatsappAlertsEnabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[var(--primary)]"
                />
                <span>WhatsApp Business Dispatch &amp; Tracking Alerts (Simulated)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={settings.notifications.notifyOnLowStock}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notifyOnLowStock: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[var(--primary)]"
                />
                <span>Alert on Low-Stock Threshold Breaches</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 7: Admin Profile */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-4 text-xs">
            <h3 className="text-base font-bold text-[var(--foreground)]">Technician / Administrator Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Operator Name</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned Role</label>
                <input
                  type="text"
                  value={settings.profile.role}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, role: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
              <span>
                <strong>Authentication Notice:</strong> Production authentication (NextAuth, OAuth, JWT sessions, and RBAC) will be introduced in the backend phase. Client settings are persisted safely in local storage.
              </span>
            </div>
          </div>
        )}

        {/* Save Footer CTA */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
