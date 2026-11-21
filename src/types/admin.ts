import { ProductCategory } from "./product";
import { OrderRequestStatus, PaymentStatus } from "./order";

// ==========================================
// 1. Categories
// ==========================================
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  subcategories: string[];
  productCount?: number;
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// 2. Customers
// ==========================================
export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pinCode: string;
  orderCount: number;
  totalConfirmedValue: number;
  customPrintCount: number;
  recentOrderIds: string[];
  internalNotes?: string;
  createdAt: number;
  lastActiveAt: number;
}

// ==========================================
// 3. Quotations
// ==========================================
export type QuotationStatus =
  | "Draft"
  | "Ready for Review"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Expired";

export interface QuotationLineItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  orderId?: string;
  customPrintId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  items: QuotationLineItem[];
  materialCharge: number;
  finishingCharge: number;
  designCharge: number;
  deliveryCharge: number;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  validityDate: number; // timestamp
  notes: string;
  terms: string;
  status: QuotationStatus;
  sentAt?: number;
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// 4. Order Tracking
// ==========================================
export type TrackingFulfillmentStatus =
  | "Order Placed"
  | "In Production"
  | "Quality Checked"
  | "Packed"
  | "Dispatched"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed";

export type CourierName =
  | "Delhivery"
  | "BlueDart"
  | "DTDC"
  | "India Post Speed Post"
  | "Dunzo / Local Courier"
  | "Standard Workshop Delivery";

export interface TrackingEvent {
  timestamp: number;
  status: string;
  location: string;
  note: string;
}

export interface OrderTrackingRecord {
  orderId: string;
  trackingNumber: string;
  courierName: CourierName;
  courierUrl?: string;
  fulfillmentStatus: TrackingFulfillmentStatus;
  dispatchDate?: number;
  estimatedDeliveryDate?: number;
  actualDeliveryDate?: number;
  originLocation: string;
  destinationCity: string;
  trackingNotes?: string;
  events: TrackingEvent[];
  updatedAt: number;
}

// ==========================================
// 5. Reviews
// ==========================================
export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export interface AdminProductReview {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  createdAt: number;
}

// ==========================================
// 6. Contact Enquiries
// ==========================================
export type EnquiryStatus = "New" | "In Progress" | "Resolved";

export interface ContactEnquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  submittedAt: number;
  internalReplyNote?: string;
  resolvedAt?: number;
}

// ==========================================
// 7. Inventory Adjustments
// ==========================================
export type StockAdjustmentReason =
  | "Restocked batch"
  | "Damaged in workshop"
  | "Calibration loss"
  | "Physical audit correction"
  | "Fulfillment deduction"
  | "Reserved for custom order"
  | "Other";

export interface StockAdjustmentLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  previousQuantity: number;
  adjustmentQuantity: number;
  updatedQuantity: number;
  reason: StockAdjustmentReason;
  adjustedBy: string;
  notes?: string;
  timestamp: number;
}

// ==========================================
// 8. Admin Notifications
// ==========================================
export type AdminNotificationType =
  | "order"
  | "custom_print"
  | "inventory"
  | "quotation"
  | "enquiry"
  | "review";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: AdminNotificationType;
  timestamp: number;
  isRead: boolean;
  link: string;
}

// ==========================================
// 9. Admin Settings
// ==========================================
export interface AdminSettings {
  store: {
    name: string;
    tagline: string;
    supportEmail: string;
    supportPhone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    websiteUrl: string;
  };
  order: {
    prefix: string;
    digits: number;
    defaultReviewHours: number;
    autoAlertStaffOnSubmission: boolean;
  };
  inventory: {
    defaultLowStockThreshold: number;
    enableLowStockBanners: boolean;
    preventBackordersGlobally: boolean;
  };
  quotations: {
    defaultValidityDays: number;
    standardTaxPercent: number;
    defaultTerms: string;
    bankDetails: string;
    upiId: string;
  };
  shipping: {
    defaultCourier: CourierName;
    standardShippingFee: number;
    freeShippingThreshold: number;
    productionLeadDays: number;
  };
  notifications: {
    emailAlertsEnabled: boolean;
    whatsappAlertsEnabled: boolean;
    notifyOnNewOrder: boolean;
    notifyOnCustomPrint: boolean;
    notifyOnLowStock: boolean;
  };
  profile: {
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
  };
}

// ==========================================
// 10. Analytics
// ==========================================
export type AnalyticsDateRange = "7d" | "30d" | "90d" | "all";

export interface AnalyticsSummary {
  dateRange: AnalyticsDateRange;
  totalOrders: number;
  newOrderRequests: number;
  ordersUnderReview: number;
  ordersInProduction: number;
  completedOrders: number;
  pendingQuotationsCount: number;
  totalQuotationValue: number;
  totalConfirmedRevenue: number;
  totalProductsCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  customPrintEnquiriesCount: number;
}
