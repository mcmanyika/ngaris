"use client";

import {
  cloneElement,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
} from "react";

import { ConsultationFormPanel } from "@/components/landing/consultation-form-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConsultationModalProps = {
  trigger: ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    className?: string;
    style?: CSSProperties;
  }>;
};

export function ConsultationModal({ trigger }: ConsultationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {cloneElement(trigger, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (!event.defaultPrevented) {
            setOpen(true);
          }
        },
      })}
      <DialogContent className="flex max-h-[min(90vh,40rem)] flex-col gap-0 overflow-hidden border-white/10 bg-[#032842] p-0 text-white sm:max-w-lg">
        <DialogHeader className="shrink-0 gap-1.5 border-b border-white/10 px-4 py-4 pr-12">
          <DialogTitle className="text-xl font-semibold text-white">
            Get a Quote
          </DialogTitle>
          <DialogDescription className="sr-only">
            Project enquiry form
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <ConsultationFormPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
