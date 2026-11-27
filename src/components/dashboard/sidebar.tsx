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
          "group/sidebar fixed inset-y-0 left-0 z-50 flex flex-col bg-[#022848] text-white transition-[width,transform] duration-200 ease-out",
          // Mobile drawer
          "w-[16.5rem]",
          open ? "translate-x-0" : "-translate-x-full",
          // Desktop icon rail → expand on hover/focus
          "lg:w-[4.5rem] lg:translate-x-0 lg:hover:w-[16.5rem] lg:focus-within:w-[16.5rem]",
        )}
      >
        <div className="flex items-center justify-between gap-3 overflow-hidden px-3 pt-5 pb-4 lg:justify-center lg:group-hover/sidebar:justify-between lg:group-hover/sidebar:px-4 lg:group-focus-within/sidebar:justify-between lg:group-focus-within/sidebar:px-4">
          <Link
            href={homeHref}
            className="shrink-0 rounded-md bg-white p-1.5 shadow-sm lg:group-hover/sidebar:px-2 lg:group-hover/sidebar:py-1.5 lg:group-focus-within/sidebar:px-2 lg:group-focus-within/sidebar:py-1.5"
            onClick={() => setOpen(false)}
            title="Home"
          >
            <Image
              src="/brand/logo.png"
              alt="Ngaris Construction"
              width={140}
              height={36}
              className="h-7 w-7 object-contain lg:group-hover/sidebar:w-auto lg:group-focus-within/sidebar:w-auto"
              priority
            />
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-hidden px-3 lg:px-2 lg:group-hover/sidebar:px-3 lg:group-focus-within/sidebar:px-3">
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  "lg:justify-center lg:gap-0 lg:px-0",
                  "lg:group-hover/sidebar:justify-start lg:group-hover/sidebar:gap-3 lg:group-hover/sidebar:px-3",
                  "lg:group-focus-within/sidebar:justify-start lg:group-focus-within/sidebar:gap-3 lg:group-focus-within/sidebar:px-3",
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/65 hover:bg-white/6 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span
                  className={cn(
                    "whitespace-nowrap",
                    "lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:transition-[max-width,opacity] lg:duration-200",
                    "lg:group-hover/sidebar:max-w-[12rem] lg:group-hover/sidebar:opacity-100",
                    "lg:group-focus-within/sidebar:max-w-[12rem] lg:group-focus-within/sidebar:opacity-100",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto overflow-hidden border-t border-white/10 px-4 py-4 lg:px-2 lg:group-hover/sidebar:px-4 lg:group-focus-within/sidebar:px-4">
          {email ? (
            <p
              className={cn(
                "mb-3 truncate text-xs text-white/45",
                "lg:hidden lg:group-hover/sidebar:block lg:group-focus-within/sidebar:block",
              )}
              title={email}
            >
              {email}
            </p>
          ) : null}
          <button
            type="button"
            disabled={pending}
            title={pending ? "Signing out…" : "Sign out"}
            onClick={() => void onLogout()}
            className={cn(
              "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 text-sm text-white/85 transition-colors hover:border-white/35 hover:text-white disabled:opacity-50",
              "lg:gap-0 lg:px-0",
              "lg:group-hover/sidebar:gap-2 lg:group-hover/sidebar:px-3",
              "lg:group-focus-within/sidebar:gap-2 lg:group-focus-within/sidebar:px-3",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap",
                "lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:transition-[max-width,opacity] lg:duration-200",
                "lg:group-hover/sidebar:max-w-[12rem] lg:group-hover/sidebar:opacity-100",
                "lg:group-focus-within/sidebar:max-w-[12rem] lg:group-focus-within/sidebar:opacity-100",
              )}
            >
              {pending ? "Signing out…" : "Sign out"}
            </span>
          </button>
        </div>
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
      <div className="min-h-dvh lg:pl-[4.5rem]">
        <main className="min-h-dvh px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
