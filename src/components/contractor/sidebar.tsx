"use client";

import { Home, UserRound } from "lucide-react";

import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/dashboard/sidebar";

const items: DashboardNavItem[] = [
  { href: "/contractor", label: "Home", icon: Home, exact: true },
  { href: "/contractor/profile", label: "Profile", icon: UserRound },
];

export function ContractorShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      email={email}
      homeHref="/contractor"
      logoutRedirect="/contractor/login"
      items={items}
    >
      {children}
    </DashboardShell>
  );
}
