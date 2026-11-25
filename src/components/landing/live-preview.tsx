"use client";

import { ProgressMock } from "@/components/landing/app-mocks";
import { ProductWindow } from "@/components/landing/product-window";
import { Reveal } from "@/components/landing/reveal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LivePreview() {
  return (
    <section
      id="preview"
      className="scroll-mt-20 bg-[#15334A] py-16 text-white sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="text-sm font-medium tracking-[0.14em] text-[#C49A55] uppercase">
            Live preview
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Owner view without the noise.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Approved media, milestones, and messages — never contractor margins
            or other clients.
          </p>
          <Dialog>
            <DialogTrigger className="cta-shine mt-6 inline-flex h-10 items-center rounded-lg bg-[#C49A55] px-4 text-sm font-medium text-[#0D2536] transition-transform hover:-translate-y-0.5">
              Expand client portal
            </DialogTrigger>
            <DialogContent className="max-w-lg border-white/10 bg-[#0D2536] p-0 text-white sm:max-w-xl">
              <DialogHeader className="border-b border-white/10 px-4 pt-4 pb-3">
                <DialogTitle className="font-[family-name:var(--font-display)] text-white">
                  Client portal
                </DialogTitle>
              </DialogHeader>
              <div className="p-3 sm:p-4">
                <ProductWindow title="client-portal">
                  <ProgressMock />
                </ProductWindow>
              </div>
            </DialogContent>
          </Dialog>
        </Reveal>

        <Reveal delayMs={120}>
          <ProductWindow
            title="client-portal"
            className="animated-card-dark border-0"
          >
            <ProgressMock />
          </ProductWindow>
        </Reveal>
      </div>
    </section>
  );
}
