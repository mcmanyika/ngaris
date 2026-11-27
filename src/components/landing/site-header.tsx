"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ConsultationModal } from "@/components/landing/consultation-modal";
import { cn } from "@/lib/utils";

const HERO_NAVY = "#022848";
const HERO_GOLD = "#EDB254";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "How it works" },
  { href: "/#contractors", label: "Contractors" },
  { href: "/#diaspora", label: "Diaspora" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const solid = pathname !== "/" || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300",
        solid
          ? "border-b border-white/10 backdrop-blur-md"
          : "border-b border-transparent",
      )}
      style={{
        backgroundColor: solid ? "rgba(2, 40, 72, 0.82)" : "transparent",
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm"
        >
          <Image
            src="/brand/logo.png"
            alt="Ngaris Construction"
            width={180}
            height={48}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/about"
                ? pathname === "/about"
                : item.href === "/"
                  ? pathname === "/"
                  : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors hover:text-white",
                  active ? "text-white" : "text-white/75",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/contractor/apply"
            className="inline-flex h-9 items-center rounded-lg border border-white/25 px-3.5 text-sm text-white/90 transition-colors hover:border-white/45 hover:text-white"
          >
            For contractors
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex h-9 items-center rounded-lg border border-white/25 px-3.5 text-sm text-white/90 transition-colors hover:border-white/45 hover:text-white"
          >
            Admin Login
          </Link>
          <ConsultationModal
            trigger={
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: HERO_GOLD, color: HERO_NAVY }}
              >
                Get a Quote →
              </button>
            }
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-white md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/10 md:hidden",
          open ? "block" : "hidden",
        )}
        style={{ backgroundColor: "rgba(2, 40, 72, 0.96)" }}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2.5 text-sm text-white/85"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contractor/apply"
            className="mt-1 rounded-md border border-white/20 px-3 py-2.5 text-sm text-white"
            onClick={() => setOpen(false)}
          >
            For contractors
          </Link>
          <Link
            href="/admin/login"
            className="rounded-md border border-white/20 px-3 py-2.5 text-sm text-white"
            onClick={() => setOpen(false)}
          >
            Admin Login
          </Link>
          <div className="mt-1" onClick={() => setOpen(false)}>
            <ConsultationModal
              trigger={
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2.5 text-sm font-semibold"
                  style={{ backgroundColor: HERO_GOLD, color: HERO_NAVY }}
                >
                  Get a Quote →
                </button>
              }
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
