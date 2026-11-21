import React from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Operations Dashboard — NewtronLabs Workshop",
  description: "Comprehensive frontend-only e-commerce operations system for NewtronLabs.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
