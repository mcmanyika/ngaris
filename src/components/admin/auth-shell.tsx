import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AdminAuthShell({
  title,
  children,
  footer,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#022848] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, #1a4a6e 0%, transparent 55%)",
        }}
        aria-hidden
      />

      <div
        className={`relative z-10 mx-auto flex w-full flex-1 flex-col justify-center px-4 py-16 ${
          wide ? "max-w-xl" : "max-w-md"
        }`}
      >
        <Link
          href="/"
          className="mb-8 inline-flex self-start rounded-lg bg-white px-2.5 py-1.5 shadow-sm"
        >
          <Image
            src="/brand/logo.png"
            alt="Ngaris Construction"
            width={160}
            height={42}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <div className="mt-6">{children}</div>
        </div>

        <div className="mt-6 space-y-2 text-center text-xs text-white/45">
          {footer}
          <p>
            <Link
              href="/"
              className="underline-offset-2 hover:text-white hover:underline"
            >
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
