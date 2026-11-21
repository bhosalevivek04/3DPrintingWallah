import { AdminNotification } from "@/types/admin";

export interface INotificationService {
  getAllNotifications(): Promise<AdminNotification[]>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(): Promise<boolean>;
  deleteNotification(id: string): Promise<boolean>;
}

export const INITIAL_DEMO_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-001",
    title: "New Order Request",
    message: "Priya Nair submitted request NWL-ORD-20261121-7104 for Modular Desk Organiser Tray.",
    type: "order",
    timestamp: Date.now() - 3600000 * 3,
    isRead: false,
    link: "/admin/orders",
  },
  {
    id: "notif-002",
    title: "Custom 3D Model Uploaded",
    message: "Vikram Rathore uploaded drone_chassis_v3.stl (18.4 MB) for quotation review.",
    type: "custom_print",
    timestamp: Date.now() - 3600000 * 5,
    isRead: false,
    link: "/admin/custom-prints",
  },
  {
    id: "notif-003",
    title: "Low Stock Alert",
    message: "Modular Desk Organiser Tray has only 4 units remaining (Threshold: 5).",
    type: "inventory",
    timestamp: Date.now() - 86400000 * 1,
    isRead: false,
    link: "/admin/inventory",
  },
  {
    id: "notif-004",
    title: "Bulk Corporate Inquiry",
    message: "Aakash Mehta sent inquiry for 50 custom geometric planters.",
    type: "enquiry",
    timestamp: Date.now() - 3600000 * 4,
    isRead: false,
    link: "/admin/enquiries",
  },
  {
    id: "notif-005",
    title: "New Product Review",
    message: "Meera Joshi submitted a 5-star review for Organic Voronoi Mood Lamp.",
    type: "review",
    timestamp: Date.now() - 86400000 * 1.5,
    isRead: true,
    link: "/admin/reviews",
  },
];

const STORAGE_KEY = "newtronlabs_admin_notifications_v1";

class NotificationService implements INotificationService {
  private notifications: AdminNotification[] = INITIAL_DEMO_NOTIFICATIONS;

  private loadStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch {}
  }

  private saveStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    } catch {}
  }

  async getAllNotifications(): Promise<AdminNotification[]> {
    this.loadStorage();
    return [...this.notifications].sort((a, b) => b.timestamp - a.timestamp);
  }

  async getUnreadCount(): Promise<number> {
    this.loadStorage();
    return this.notifications.filter((n) => !n.isRead).length;
  }

  async markAsRead(id: string): Promise<boolean> {
    this.loadStorage();
    const notif = this.notifications.find((n) => n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    this.saveStorage();
    return true;
  }

  async markAllAsRead(): Promise<boolean> {
    this.loadStorage();
    this.notifications.forEach((n) => (n.isRead = true));
    this.saveStorage();
    return true;
  }

  async deleteNotification(id: string): Promise<boolean> {
    this.loadStorage();
    const prev = this.notifications.length;
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveStorage();
    return this.notifications.length < prev;
  }
}

export const notificationService = new NotificationService();
