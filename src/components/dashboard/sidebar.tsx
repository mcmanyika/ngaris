"use client";

import type { LucideIcon } from "lucide-react";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export function DashboardSidebar({
  email,
  homeHref,
  logoutRedirect,
  items,
}: {
  email: string | null;
  homeHref: string;
  logoutRedirect: string;
  items: DashboardNavItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function onLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace(logoutRedirect);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const nav = (
    <>
      <div className="flex items-center justify-between gap-3 px-4 pt-5 pb-4">
        <Link
          href={homeHref}
          className="rounded-md bg-white px-2 py-1.5 shadow-sm"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/logo.png"
            alt="Ngaris Construction"
            width={140}
            height={36}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/80 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/12 text-white"
                  : "text-white/65 hover:bg-white/6 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-4">
        {email ? (
          <p className="mb-3 truncate text-xs text-white/45" title={email}>
            {email}
          </p>
        ) : null}
        <button
          type="button"
          disabled={pending}
          onClick={() => void onLogout()}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 text-sm text-white/85 transition-colors hover:border-white/35 hover:text-white disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#032842]/10 bg-[#022848] px-4 text-white lg:hidden">
        <Link
          href={homeHref}
          className="rounded-md bg-white px-2 py-1 shadow-sm"
        >
          <Image
            src="/brand/logo.png"
            alt="Ngaris Construction"
            width={120}
            height={32}
            className="h-6 w-auto"
          />
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[16.5rem] flex-col bg-[#022848] text-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {nav}
      </aside>
    </>
  );
}

export function DashboardShell({
  email,
  homeHref,
  logoutRedirect,
  items,
  children,
}: {
  email: string | null;
  homeHref: string;
  logoutRedirect: string;
  items: DashboardNavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#F4F7FA] text-[#032842]">
      <DashboardSidebar
        email={email}
        homeHref={homeHref}
        logoutRedirect={logoutRedirect}
        items={items}
      />
      <div className="min-h-dvh lg:pl-[16.5rem]">
        <main className="min-h-dvh px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
