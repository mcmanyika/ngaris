import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

import { ConsultationIntroButton } from "@/components/landing/consultation-intro-button";
import { listVerifiedProvidersPublic } from "@/lib/firebase/providers";
import {
  providerTradeLabels,
  type providerTrades,
} from "@/lib/validations/provider";

function tradeLabel(trade: string) {
  return (
    providerTradeLabels[trade as (typeof providerTrades)[number]] ?? trade
  );
}

async function ContractorsGrid() {
  const providers = await listVerifiedProvidersPublic({ limit: 6 });

  if (providers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#032842]/15 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-[#032842]">
          Verified contractors will appear here soon
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <li key={provider.id}>
          <div className="flex h-full flex-col rounded-2xl border border-[#032842]/8 bg-white p-5 shadow-[0_12px_32px_rgba(3,40,66,0.04)]">
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#032842]">
                {provider.companyName}
              </p>
              <p className="mt-0.5 truncate text-sm text-[#032842]/50">
                {tradeLabel(provider.trade)} · {provider.city}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
              <span className="text-[11px] text-[#032842]/35">
                Details on request
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function GridFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[116px] animate-pulse rounded-2xl border border-[#032842]/6 bg-white"
        />
      ))}
    </div>
  );
}

export function VerifiedContractors() {
  return (
    <section
      id="contractors"
      className="scroll-mt-20 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#032842]/40 uppercase">
              Network
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#032842] sm:text-4xl">
              Verified contractors
            </h2>
            <p className="mt-2 text-sm text-[#032842]/55">
              Registered partners in our network. Contact details are shared
              only after consultation.
            </p>
          </div>
          <ConsultationIntroButton />
        </div>

        <div className="mt-10">
          <Suspense fallback={<GridFallback />}>
            <ContractorsGrid />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
