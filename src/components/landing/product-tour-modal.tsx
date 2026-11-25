"use client";

import type { ReactElement } from "react";

import {
  ApprovalsMock,
  DashboardMock,
  ProgressMock,
} from "@/components/landing/app-mocks";
import { ProductWindow } from "@/components/landing/product-window";
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
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0D2536] p-0 text-white sm:max-w-2xl">
        <DialogHeader className="border-b border-white/10 px-4 pt-4 pb-3">
          <DialogTitle className="font-[family-name:var(--font-display)] text-white">
            Product tour
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Three core screens from the Ngaris Managed workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 p-3 sm:p-4">
          <ProductWindow title="dashboard">
            <DashboardMock />
          </ProductWindow>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProductWindow title="reports">
              <ProgressMock />
            </ProductWindow>
            <ProductWindow title="approvals">
              <ApprovalsMock />
            </ProductWindow>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
