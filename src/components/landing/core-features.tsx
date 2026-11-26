"use client";

import {
  BarChart3,
  Building2,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/landing/reveal";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Providers",
    description: "Vetted contractors and trades you can trust.",
    hint: (
      <div className="mt-auto space-y-3 pt-7">
        <div className="flex items-center gap-3 rounded-2xl bg-[#F3F6F9] px-3.5 py-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#032842] shadow-sm">
            <Building2 className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#032842]">
              Horizon Builders
            </p>
            <p className="truncate text-[11px] text-[#032842]/45">
              Harare · Structural
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#3B82F6]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#032842]/45">
          {["Refs", "Insurance", "Past work"].map((item) => (
            <span key={item} className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Layers,
    title: "Select Together",
    description: "Shortlist options and decide with your team.",
    hint: (
      <div className="mt-auto space-y-2 pt-7">
        {[
          {
            name: "Option A · Fit-out",
            status: "Recommended",
            active: true,
          },
          {
            name: "Option B · Fit-out",
            status: "Shortlisted",
            active: false,
          },
        ].map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-2 rounded-2xl bg-[#F3F6F9] px-3.5 py-3"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                  row.active
                    ? "border-[#3B82F6] bg-[#3B82F6] shadow-[inset_0_0_0_2px_#fff]"
                    : "border-[#032842]/20 bg-white"
                }`}
              />
              <p className="truncate text-[13px] font-medium text-[#032842]">
                {row.name}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                row.active
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#E8EEF3] text-[#032842]/50"
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
    icon: CalendarCheck2,
    title: "Project Management",
    description: "Coordinate the build — schedules, site, and delivery.",
    hint: (
      <div className="mt-auto space-y-3 pt-7">
        <div className="rounded-2xl bg-[#F3F6F9] px-3.5 py-3.5">
          <div className="mb-2.5 flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#032842]/55">Foundation</span>
            <span className="font-semibold tabular-nums text-[#032842]">68%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#D9E2EA]">
            <div className="feature-meter h-full w-[68%] rounded-full bg-[#032842]" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px] text-[#032842]/45">
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            On schedule
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Updated 2h ago
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    title: "Client Oversight",
    description: "Approvals, spend, and site updates — clear for owners abroad.",
    hint: (
      <div className="mt-auto space-y-3 pt-7">
        <div className="grid grid-cols-3 gap-2">
          {[FileText, Database, BarChart3].map((Icon) => (
            <div
              key={Icon.displayName ?? Icon.name}
              className="flex aspect-square items-center justify-center rounded-2xl bg-[#F3F6F9] text-[#032842]/55"
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#032842]/50">
          <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
          Site report ready · Your review
        </div>
      </div>
    ),
  },
];

export function CoreFeatures() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#EEF2F6] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 sm:text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#EDB254] uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-[clamp(1.15rem,4.2vw,2.15rem)] font-bold tracking-tight text-[#032842] whitespace-nowrap">
            Find the right team. We manage the rest.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#032842]/55 sm:text-[15px]">
            Ngaris Construction connects clients — especially the diaspora — with
            verified service providers, helps you select together, and runs the
            project with clear oversight from anywhere.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delayMs={index * 80}>
              <article className="feature-card group flex h-full flex-col p-6 sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#032842] text-white shadow-[0_10px_24px_rgba(3,40,66,0.18)] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="pt-1 text-sm font-medium tabular-nums text-[#032842]/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[#032842]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#032842]/50">
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
