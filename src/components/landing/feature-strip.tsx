"use client";

import {
  ClipboardCheck,
  FolderKanban,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Reveal } from "@/components/landing/reveal";

const items = [
  { icon: FolderKanban, label: "Projects", meta: "Live status" },
  { icon: ClipboardCheck, label: "Site Reports", meta: "Weekly digests" },
  { icon: ShieldCheck, label: "Approvals", meta: "One-tap sign-off" },
  { icon: Wallet, label: "Finance", meta: "Budget clarity" },
];

export function FeatureStrip() {
  return (
    <section className="relative z-10 -mt-px border-y border-[#032842]/[0.06] bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={item.label}
                className="group relative flex items-center gap-3 px-3 py-5 sm:justify-center sm:px-4 sm:py-6"
              >
                {index > 0 ? (
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-0 hidden h-8 w-px -translate-y-1/2 bg-[#032842]/10 sm:block"
                  />
                ) : null}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#032842]/[0.04] text-[#032842]/70 transition-colors duration-300 group-hover:bg-[#EDB254]/15 group-hover:text-[#032842]">
                  <item.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight text-[#032842]">
                    {item.label}
                  </p>
                  <p className="truncate text-[11px] text-[#032842]/45">
                    {item.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
