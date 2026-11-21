"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { AlertTriangle } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100/60 text-[var(--foreground)] flex flex-col font-sans">
      {/* Dev Warning / Prototype Banner */}
      <div className="bg-amber-500 text-amber-950 px-4 lg:px-8 py-2 text-xs font-semibold flex items-center justify-between z-40 border-b border-amber-600">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-900" />
            <span>
              <strong>Frontend Prototype Mode:</strong> Dedicated e-commerce operations dashboard.
              Data persists locally via browser storage. No real production database or cloud service is connected.
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] bg-amber-600/30 px-2 py-0.5 rounded-sm">
            Phase 1: Frontend Only
          </span>
        </div>
      </div>

      <div className="flex-1 flex w-full">
        {/* Responsive Collapsible Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onOpenMobile={() => setMobileOpen(true)} />

          <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 max-w-[1440px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
