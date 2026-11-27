"use client";

import {
  Building2,
  FolderKanban,
  Home,
  Inbox,
  ShieldCheck,
} from "lucide-react";

import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/dashboard/sidebar";

const baseItems: DashboardNavItem[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/providers", label: "Contractors", icon: Building2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

const adminItems: DashboardNavItem[] = [
  ...baseItems,
  { href: "/admin/users", label: "Users", icon: ShieldCheck },
];

export function AdminShell({
  email,
  isAdmin = false,
  children,
}: {
  email: string | null;
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      email={email}
      homeHref="/admin"
      logoutRedirect="/admin/login"
      items={isAdmin ? adminItems : baseItems}
    >
      {children}
    </DashboardShell>
  );
}
