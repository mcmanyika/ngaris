"use client";

import {
  BarChart3,
  CheckCircle2,
  ImageIcon,
  Laptop,
  ShieldCheck,
} from "lucide-react";

import { Reveal } from "@/components/landing/reveal";

const features = [
  {
    icon: Laptop,
    title: "Project Tracking",
    description: "Phase, timeline, and ownership in one live view.",
    hint: (
      <div className="mt-auto space-y-3 pt-6">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-[#032842]/55">Foundation</span>
          <span className="font-semibold tabular-nums text-[#032842]">68%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#032842]/[0.06]">
          <div className="feature-meter h-full w-[68%] rounded-full bg-gradient-to-r from-[#032842] to-[#4F7FA3]" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#032842]/40">
          <span>On schedule</span>
          <span>Updated 2h ago</span>
        </div>
      </div>
    ),
  },
  {
    icon: ImageIcon,
    title: "Site Updates",
    description: "Photo reports and notes from the ground.",
    hint: (
      <div className="mt-auto space-y-2.5 pt-6">
        <div className="grid grid-cols-3 gap-1.5">
          {["from-[#9BB8CE]", "from-[#7BA3C4]", "from-[#5F8BB0]"].map(
            (tone, i) => (
              <div
                key={tone}
                className={`aspect-[4/3] rounded-md bg-gradient-to-br ${tone} to-[#E8EEF3] ring-1 ring-[#032842]/5`}
                style={{ opacity: 1 - i * 0.12 }}
              />
            ),
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#032842]/45">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          3 new photos · Harare site
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Approvals",
    description: "Clear decisions with a full audit trail.",
    hint: (
      <div className="mt-auto space-y-2 pt-6">
        <div className="flex items-center justify-between rounded-lg border border-[#032842]/[0.06] bg-[#F7F9FB] px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-[#032842]">
              Material drawdown
            </p>
            <p className="text-[10px] text-[#032842]/40">Awaiting you</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/10">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        </div>
        <p className="text-[10px] text-[#032842]/40">Signed · 14 Mar 2026</p>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: "Cost Control",
    description: "Budget vs spend before surprises land.",
    hint: (
      <div className="mt-auto space-y-3 pt-6">
        <div className="flex h-12 items-end gap-1.5">
          {[36, 58, 44, 78, 52, 66].map((h, i) => (
            <div
              key={i}
              className="feature-bar flex-1 rounded-sm bg-[#032842]/15 first:bg-[#032842]/25 last:bg-[#EDB254]"
              style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#032842]/40">Budget used</span>
          <span className="font-semibold tabular-nums text-[#032842]">
            $42.8k / $65k
          </span>
        </div>
      </div>
    ),
  },
];

export function CoreFeatures() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#F4F7FA] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-xl sm:mx-auto sm:text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#EDB254] uppercase">
            Platform
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#032842] sm:text-[2.15rem]">
            Built for remote oversight
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#032842]/55 sm:text-[15px]">
            Everything your team needs to run construction and property work —
            visible, decision-ready, and easy to act on from abroad.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delayMs={index * 80}>
              <article className="feature-card group flex h-full flex-col p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#032842] text-white shadow-[0_8px_20px_rgba(3,40,66,0.18)] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <feature.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.14em] text-[#032842]/25 uppercase tabular-nums">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight text-[#032842]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-[#032842]/50">
                  {feature.description}
                </p>
                {feature.hint}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
