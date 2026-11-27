import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { listProjectsByContractorOwnerUid } from "@/lib/firebase/projects";
import { getProviderByOwnerUid } from "@/lib/firebase/providers";
import { getSessionContext } from "@/lib/firebase/session-context";
import {
  providerTradeLabels,
  providerVerificationLabels,
  type providerTrades,
} from "@/lib/validations/provider";
import {
  projectStatusLabels,
  type ProjectStatus,
} from "@/lib/validations/project";

export const instant = false;

export const metadata = {
  title: "Contractor portal",
  description: "Your Ngaris Construction contractor dashboard.",
};

async function PortalContent() {
  const session = await getSessionContext();
  if (!session?.isContractor) {
    redirect("/contractor/login");
  }

  const provider = await getProviderByOwnerUid(session.user.uid);

  if (!provider) {
    return (
      <div className="rounded-2xl border border-[#032842]/8 bg-white p-6">
        <h1 className="text-2xl font-bold tracking-tight">No application yet</h1>
        <Link
          href="/contractor/apply"
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#EDB254] px-4 text-sm font-semibold text-[#032842]"
        >
          Apply now
        </Link>
      </div>
    );
  }

  const verified = provider.verificationStatus === "verified";
  const needsInfo = provider.verificationStatus === "needs_info";

  const tradeLabel =
    providerTradeLabels[
      provider.trade as (typeof providerTrades)[number]
    ] ?? provider.trade;

  const statusLabel =
    providerVerificationLabels[provider.verificationStatus] ??
    provider.verificationStatus;

  const projects = verified
    ? await listProjectsByContractorOwnerUid(session.user.uid, { limit: 50 })
    : [];

  const activeCount = projects.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {provider.companyName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={
                verified
                  ? "rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-emerald-800 uppercase"
                  : "rounded-md bg-[#032842]/6 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#032842] uppercase"
              }
            >
              {statusLabel}
            </span>
            <span className="text-sm text-[#032842]/50">{tradeLabel}</span>
            <span className="text-sm text-[#032842]/40">· {provider.city}</span>
          </div>
        </div>
        <Link
          href="/contractor/profile"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-[#032842]/12 bg-white px-4 text-sm font-medium text-[#032842] transition-colors hover:bg-[#032842]/4"
        >
          Edit profile
        </Link>
      </div>

      {needsInfo ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">Action needed</p>
          {provider.reviewNote ? (
            <p className="mt-1 text-sm text-amber-900/80">{provider.reviewNote}</p>
          ) : null}
          <Link
            href="/contractor/profile"
            className="mt-3 inline-flex h-9 items-center rounded-lg bg-[#032842] px-3.5 text-sm font-semibold text-white"
          >
            Update profile
          </Link>
        </div>
      ) : null}

      {provider.reviewNote && !needsInfo ? (
        <div className="rounded-2xl border border-[#032842]/8 bg-white px-5 py-4">
          <p className="text-[11px] font-semibold tracking-wide text-[#032842]/45 uppercase">
            Reviewer note
          </p>
          <p className="mt-1 text-sm text-[#032842]/75">{provider.reviewNote}</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard label="Contact" value={provider.contactName} />
        <InfoCard label="Phone" value={provider.phone} />
      </div>

      {verified ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Projects</h2>
            <span className="rounded-md bg-[#032842]/5 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842]/45 uppercase">
              {activeCount} active
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#032842]/15 bg-white p-6">
              <p className="text-sm text-[#032842]/55">No assigned projects yet</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
              <ul className="divide-y divide-[#032842]/6">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#032842]">
                        {project.title}
                      </p>
                      <p className="truncate text-xs text-[#032842]/45">
                        {project.clientName} · {project.location}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                      {projectStatusLabels[project.status as ProjectStatus] ??
                        project.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

export default function ContractorPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-[#032842]/8 bg-white px-6 py-10 text-sm text-[#032842]/45">
          Loading…
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#032842]/8 bg-white p-4">
      <p className="text-[11px] font-semibold tracking-wide text-[#032842]/40 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[#032842]">{value}</p>
    </div>
  );
}
