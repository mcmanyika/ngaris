"use client";

import type { ReactElement } from "react";

import { TabletMock } from "@/components/landing/tablet-mock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProductTourModalProps = {
  trigger: ReactElement;
};

export function ProductTourModal({ trigger }: ProductTourModalProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#032842]/10 bg-[#032842] p-0 text-white sm:max-w-lg">
        <DialogHeader className="border-b border-white/10 px-4 pt-4 pb-3">
          <DialogTitle className="text-base font-semibold text-white">
            See how it works
          </DialogTitle>
          <DialogDescription className="sr-only">
            Product overview
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <TabletMock />
        </div>
      </DialogContent>
    </Dialog>
  );
}
