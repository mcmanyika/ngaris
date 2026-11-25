"use client";

import {
  BadgeCheck,
  CheckCircle2,
  FolderKanban,
  Handshake,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/landing/reveal";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Providers",
    description:
      "We vet contractors and trades so you only shortlist people we trust.",
    hint: (
      <div className="mt-auto space-y-2 pt-6">
        <div className="flex items-center justify-between rounded-lg border border-[#032842]/[0.06] bg-[#F7F9FB] px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-[#032842]">
              Horizon Builders
            </p>
            <p className="text-[10px] text-[#032842]/40">Harare · Structural</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/10">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        </div>
        <p className="text-[10px] text-[#032842]/40">
          Checks: refs · insurance · past work
        </p>
      </div>
    ),
  },
  {
    icon: Handshake,
    title: "Select Together",
    description:
      "We shortlist options and decide with you — not behind your back.",
    hint: (
      <div className="mt-auto space-y-2 pt-6">
        {[
          { name: "Option A · Fit-out", status: "Recommended" },
          { name: "Option B · Fit-out", status: "Shortlisted" },
        ].map((row, i) => (
          <div
            key={row.name}
            className="flex items-center justify-between rounded-lg border border-[#032842]/[0.06] bg-white px-3 py-2"
          >
            <p className="truncate text-[11px] font-medium text-[#032842]">
              {row.name}
            </p>
            <span
              className={`text-[10px] font-semibold ${
                i === 0 ? "text-[#EDB254]" : "text-[#032842]/40"
              }`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "We coordinate the build — schedules, site, and day-to-day delivery.",
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
    icon: Users,
    title: "Client Oversight",
    description:
      "Approvals, spend, and site updates — clear for diaspora owners abroad.",
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
          Site report ready · Your review
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
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#032842] sm:text-[2.15rem]">
            Find the right team. We manage the rest.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#032842]/55 sm:text-[15px]">
            Ngaris Managed connects clients — especially the diaspora — with
            verified service providers, helps you select together, and runs the
            project with clear oversight from anywhere.
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
