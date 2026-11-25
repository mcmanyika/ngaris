"use client";

import { Reveal } from "@/components/landing/reveal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const steps = [
  {
    step: "01",
    title: "Scope",
    detail:
      "Capture brief, budget band, and location. Create the managed delivery plan with milestone checkpoints.",
  },
  {
    step: "02",
    title: "Kickoff",
    detail:
      "Assign verified contractors, lock contracts, and open the project workspace for your team.",
  },
  {
    step: "03",
    title: "Oversee",
    detail:
      "Supervisors upload reports. Inspections close loops. Variations require formal approval before spend.",
  },
  {
    step: "04",
    title: "Pay & hand over",
    detail:
      "Payments follow verified milestones. Owners receive documents, photos, and a clean handover pack.",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8">
          <p className="text-sm font-medium tracking-[0.14em] text-[#C49A55] uppercase">
            Workflow
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[#15334A]">
            Four steps. Open any stage.
          </h2>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <Dialog key={item.step}>
              <Reveal delayMs={index * 70}>
                <DialogTrigger className="animated-card group flex h-full w-full cursor-pointer flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[#C49A55]/50">
                  <span className="relative z-[1] font-[family-name:var(--font-display)] text-3xl text-[#C49A55]/45 transition-colors group-hover:text-[#C49A55]">
                    {item.step}
                  </span>
                  <span className="relative z-[1] mt-3 font-[family-name:var(--font-display)] text-lg text-[#15334A]">
                    {item.title}
                  </span>
                  <span className="relative z-[1] mt-auto pt-4 text-xs font-medium text-[#C49A55]">
                    View stage →
                  </span>
                </DialogTrigger>
              </Reveal>
              <DialogContent className="border-[#15334A]/10 bg-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-[family-name:var(--font-display)] text-[#15334A]">
                    {item.step} · {item.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed text-[#15334A]/75">
                    {item.detail}
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border border-[#15334A]/8 bg-[#F8FAFC] p-3 text-xs text-[#15334A]/70">
                  Stage controls, documents, and approvals surface here in the
                  live product.
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
