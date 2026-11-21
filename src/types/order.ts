import { CartItem } from "./cart";

export type OrderRequestStatus =
  | "Request Submitted"
  | "Under Review"
  | "Awaiting Customer Confirmation"
  | "Quotation Sent"
  | "Awaiting Payment"
  | "Payment Confirmed"
  | "Processing / In Production"
  | "Quality Check"
  | "Ready for Dispatch"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  // Legacy / storefront aliases for backwards compatibility
  | "Under Workshop Review"
  | "Confirmed & Payment Arranged"
  | "In Production"
  | "Completed";

export type PaymentStatus =
  | "Unpaid"
  | "Awaiting Payment"
  | "Partially Paid"
  | "Payment Confirmed"
  | "Refunded";

export interface StatusTimelineEvent {
  status: OrderRequestStatus;
  timestamp: number;
  note?: string;
  updatedBy?: string;
}

export interface InternalAdminNote {
  id: string;
  author: string;
  content: string;
  createdAt: number;
}

export interface CustomerOrderDetails {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pinCode: string;
  preferredContactMethod: "whatsapp" | "phone" | "email";
  instructions?: string;
}

export interface OrderRequest {
  orderId: string;
  status: OrderRequestStatus;
  paymentStatus?: PaymentStatus;
  customer: CustomerOrderDetails;
  items: CartItem[];
  totalQuantity: number;
  estimatedSubtotal: number;
  shippingFee?: number;
  grandTotal?: number;
  paymentPolicyNote: string;
  createdAt: number;
  updatedAt: number;
  estimatedReviewHours: number;
  statusHistory?: StatusTimelineEvent[];
  internalNotes?: InternalAdminNote[];
  quotationId?: string;
  trackingNumber?: string;
  courierName?: string;
  dispatchDate?: number;
  estimatedDeliveryDate?: number;
}

export interface CreateOrderRequestPayload {
  customer: CustomerOrderDetails;
  items: Array<{
    productId: string;
    quantity: number;
    selectedColor?: string;
  }>;
}

export interface OrderRequestResponse {
  success: boolean;
  message: string;
  orderId?: string;
  order?: OrderRequest;
  error?: string;
}
