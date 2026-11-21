import { AdminSettings } from "@/types/admin";

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  store: {
    name: "NewtronLabs 3D Printing Workshop",
    tagline: "Precision FDM & Resin 3D Printing Studio",
    supportEmail: "support@newtronlabs.in",
    supportPhone: "+91 98230 14589",
    address: "Baner Workshop Suite 402, High Street",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411045",
    websiteUrl: "https://newtronlabs.in",
  },
  order: {
    prefix: "NWL-ORD",
    digits: 4,
    defaultReviewHours: 24,
    autoAlertStaffOnSubmission: true,
  },
  inventory: {
    defaultLowStockThreshold: 5,
    enableLowStockBanners: true,
    preventBackordersGlobally: false,
  },
  quotations: {
    defaultValidityDays: 14,
    standardTaxPercent: 0,
    defaultTerms:
      "All custom prints undergo optical dimensional inspection. 100% advance payment confirmed before dispatch. Files kept confidential under internal non-disclosure protocol.",
    bankDetails: "HDFC Bank, Baner Branch | A/C: 50200088912345 | IFSC: HDFC0001234",
    upiId: "newtronlabs@hdfcbank",
  },
  shipping: {
    defaultCourier: "Delhivery",
    standardShippingFee: 80,
    freeShippingThreshold: 999,
    productionLeadDays: 3,
  },
  notifications: {
    emailAlertsEnabled: true,
    whatsappAlertsEnabled: true,
    notifyOnNewOrder: true,
    notifyOnCustomPrint: true,
    notifyOnLowStock: true,
  },
  profile: {
    name: "Workshop Manager",
    email: "workshop@newtronlabs.in",
    role: "Lead 3D Printing Technician & Store Administrator",
    avatarUrl: "/images/hero-workshop.webp",
  },
};

const STORAGE_KEY = "newtronlabs_admin_settings_v1";

export interface ISettingsService {
  getSettings(): Promise<AdminSettings>;
  updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings>;
  resetToDefaults(): Promise<AdminSettings>;
}

class SettingsService implements ISettingsService {
  private settings: AdminSettings = DEFAULT_ADMIN_SETTINGS;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.settings = {
          ...DEFAULT_ADMIN_SETTINGS,
          ...JSON.parse(stored),
        };
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {}
  }

  async getSettings(): Promise<AdminSettings> {
    this.loadStorage();
    return { ...this.settings };
  }

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    this.loadStorage();
    this.settings = {
      ...this.settings,
      ...updates,
      store: { ...this.settings.store, ...(updates.store || {}) },
      order: { ...this.settings.order, ...(updates.order || {}) },
      inventory: { ...this.settings.inventory, ...(updates.inventory || {}) },
      quotations: { ...this.settings.quotations, ...(updates.quotations || {}) },
      shipping: { ...this.settings.shipping, ...(updates.shipping || {}) },
      notifications: { ...this.settings.notifications, ...(updates.notifications || {}) },
      profile: { ...this.settings.profile, ...(updates.profile || {}) },
    };
    this.saveStorage();
    return { ...this.settings };
  }

  async resetToDefaults(): Promise<AdminSettings> {
    this.settings = { ...DEFAULT_ADMIN_SETTINGS };
    this.saveStorage();
    return { ...this.settings };
  }
}

export const settingsService = new SettingsService();
