"use client";

import Image from "next/image";

import { ConsultationModal } from "@/components/landing/consultation-modal";
import { Reveal } from "@/components/landing/reveal";

export function DiasporaCta() {
  return (
    <section id="diaspora" className="scroll-mt-20 bg-[#F7F9FB] pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl bg-[#032842] text-white shadow-[0_24px_60px_rgba(10,31,51,0.25)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[220px] lg:min-h-full">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                alt="Modern residence at dusk"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#032842]/40 lg:bg-gradient-to-r lg:from-transparent lg:to-[#032842]/55" />
            </div>

            <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-12">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#EDB254] uppercase">
                  For the Diaspora
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Your Property, In Control.
                </h2>
              </div>
              <ConsultationModal
                trigger={
                  <button
                    type="button"
                    className="inline-flex h-11 shrink-0 items-center rounded-lg bg-[#EDB254] px-5 text-sm font-semibold text-[#032842] transition-colors hover:bg-[#f2bc60]"
                  >
                    Request a Consultation →
                  </button>
                }
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
