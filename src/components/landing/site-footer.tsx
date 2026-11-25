"use client";

import { ConsultationModal } from "@/components/landing/consultation-modal";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0D2536] py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl">
            Ngaris <span className="text-[#C49A55]">Managed</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
            Construction ops software for Zimbabwe builds.
          </p>
        </div>
        <div className="text-sm text-white/55">
          <ConsultationModal
            trigger={
              <button
                type="button"
                className="transition-colors duration-300 hover:text-[#C49A55]"
              >
                Book a consultation
              </button>
            }
          />
          <p className="mt-3">© 2026 Ngaris Managed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
