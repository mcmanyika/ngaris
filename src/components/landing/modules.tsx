"use client";

import {
  ClipboardCheck,
  HardHat,
  LineChart,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  ApprovalsMock,
  DashboardMock,
  MessagesMock,
  ProgressMock,
} from "@/components/landing/app-mocks";
import { ProductWindow } from "@/components/landing/product-window";
import { Reveal } from "@/components/landing/reveal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Module = {
  icon: LucideIcon;
  title: string;
  blurb: string;
  modalTitle: string;
  mock: ReactNode;
};

const modules: Module[] = [
  {
    icon: HardHat,
    title: "Projects",
    blurb: "Live status, members, milestones.",
    modalTitle: "Project workspace",
    mock: <DashboardMock />,
  },
  {
    icon: ClipboardCheck,
    title: "Site reports",
    blurb: "Verified photos & inspections.",
    modalTitle: "Progress verification",
    mock: <ProgressMock />,
  },
  {
    icon: ShieldCheck,
    title: "Approvals",
    blurb: "Variations & payments gated.",
    modalTitle: "Approval queue",
    mock: <ApprovalsMock />,
  },
  {
    icon: LineChart,
    title: "Client portal",
    blurb: "Secure updates for owners.",
    modalTitle: "Client messages",
    mock: <MessagesMock />,
  },
];

export function Modules() {
  return (
    <section id="product" className="scroll-mt-20 bg-[#F8FAFC] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.14em] text-[#C49A55] uppercase">
              Product
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[#15334A]">
              Built like software. Run like a site office.
            </h2>
          </div>
          <p className="max-w-xs text-sm text-[#15334A]/65">
            Tap a module to preview the interface.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, index) => (
            <Dialog key={mod.title}>
              <Reveal delayMs={index * 80}>
                <DialogTrigger className="animated-card group flex h-full w-full cursor-pointer flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[#C49A55]/50">
                  <div className="card-icon relative z-[1] mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#15334A] text-[#C49A55]">
                    <mod.icon className="h-4 w-4" />
                  </div>
                  <h3 className="relative z-[1] font-[family-name:var(--font-display)] text-lg text-[#15334A]">
                    {mod.title}
                  </h3>
                  <p className="relative z-[1] mt-1 text-sm text-[#15334A]/65">
                    {mod.blurb}
                  </p>
                  <span className="relative z-[1] mt-4 text-xs font-medium text-[#C49A55]">
                    Preview →
                  </span>
                </DialogTrigger>
              </Reveal>
              <DialogContent className="max-w-lg border-[#15334A]/10 bg-[#F8FAFC] p-0 sm:max-w-xl">
                <DialogHeader className="border-b border-[#15334A]/8 px-4 pt-4 pb-3">
                  <DialogTitle className="font-[family-name:var(--font-display)] text-[#15334A]">
                    {mod.modalTitle}
                  </DialogTitle>
                  <DialogDescription className="text-[#15334A]/65">
                    Interactive preview of the {mod.title.toLowerCase()} module.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-3 sm:p-4">
                  <ProductWindow title={mod.title}>{mod.mock}</ProductWindow>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
