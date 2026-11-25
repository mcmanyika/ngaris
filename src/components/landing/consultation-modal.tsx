"use client";

import type { ReactElement } from "react";

import { ConsultationFormPanel } from "@/components/landing/consultation-form-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ConsultationModalProps = {
  trigger: ReactElement;
};

export function ConsultationModal({ trigger }: ConsultationModalProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0D2536] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-display)] text-xl text-white">
            Book a consultation
          </DialogTitle>
          <DialogDescription className="text-white/65">
            Tell us about the build. We’ll follow up securely.
          </DialogDescription>
        </DialogHeader>
        <ConsultationFormPanel />
      </DialogContent>
    </Dialog>
  );
}
