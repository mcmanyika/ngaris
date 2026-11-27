"use client";

import Image from "next/image";
import Link from "next/link";

import { ConsultationModal } from "@/components/landing/consultation-modal";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#032842]/8 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-[#032842]/8"
        >
          <Image
            src="/brand/logo.png"
            alt="Ngaris Construction"
            width={160}
            height={42}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#032842]/55">
          <Link href="/about" className="transition-colors hover:text-[#032842]">
            About
          </Link>
          <Link
            href="/contractor/apply"
            className="transition-colors hover:text-[#032842]"
          >
            For contractors
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
