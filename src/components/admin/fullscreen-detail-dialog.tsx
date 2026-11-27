"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FullscreenDetailDialog({
  open,
  onOpenChange,
  title,
  badge,
  meta,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  badge?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-0 top-0 left-0 z-[110] flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-[#F4F7FA] p-0 text-[#032842] ring-0 data-open:zoom-in-100 data-closed:zoom-out-100 sm:max-w-none"
      >
        <DialogHeader className="shrink-0 border-b border-[#032842]/8 bg-white px-4 py-4 pr-14 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">
              {title}
            </DialogTitle>
            {badge}
          </div>
          {meta ? <div className="mt-1 text-sm text-[#032842]/55">{meta}</div> : null}
          <DialogDescription className="sr-only">Details</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
