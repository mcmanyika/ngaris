"use client";

import { Reveal } from "@/components/landing/reveal";

export function AboutIntro() {
  return (
    <section className="relative overflow-hidden bg-[#022848] pt-28 pb-16 text-white sm:pt-32 sm:pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 70% 20%, #1a4a6e 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 15% 80%, #0d3555 0%, transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#EDB254] uppercase">
            About us
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Built to make Zimbabwe projects accountable from anywhere.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
            Ngaris Construction is a platform for diaspora and local clients who need
            verified service providers, joint selection, and professional project
            management — without guessing from abroad.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Verify", detail: "Providers we trust" },
              { label: "Select", detail: "Decisions with you" },
              { label: "Manage", detail: "Delivery on the ground" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-sm font-semibold text-[#EDB254]">{item.label}</p>
                <p className="mt-0.5 text-[13px] text-white/60">{item.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
