import Link from "next/link";
import { Suspense } from "react";

import {
  SpeedometerGauges,
  type SpeedometerMetric,
} from "@/components/admin/speedometer-gauge";
import { listLeads } from "@/lib/firebase/leads";
import { listProjects } from "@/lib/firebase/projects";
import { listProviders } from "@/lib/firebase/providers";
import { getVerifiedSession } from "@/lib/firebase/session";
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
  title: "Admin",
  description: "Ngaris Construction admin dashboard.",
};

function gaugeMax(value: number, floor = 5) {
  return Math.max(floor, Math.ceil(value * 1.25) || floor);
}

function StatsFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {["Leads", "Contractors", "Projects"].map((title) => (
        <div
          key={title}
          className="rounded-2xl border border-[#032842]/6 bg-white p-5 shadow-[0_12px_32px_rgba(3,40,66,0.05)]"
        >
          <h2 className="text-center text-base font-semibold">{title}</h2>
          <p className="mt-10 text-center text-sm text-[#032842]/35">Loading…</p>
        </div>
      ))}
    </div>
  );
}

async function DashboardStats() {
  const session = await getVerifiedSession();
  const [leads, providers, projects] = await Promise.all([
    listLeads({ limit: 100 }),
    listProviders({ limit: 100 }),
    listProjects({ limit: 100 }),
  ]);

  const verifiedCount = providers.filter(
    (p) => p.verificationStatus === "verified",
  ).length;
  const openLeads = leads.filter(
    (l) => l.status === "new" || l.status === "contacted",
  ).length;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const metrics: SpeedometerMetric[] = [
    {
      title: "Leads",
      href: "/admin/leads",
      value: leads.length,
      max: gaugeMax(leads.length),
      detail:
        openLeads > 0
          ? `${openLeads} open`
          : leads.length
            ? "All reviewed"
            : "None yet",
    },
    {
      title: "Contractors",
      href: "/admin/providers",
      value: providers.length,
      max: gaugeMax(providers.length),
      detail:
        verifiedCount > 0
          ? `${verifiedCount} verified`
          : providers.length
            ? "Awaiting review"
            : "None yet",
    },
    {
      title: "Projects",
      href: "/admin/projects",
      value: projects.length,
      max: gaugeMax(projects.length),
      detail:
        activeProjects > 0
          ? `${activeProjects} active`
          : projects.length
            ? "None active"
            : "None yet",
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome{session?.email ? `, ${session.email.split("@")[0]}` : ""}
      </h1>

      <SpeedometerGauges metrics={metrics} />

      {projects.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Projects</h2>
            <Link
              href="/admin/projects"
              className="text-sm font-medium text-[#032842]/55 hover:text-[#032842]"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
            <ul className="divide-y divide-[#032842]/6">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/admin/projects?id=${encodeURIComponent(project.id)}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#032842]/[0.03]"
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
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {providers.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Contractors</h2>
            <Link
              href="/admin/providers"
              className="text-sm font-medium text-[#032842]/55 hover:text-[#032842]"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
            <ul className="divide-y divide-[#032842]/6">
              {providers.slice(0, 5).map((provider) => {
                const trade =
                  providerTradeLabels[
                    provider.trade as (typeof providerTrades)[number]
                  ] ?? provider.trade;
                return (
                  <li key={provider.id}>
                    <Link
                      href={`/admin/providers?id=${encodeURIComponent(provider.id)}`}
                      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#032842]/[0.03]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#032842]">
                          {provider.companyName}
                        </p>
                        <p className="truncate text-xs text-[#032842]/45">
                          {trade} · {provider.city}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                        {providerVerificationLabels[
                          provider.verificationStatus
                        ] ?? provider.verificationStatus}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<StatsFallback />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
