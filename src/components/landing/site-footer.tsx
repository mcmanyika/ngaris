"use client";

import { Home } from "lucide-react";
import Link from "next/link";

import { ConsultationModal } from "@/components/landing/consultation-modal";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#032842]/8 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-[#032842]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#EDB254]/15 text-[#EDB254]">
            <Home className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold">
            Ngaris <span className="text-[#EDB254]">Managed</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-[#032842]/55">
          <Link href="/about" className="transition-colors hover:text-[#032842]">
            About
          </Link>
          <ConsultationModal
            trigger={
              <button
                type="button"
                className="transition-colors hover:text-[#032842]"
              >
                Get a Quote
              </button>
            }
          />
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
