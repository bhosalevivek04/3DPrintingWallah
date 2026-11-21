"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminNotification } from "@/types/admin";
import { notificationService } from "@/services/notification-service";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    if (isOpen) {
      notificationService.getAllNotifications().then(setNotifications);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id: string) => {
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-white border border-[var(--border)] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
        <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Workshop Alerts
            </span>
          </div>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check className="h-3 w-3" />
            Mark all read
          </button>
        </div>

        <div className="max-h-[360px] overflow-y-auto divide-y divide-[var(--border)]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
              No notifications currently.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 transition-colors flex items-start justify-between gap-3 ${
                  n.isRead ? "bg-white" : "bg-blue-50/40"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />}
                    <h4 className="text-xs font-bold text-[var(--foreground)] truncate">{n.title}</h4>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-stone-400">
                    <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <Link
                      href={n.link}
                      onClick={onClose}
                      className="text-[var(--primary)] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n.id)}
                      title="Mark as read"
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(n.id)}
                    title="Delete alert"
                    className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-t border-[var(--border)] bg-stone-50 text-center text-[11px] text-[var(--muted-foreground)]">
          Mock real-time workshop alert simulator
        </div>
      </div>
    </>
  );
}
