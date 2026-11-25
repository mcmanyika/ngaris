"use client";

import {
  Briefcase,
  Cpu,
  FolderKanban,
  Handshake,
  Landmark,
  Scale,
} from "lucide-react";

import { Reveal } from "@/components/landing/reveal";

const management = [
  {
    icon: Scale,
    role: "Executive Chair",
    focus: "Governance",
    summary:
      "Sets accountability standards across provider verification and client outcomes.",
    initials: "EC",
  },
  {
    icon: Briefcase,
    role: "Managing Director",
    focus: "Delivery",
    summary:
      "Owns end-to-end project delivery — from shortlist to handover on site.",
    initials: "MD",
  },
  {
    icon: Cpu,
    role: "Technology Director",
    focus: "Platform",
    summary:
      "Builds the systems that keep selection, approvals, and progress visible.",
    initials: "TD",
  },
  {
    icon: FolderKanban,
    role: "Project Management",
    focus: "Site & schedule",
    summary:
      "Coordinates contractors, milestones, and day-to-day site execution.",
    initials: "PM",
  },
  {
    icon: Landmark,
    role: "Finance",
    focus: "Controls",
    summary:
      "Tracks budgets, payments, and approvals so spend stays transparent.",
    initials: "FO",
  },
  {
    icon: Handshake,
    role: "Client Relations",
    focus: "Diaspora care",
    summary:
      "Keeps owners abroad informed and involved in provider selection decisions.",
    initials: "CR",
  },
];

export function ManagementCards() {
  return (
    <section className="bg-[#F4F7FA] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#EDB254] uppercase">
            Leadership
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#032842]">
            Management
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#032842]/55 sm:text-[15px]">
            A lean leadership bench covering verification, joint selection,
            project delivery, and client oversight.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {management.map((person, index) => (
            <Reveal key={person.role} delayMs={index * 60}>
              <article className="feature-card flex h-full flex-col p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#032842] text-sm font-semibold tracking-wide text-white">
                      {person.initials}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight text-[#032842]">
                        {person.role}
                      </h3>
                      <p className="text-[12px] text-[#EDB254]">{person.focus}</p>
                    </div>
                  </div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#032842]/[0.04] text-[#032842]/55">
                    <person.icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-[#032842]/55">
                  {person.summary}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
