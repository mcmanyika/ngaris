import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProductWindowProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  toolbar?: ReactNode;
};

export function ProductWindow({
  title = "Ngaris Managed",
  children,
  className,
  toolbar,
}: ProductWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#0B1C2A] shadow-[0_30px_80px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/8 bg-[#102536] px-3 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-center text-[11px] text-white/55">
          app.ngarismanaged.com/{title.toLowerCase().replace(/\s+/g, "-")}
        </div>
        {toolbar}
      </div>
      <div className="bg-[#0D2536]">{children}</div>
    </div>
  );
}
