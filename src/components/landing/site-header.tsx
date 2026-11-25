"use client";

import { Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ConsultationModal } from "@/components/landing/consultation-modal";
import { cn } from "@/lib/utils";

const HERO_NAVY = "#022848";
const HERO_GOLD = "#EDB254";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#diaspora", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        scrolled || open
          ? "border-b border-white/10 backdrop-blur-md"
          : "border-b border-transparent",
      )}
      style={{
        backgroundColor:
          scrolled || open ? "rgba(2, 40, 72, 0.82)" : "transparent",
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "rgba(237, 178, 84, 0.16)",
              color: HERO_GOLD,
            }}
          >
            <Home className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Ngaris <span style={{ color: HERO_GOLD }}>Managed</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg border border-white/25 px-3.5 text-sm text-white/90 transition-colors hover:border-white/45 hover:text-white"
          >
            Client Login
          </button>
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
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2.5 text-sm text-white/85"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="mt-1 rounded-md border border-white/20 px-3 py-2.5 text-sm text-white"
          >
            Client Login
          </button>
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
