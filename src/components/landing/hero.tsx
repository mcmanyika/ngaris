"use client";

import { ArrowUpRight } from "lucide-react";

import { DashboardMock } from "@/components/landing/app-mocks";
import { ConsultationModal } from "@/components/landing/consultation-modal";
import { ProductTourModal } from "@/components/landing/product-tour-modal";
import { ProductWindow } from "@/components/landing/product-window";
import { Reveal } from "@/components/landing/reveal";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0D2536] pt-24 pb-16 text-white sm:pt-28 sm:pb-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,154,85,0.14),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(21,51,74,0.9),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(196,154,85,0.4)_1px,transparent_0)] [background-size:24px_24px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-8">
        <div>
          <p className="animate-fade-up font-[family-name:var(--font-display)] text-2xl tracking-tight text-[#C49A55] sm:text-3xl">
            Ngaris Managed
          </p>
          <div
            className="animate-draw-line mt-3 mb-5 h-px w-16 bg-[#C49A55]"
            aria-hidden
          />
          <h1 className="animate-fade-up animation-delay-100 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Build in Zimbabwe.
            <br />
            Manage from Anywhere.
          </h1>
          <p className="animate-fade-up animation-delay-200 mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Construction ops software for diaspora owners and local teams —
            progress, approvals, and payments in one workspace.
          </p>
          <div className="animate-fade-up animation-delay-300 mt-7 flex flex-wrap gap-3">
            <ConsultationModal
              trigger={
                <button
                  type="button"
                  className="cta-shine inline-flex h-11 items-center rounded-lg bg-[#C49A55] px-5 text-sm font-medium text-[#0D2536] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#d4ae6d]"
                >
                  Book consultation
                </button>
              }
            />
            <ProductTourModal
              trigger={
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-medium text-white backdrop-blur-sm transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Open product tour
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              }
            />
          </div>
        </div>

        <Reveal className="animate-fade-up animation-delay-200">
          <ProductWindow title="dashboard">
            <DashboardMock />
          </ProductWindow>
        </Reveal>
      </div>
    </section>
  );
}
