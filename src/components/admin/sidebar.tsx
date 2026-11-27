"use client";

import { Building2, FolderKanban, Home, Inbox } from "lucide-react";

import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/dashboard/sidebar";

const items: DashboardNavItem[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/providers", label: "Contractors", icon: Building2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

export function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      email={email}
      homeHref="/admin"
      logoutRedirect="/admin/login"
      items={items}
    >
      {children}
    </DashboardShell>
  );
}
