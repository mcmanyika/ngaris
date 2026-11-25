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
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#032842]/10 bg-[#032842] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Get a Quote
          </DialogTitle>
          <DialogDescription className="text-white/65">
            Tell us about your project. We’ll follow up securely.
          </DialogDescription>
        </DialogHeader>
        <ConsultationFormPanel />
      </DialogContent>
    </Dialog>
  );
}
