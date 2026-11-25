"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ConsultationModal } from "@/components/landing/consultation-modal";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "Workflow" },
  { href: "#preview", label: "Preview" },
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
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-[400ms]",
        scrolled || open
          ? "bg-[#0D2536]/92 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight text-white transition-opacity hover:opacity-90 sm:text-xl"
        >
          Ngaris <span className="text-[#C49A55]">Managed</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link text-sm text-white/78 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <ConsultationModal
            trigger={
              <button
                type="button"
                className="cta-shine inline-flex h-9 items-center rounded-lg bg-[#C49A55] px-3.5 text-sm font-medium text-[#0D2536] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#d4ae6d]"
              >
                Book Consultation
              </button>
            }
          />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-white transition-transform duration-200 active:scale-95 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-[#0D2536] transition-[max-height,opacity] duration-[350ms] md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 border-transparent opacity-0",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 px-1" onClick={() => setOpen(false)}>
            <ConsultationModal
              trigger={
                <button
                  type="button"
                  className="w-full rounded-md bg-[#C49A55] px-3 py-2.5 text-center text-sm font-medium text-[#0D2536]"
                >
                  Book Consultation
                </button>
              }
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
