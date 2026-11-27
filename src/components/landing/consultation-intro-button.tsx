"use client";

import { ConsultationModal } from "@/components/landing/consultation-modal";

export function ConsultationIntroButton() {
  return (
    <ConsultationModal
      trigger={
        <button
          type="button"
          className="inline-flex h-11 shrink-0 items-center rounded-lg bg-[#032842] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Request an introduction →
        </button>
      }
    />
  );
}
